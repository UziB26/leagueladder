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

            // Ensure player ratings exist (create if they don't)
            const ensureRating = dbInstance.prepare(`
              INSERT OR IGNORE INTO player_ratings (id, player_id, league_id, rating, games_played, wins, losses, draws)
              VALUES (?, ?, ?, 1000, 0, 0, 0, 0)
            `)
            
            const ratingId1 = crypto.randomUUID()
            const ratingId2 = crypto.randomUUID()
            ensureRating.run(ratingId1, match.player1_id, match.league_id)
            ensureRating.run(ratingId2, match.player2_id, match.league_id)
            
            // Get current ratings BEFORE updating (to avoid trigger interference)
            console.log('Fetching current ratings...')
            const rating1 = getRating.get(match.player1_id, match.league_id) as any
            const rating2 = getRating.get(match.player2_id, match.league_id) as any
            
            if (!rating1) {
              console.error('Player1 rating not found after creation attempt:', {
                playerId: match.player1_id,
                leagueId: match.league_id,
                matchId: sanitizedMatchId
              })
              throw new Error(`Player1 rating not found. Player ID: ${match.player1_id}, League: ${match.league_id}`)
            }
            
            if (!rating2) {
              console.error('Player2 rating not found after creation attempt:', {
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
            console.log('Calculating ELO with inputs:', {
              player1Rating: rating1.rating,
              player2Rating: rating2.rating,
              player1Score: match.player1_score,
              player2Score: match.player2_score
            })
            
            const result = elo.calculateForMatch(
              rating1.rating,
              rating2.rating,
              match.player1_score,
              match.player2_score
            )
            
            console.log('Elo calculation result:', {
              player1: { 
                old: rating1.rating, 
                new: result.newRatingA, 
                change: result.changeA,
                willChange: rating1.rating !== result.newRatingA
              },
              player2: { 
                old: rating2.rating, 
                new: result.newRatingB, 
                change: result.changeB,
                willChange: rating2.rating !== result.newRatingB
              },
              matchId: sanitizedMatchId
            })
            
            // Verify that ratings will actually change
            if (result.newRatingA === rating1.rating && result.newRatingB === rating2.rating) {
              console.error('ERROR: ELO calculation returned unchanged ratings!', {
                player1: { old: rating1.rating, new: result.newRatingA },
                player2: { old: rating2.rating, new: result.newRatingB },
                scores: { player1: match.player1_score, player2: match.player2_score }
              })
              // Don't throw - let it continue to see what happens
            }
            
            // Update player 1 rating
            // Ensure rating is an integer
            const newRating1 = Math.round(result.newRatingA)
            console.log('Updating player1 rating...', {
              playerId: match.player1_id,
              leagueId: match.league_id,
              old: rating1.rating,
              new: newRating1,
              change: result.changeA
            })
            
            // Verify the rating will actually change
            if (rating1.rating === newRating1) {
              console.warn('WARNING: Player1 rating would not change!', {
                current: rating1.rating,
                calculated: newRating1
              })
            }
            
            const updateResult1 = updateRating.run(
              newRating1,
              match.player1_id,
              match.league_id
            )
            console.log('Player1 rating update result:', {
              changes: updateResult1.changes,
              lastInsertRowid: updateResult1.lastInsertRowid
            })
            
            if (updateResult1.changes === 0) {
              // Check if rating already matches (might be a no-op)
              const currentRating = getRating.get(match.player1_id, match.league_id) as any
              if (currentRating?.rating !== newRating1) {
                throw new Error(`Failed to update rating for player1: ${match.player1_id} in league: ${match.league_id}. Current: ${currentRating?.rating}, Expected: ${newRating1}`)
              } else {
                console.log('Player1 rating already at expected value, skipping update')
              }
            }
            
            // Update player 2 rating
            // Ensure rating is an integer
            const newRating2 = Math.round(result.newRatingB)
            console.log('Updating player2 rating...', {
              playerId: match.player2_id,
              leagueId: match.league_id,
              old: rating2.rating,
              new: newRating2,
              change: result.changeB
            })
            
            // Verify the rating will actually change
            if (rating2.rating === newRating2) {
              console.warn('WARNING: Player2 rating would not change!', {
                current: rating2.rating,
                calculated: newRating2
              })
            }
            
            const updateResult2 = updateRating.run(
              newRating2,
              match.player2_id,
              match.league_id
            )
            console.log('Player2 rating update result:', {
              changes: updateResult2.changes,
              lastInsertRowid: updateResult2.lastInsertRowid
            })
            
            if (updateResult2.changes === 0) {
              // Check if rating already matches (might be a no-op)
              const currentRating = getRating.get(match.player2_id, match.league_id) as any
              if (currentRating?.rating !== newRating2) {
                throw new Error(`Failed to update rating for player2: ${match.player2_id} in league: ${match.league_id}. Current: ${currentRating?.rating}, Expected: ${newRating2}`)
              } else {
                console.log('Player2 rating already at expected value, skipping update')
              }
            }
            
            // Verify the updates were applied
            const verifyRating1 = getRating.get(match.player1_id, match.league_id) as any
            const verifyRating2 = getRating.get(match.player2_id, match.league_id) as any
            
            console.log('Verification - ratings after update:', {
              player1: verifyRating1?.rating,
              player2: verifyRating2?.rating,
              expected1: newRating1,
              expected2: newRating2
            })
            
            if (verifyRating1?.rating !== newRating1 || verifyRating2?.rating !== newRating2) {
              console.error('Rating verification failed:', {
                expected: { player1: newRating1, player2: newRating2 },
                actual: { player1: verifyRating1?.rating, player2: verifyRating2?.rating }
              })
              throw new Error(`Rating update verification failed. Expected: player1=${newRating1}, player2=${newRating2}. Actual: player1=${verifyRating1?.rating}, player2=${verifyRating2?.rating}`)
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
              newRating1,
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
              newRating2,
              result.changeB
            )
            console.log('Rating update 2 inserted, changes:', insertResult2.changes)
            
            if (insertResult2.changes === 0) {
              throw new Error(`Failed to insert rating update for player2: ${match.player2_id}`)
            }
            
            console.log('Rating updates recorded:', {
              player1: { updateId: updateId1, old: rating1.rating, new: newRating1, change: result.changeA },
              player2: { updateId: updateId2, old: rating2.rating, new: newRating2, change: result.changeB }
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
          // better-sqlite3 transactions automatically commit on success or rollback on error
          try {
            const transactionResult = transaction()
            console.log('=== TRANSACTION EXECUTED ===', transactionResult)
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
          
          // Force a small delay to ensure transaction is fully committed
          // This is a workaround for potential timing issues
          await new Promise(resolve => setTimeout(resolve, 10))
          
          // Verify ratings were updated after transaction commits
          // Use dbInstance to ensure we're querying the same database instance
          // Create fresh prepared statements to avoid any caching issues
          const verifyRatingQuery = dbInstance.prepare(`
            SELECT rating, updated_at FROM player_ratings
            WHERE player_id = ? AND league_id = ?
          `)
          
          const finalRating1 = verifyRatingQuery.get(match.player1_id, match.league_id) as any
          const finalRating2 = verifyRatingQuery.get(match.player2_id, match.league_id) as any
          
          console.log('Final ratings after transaction:', {
            player1: { id: match.player1_id, rating: finalRating1?.rating, updated_at: finalRating1?.updated_at },
            player2: { id: match.player2_id, rating: finalRating2?.rating, updated_at: finalRating2?.updated_at }
          })
          
          // Verify rating updates were inserted
          const ratingUpdatesQuery = dbInstance.prepare(`
            SELECT * FROM rating_updates WHERE match_id = ?
          `)
          const ratingUpdates = ratingUpdatesQuery.all(sanitizedMatchId) as any[]
          
          console.log('Rating updates in database:', ratingUpdates.length, 'records')
          if (ratingUpdates.length > 0) {
            console.log('Rating update details:', ratingUpdates)
          } else {
            console.error('WARNING: No rating updates found in database!')
          }
          
          // Double-check that ratings actually changed
          if (finalRating1?.rating === 1000 && finalRating2?.rating === 1000) {
            console.error('WARNING: Ratings are still at default 1000! This suggests the update did not work.')
            // Try to get the match to see what happened
            const matchCheck = dbInstance.prepare('SELECT * FROM matches WHERE id = ?').get(sanitizedMatchId) as any
            console.error('Match status:', matchCheck?.status)
            console.error('Match winner:', matchCheck?.winner_id)
          }
          
          console.log('=== MATCH CONFIRMATION SUCCESS ===')

          // Double-check ratings one more time before returning
          const finalCheck1 = dbInstance.prepare(`
            SELECT rating FROM player_ratings
            WHERE player_id = ? AND league_id = ?
          `).get(match.player1_id, match.league_id) as any
          
          const finalCheck2 = dbInstance.prepare(`
            SELECT rating FROM player_ratings
            WHERE player_id = ? AND league_id = ?
          `).get(match.player2_id, match.league_id) as any
          
          console.log('Final check before response:', {
            player1: finalCheck1?.rating,
            player2: finalCheck2?.rating
          })
          
          return NextResponse.json({
            success: true,
            message: 'Match confirmed successfully. Ratings have been updated.',
            ratings: {
              player1: finalCheck1?.rating || finalRating1?.rating,
              player2: finalCheck2?.rating || finalRating2?.rating
            }
          }, {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
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
