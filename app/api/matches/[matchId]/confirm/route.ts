import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, getDatabase, DatabaseTransaction, createBackup, restoreBackup } from '@/lib/db'
import { elo } from '@/lib/elo'
import { apiRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { z } from 'zod'
import crypto from 'crypto'

interface User {
  id: string
  email: string
}

interface Player {
  id: string
  user_id: string
}

/**
 * POST /api/matches/[matchId]/confirm
 * Confirm a match result reported by opponent
 * 
 * Request Body:
 * {
 *   action: 'confirmed' | 'disputed',
 *   dispute_reason?: string,  // Required if action is 'disputed'
 *   confirmed_score1?: number,  // Optional: if disputing, provide correct scores
 *   confirmed_score2?: number
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { matchId } = await params
    const sanitizedMatchId = sanitizeUUID(matchId)
    if (!sanitizedMatchId) {
      return NextResponse.json(
        { error: 'Invalid match ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, dispute_reason, confirmed_score1, confirmed_score2 } = body

    if (!action || !['confirmed', 'disputed'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "confirmed" or "disputed"' },
        { status: 400 }
      )
    }

    if (action === 'disputed' && !dispute_reason) {
      return NextResponse.json(
        { error: 'Dispute reason is required when disputing a match' },
        { status: 400 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Get the match
    const match = db.prepare(`
      SELECT m.*, p1.name as player1_name, p2.name as player2_name
      FROM matches m
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE m.id = ?
    `).get(sanitizedMatchId) as any

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    console.log('Match found:', {
      id: match.id,
      status: match.status,
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      league_id: match.league_id
    })

    // Verify the player is part of this match
    if (player.id !== match.player1_id && player.id !== match.player2_id) {
      return NextResponse.json(
        { error: 'You can only confirm matches you participated in' },
        { status: 403 }
      )
    }

    // Verify match is pending confirmation
    if (match.status !== 'pending_confirmation') {
      return NextResponse.json(
        { error: `Match is not pending confirmation. Current status: ${match.status}` },
        { status: 400 }
      )
    }

    // Verify player is not the one who reported
    if (match.reported_by === player.id) {
      return NextResponse.json(
        { error: 'You cannot confirm your own match report' },
        { status: 400 }
      )
    }

    // Check if player already confirmed/disputed
    const existingConfirmation = db.prepare(`
      SELECT * FROM match_confirmations 
      WHERE match_id = ? AND player_id = ?
    `).get(sanitizedMatchId, player.id) as any

    if (existingConfirmation) {
      return NextResponse.json(
        { error: 'You have already responded to this match' },
        { status: 400 }
      )
    }

    // Create backup before making changes
    const backup = createBackup({
      matchIds: [sanitizedMatchId],
      playerIds: [match.player1_id, match.player2_id],
    })

    try {
      if (action === 'confirmed') {
        // Player confirmed the match
        console.log('=== MATCH CONFIRMATION START ===')
        console.log('Match ID:', sanitizedMatchId)
        console.log('Player confirming:', player.id)
        console.log('Match data:', {
          player1_id: match.player1_id,
          player2_id: match.player2_id,
          league_id: match.league_id,
          player1_score: match.player1_score,
          player2_score: match.player2_score,
          status: match.status
        })
        
        try {
          // Get the actual database instance (not proxy) for transaction
          // Transactions need the actual instance, not the proxy
          const dbInstance = getDatabase()
          
          // Use better-sqlite3's built-in transaction for better reliability
          const transaction = dbInstance.transaction(() => {
            console.log('=== TRANSACTION STARTED ===')
            
            // Prepare all statements inside transaction
            const insertConfirmation = dbInstance.prepare(`
              INSERT INTO match_confirmations (id, match_id, player_id, action, created_at)
              VALUES (?, ?, ?, 'confirmed', CURRENT_TIMESTAMP)
            `)
            
            const updateMatchStatus = dbInstance.prepare(`
              UPDATE matches
              SET status = 'completed', confirmed_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `)
            
            const getRating = dbInstance.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `)
            
            const updateRating = dbInstance.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `)
            
            const insertRatingUpdate = dbInstance.prepare(`
              INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `)
            
            const updateChallenge = dbInstance.prepare(`
              UPDATE challenges
              SET status = 'completed'
              WHERE id = ? AND status = 'accepted'
            `)
            
            // Record confirmation
            const confirmationId = crypto.randomUUID()
            console.log('Inserting confirmation:', confirmationId)
            const confResult = insertConfirmation.run(confirmationId, sanitizedMatchId, player.id)
            console.log('Confirmation inserted, changes:', confResult.changes)

            // Update match status to completed
            // This will trigger update_player_stats_on_match_completion which updates wins/losses/draws
            console.log('Updating match status to completed')
            const matchStatusResult = updateMatchStatus.run(sanitizedMatchId)
            console.log('Match status updated, changes:', matchStatusResult.changes)

            // Get current ratings BEFORE updating (to avoid trigger interference)
            console.log('Fetching current ratings...')
            const rating1 = getRating.get(match.player1_id, match.league_id) as any
            const rating2 = getRating.get(match.player2_id, match.league_id) as any
            
            if (!rating1) {
              console.error('Player1 rating not found:', {
                playerId: match.player1_id,
                leagueId: match.league_id,
                matchId: sanitizedMatchId
              })
              throw new Error(`Player1 rating not found. Player ID: ${match.player1_id}, League: ${match.league_id}`)
            }
            
            if (!rating2) {
              console.error('Player2 rating not found:', {
                playerId: match.player2_id,
                leagueId: match.league_id,
                matchId: sanitizedMatchId
              })
              throw new Error(`Player2 rating not found. Player ID: ${match.player2_id}, League: ${match.league_id}`)
            }
            
            console.log('Current ratings before update:', {
              player1: { id: match.player1_id, rating: rating1.rating },
              player2: { id: match.player2_id, rating: rating2.rating }
            })
            
            // Calculate new Elo ratings
            const result = elo.calculateForMatch(
              rating1.rating,
              rating2.rating,
              match.player1_score,
              match.player2_score
            )
            
            console.log('Elo calculation result:', {
              player1: { old: rating1.rating, new: result.newRatingA, change: result.changeA },
              player2: { old: rating2.rating, new: result.newRatingB, change: result.changeB },
              matchId: sanitizedMatchId
            })
            
            // Update player 1 rating
            console.log('Updating player1 rating...')
            const updateResult1 = updateRating.run(
              result.newRatingA,
              match.player1_id,
              match.league_id
            )
            console.log('Player1 rating update result, changes:', updateResult1.changes)
            
            if (updateResult1.changes === 0) {
              throw new Error(`Failed to update rating for player1: ${match.player1_id} in league: ${match.league_id}`)
            }
            
            // Update player 2 rating
            console.log('Updating player2 rating...')
            const updateResult2 = updateRating.run(
              result.newRatingB,
              match.player2_id,
              match.league_id
            )
            console.log('Player2 rating update result, changes:', updateResult2.changes)
            
            if (updateResult2.changes === 0) {
              throw new Error(`Failed to update rating for player2: ${match.player2_id} in league: ${match.league_id}`)
            }
            
            // Verify the updates were applied
            const verifyRating1 = getRating.get(match.player1_id, match.league_id) as any
            const verifyRating2 = getRating.get(match.player2_id, match.league_id) as any
            
            console.log('Verification - ratings after update:', {
              player1: verifyRating1?.rating,
              player2: verifyRating2?.rating,
              expected1: result.newRatingA,
              expected2: result.newRatingB
            })
            
            if (verifyRating1?.rating !== result.newRatingA || verifyRating2?.rating !== result.newRatingB) {
              console.error('Rating verification failed:', {
                expected: { player1: result.newRatingA, player2: result.newRatingB },
                actual: { player1: verifyRating1?.rating, player2: verifyRating2?.rating }
              })
              throw new Error('Rating update verification failed')
            }
            
            // Record rating updates
            console.log('Inserting rating updates...')
            const updateId1 = crypto.randomUUID()
            const insertResult1 = insertRatingUpdate.run(
              updateId1,
              sanitizedMatchId,
              match.player1_id,
              match.league_id,
              rating1.rating,
              result.newRatingA,
              result.changeA
            )
            console.log('Rating update 1 inserted, changes:', insertResult1.changes)
            
            if (insertResult1.changes === 0) {
              throw new Error(`Failed to insert rating update for player1: ${match.player1_id}`)
            }
            
            const updateId2 = crypto.randomUUID()
            const insertResult2 = insertRatingUpdate.run(
              updateId2,
              sanitizedMatchId,
              match.player2_id,
              match.league_id,
              rating2.rating,
              result.newRatingB,
              result.changeB
            )
            console.log('Rating update 2 inserted, changes:', insertResult2.changes)
            
            if (insertResult2.changes === 0) {
              throw new Error(`Failed to insert rating update for player2: ${match.player2_id}`)
            }
            
            console.log('Rating updates recorded:', {
              player1: { updateId: updateId1, change: result.changeA },
              player2: { updateId: updateId2, change: result.changeB }
            })

            // Note: Player stats (wins/losses/draws) are automatically updated by the 
            // update_player_stats_on_match_completion trigger when status changes to 'completed'

            // Mark challenge as completed if exists
            if (match.challenge_id) {
              console.log('Updating challenge status...')
              const challengeResult = updateChallenge.run(match.challenge_id)
              console.log('Challenge updated, changes:', challengeResult.changes)
            }
            
            console.log('=== TRANSACTION COMPLETING (about to commit) ===')
          })
          
          // Execute the transaction with error handling
          try {
            transaction()
            console.log('=== TRANSACTION COMMITTED SUCCESSFULLY ===')
          } catch (txError: any) {
            console.error('=== TRANSACTION EXECUTION ERROR ===')
            console.error('Error type:', txError?.constructor?.name)
            console.error('Error message:', txError?.message)
            console.error('Error stack:', txError?.stack)
            console.error('Full error:', txError)
            console.error('=== END TRANSACTION EXECUTION ERROR ===')
            throw txError
          }
          
          // Verify ratings were updated after transaction commits
          const finalRating1 = db.prepare(`
            SELECT rating FROM player_ratings
            WHERE player_id = ? AND league_id = ?
          `).get(match.player1_id, match.league_id) as any
          
          const finalRating2 = db.prepare(`
            SELECT rating FROM player_ratings
            WHERE player_id = ? AND league_id = ?
          `).get(match.player2_id, match.league_id) as any
          
          console.log('Final ratings after transaction:', {
            player1: { id: match.player1_id, rating: finalRating1?.rating },
            player2: { id: match.player2_id, rating: finalRating2?.rating }
          })
          
          // Verify rating updates were inserted
          const ratingUpdates = db.prepare(`
            SELECT * FROM rating_updates WHERE match_id = ?
          `).all(sanitizedMatchId) as any[]
          
          console.log('Rating updates in database:', ratingUpdates.length, 'records')
          if (ratingUpdates.length > 0) {
            console.log('Rating update details:', ratingUpdates)
          } else {
            console.error('WARNING: No rating updates found in database!')
          }
          
          console.log('=== MATCH CONFIRMATION SUCCESS ===')

          return NextResponse.json({
            success: true,
            message: 'Match confirmed successfully. Ratings have been updated.',
            ratings: {
              player1: finalRating1?.rating,
              player2: finalRating2?.rating
            }
          })
        } catch (txError: any) {
          console.error('=== TRANSACTION ERROR ===')
          console.error('Error type:', txError?.constructor?.name)
          console.error('Error message:', txError?.message)
          console.error('Error stack:', txError?.stack)
          console.error('Full error:', txError)
          console.error('=== END TRANSACTION ERROR ===')
          throw txError
        }
      } else {
        // Player disputed the match
        DatabaseTransaction.execute((tx) => {
          // Record dispute
          const confirmationId = crypto.randomUUID()
          tx.run(
            db.prepare(`
              INSERT INTO match_confirmations (
                id, match_id, player_id, action, dispute_reason,
                confirmed_score1, confirmed_score2, created_at
              )
              VALUES (?, ?, ?, 'disputed', ?, ?, ?, CURRENT_TIMESTAMP)
            `),
            confirmationId,
            sanitizedMatchId,
            player.id,
            dispute_reason || '',
            confirmed_score1 || null,
            confirmed_score2 || null
          )

          // Update match status to disputed
          tx.run(
            db.prepare(`
              UPDATE matches
              SET status = 'disputed'
              WHERE id = ?
            `),
            sanitizedMatchId
          )
        })

        return NextResponse.json({
          success: true,
          message: 'Match disputed. An admin will review the dispute.'
        })
      }
    } catch (error: any) {
      // Rollback using backup if transaction fails
      console.error('=== OUTER CATCH ERROR ===')
      console.error('Error type:', error?.constructor?.name)
      console.error('Error message:', error?.message)
      console.error('Error stack:', error?.stack)
      console.error('Full error:', error)
      console.error('=== END OUTER CATCH ERROR ===')
      try {
        restoreBackup(backup)
        console.log('Backup restored successfully')
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      throw error
    }
  } catch (error: any) {
    console.error('=== FINAL CATCH ERROR ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error:', error)
    console.error('=== END FINAL CATCH ERROR ===')
    return NextResponse.json(
      { 
        error: error.message || 'Failed to confirm match',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
