import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, dbHelpers, DatabaseTransaction, validateMatchData, createBackup, restoreBackup } from '@/lib/db'
import { elo } from '@/lib/elo'
import { sanitizeUUID, sanitizeInteger } from '@/lib/sanitize'
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
 * GET /api/matches/[matchId]
 * Get specific match details including rating updates
 * 
 * Response:
 * {
 *   match: {
 *     id: string,
 *     challenge_id: string | null,
 *     player1_id: string,
 *     player2_id: string,
 *     player1_score: number,
 *     player2_score: number,
 *     winner_id: string | null,
 *     league_id: string,
 *     status: string,
 *     played_at: string,
 *     confirmed_at: string | null,
 *     league_name: string,
 *     player1_name: string,
 *     player2_name: string,
 *     rating_updates: {
 *       player1: { old_rating, new_rating, change } | null,
 *       player2: { old_rating, new_rating, change } | null
 *     }
 *   }
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get match with player and league information
    const match = db.prepare(`
      SELECT 
        m.id,
        m.challenge_id,
        m.player1_id,
        m.player2_id,
        m.player1_score,
        m.player2_score,
        m.winner_id,
        m.league_id,
        m.status,
        m.played_at,
        m.confirmed_at,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE m.id = ?
    `).get(matchId) as any

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Get rating updates for both players
    const ratingUpdate1 = db.prepare(`
      SELECT old_rating, new_rating, change
      FROM rating_updates
      WHERE match_id = ? AND player_id = ?
      LIMIT 1
    `).get(matchId, match.player1_id) as any

    const ratingUpdate2 = db.prepare(`
      SELECT old_rating, new_rating, change
      FROM rating_updates
      WHERE match_id = ? AND player_id = ?
      LIMIT 1
    `).get(matchId, match.player2_id) as any

    return NextResponse.json({
      match: {
        ...match,
        rating_updates: {
          player1: ratingUpdate1 || null,
          player2: ratingUpdate2 || null
        }
      }
    })

  } catch (error: any) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/matches/[matchId]
 * Update match details (admin only)
 * 
 * Request Body:
 * {
 *   player1Score?: number,
 *   player2Score?: number,
 *   status?: string,
 *   winnerId?: string | null
 * }
 * 
 * Note: This endpoint should be restricted to admins in production.
 * Currently allows any authenticated user for development purposes.
 * 
 * When scores or status change, ratings will be recalculated:
 * - If match was completed and is being updated, old ratings are reverted
 * - If match is being marked as completed, new ratings are calculated
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Add admin check here
    // For now, allow any authenticated user to update matches
    // In production, check if user has admin role:
    // const isAdmin = await checkAdminRole(session.user.email)
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const { matchId } = await params
    
    // Sanitize match ID
    const sanitizedMatchId = sanitizeUUID(matchId)
    if (!sanitizedMatchId) {
      return NextResponse.json(
        { error: 'Invalid match ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { player1Score, player2Score, status, winnerId } = body

    // Get existing match
    const existingMatch = db.prepare('SELECT * FROM matches WHERE id = ?').get(sanitizedMatchId) as any

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Validate input data
    const finalPlayer1Score = player1Score !== undefined ? player1Score : existingMatch.player1_score
    const finalPlayer2Score = player2Score !== undefined ? player2Score : existingMatch.player2_score
    const finalStatus = status !== undefined ? status : existingMatch.status

    // Validate match data if scores are being updated
    if (player1Score !== undefined || player2Score !== undefined) {
      const matchValidation = validateMatchData({
        player1Id: existingMatch.player1_id,
        player2Id: existingMatch.player2_id,
        leagueId: existingMatch.league_id,
        player1Score: finalPlayer1Score,
        player2Score: finalPlayer2Score,
        challengeId: existingMatch.challenge_id,
        status: finalStatus,
      })

      if (!matchValidation.valid) {
        return NextResponse.json(
          { error: 'Invalid match data', details: matchValidation.errors },
          { status: 400 }
        )
      }
    }

    // Sanitize inputs
    const sanitizedPlayer1Score = player1Score !== undefined 
      ? sanitizeInteger(player1Score, 0, 1000) 
      : existingMatch.player1_score
    const sanitizedPlayer2Score = player2Score !== undefined 
      ? sanitizeInteger(player2Score, 0, 1000) 
      : existingMatch.player2_score

    if (sanitizedPlayer1Score === null || sanitizedPlayer2Score === null) {
      return NextResponse.json(
        { error: 'Invalid score values' },
        { status: 400 }
      )
    }

    const wasCompleted = existingMatch.status === 'completed'
    const willBeCompleted = finalStatus === 'completed'

    // Get challenge_id before update (if exists)
    const challengeId = existingMatch.challenge_id

    // Create backup of player ratings and match before making changes
    const backup = createBackup({
      matchIds: [sanitizedMatchId],
      playerIds: [existingMatch.player1_id, existingMatch.player2_id],
      challengeIds: challengeId ? [challengeId] : undefined,
    })

    // Use transaction for atomic match update with backup/rollback support
    try {
      DatabaseTransaction.execute((tx) => {
        // If match was completed and we're changing scores or status, revert ratings
        if (wasCompleted && (player1Score !== undefined || player2Score !== undefined || status !== undefined)) {
          // Get the most recent rating updates for this match
          const updates = tx.all(
            db.prepare(`
              SELECT player_id, league_id, old_rating
              FROM rating_updates
              WHERE match_id = ?
              ORDER BY created_at DESC
              LIMIT 2
            `),
            sanitizedMatchId
          ) as any[]
          
          if (updates.length === 2) {
            // Revert ratings to old values
            const revertRating = db.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `)
            updates.forEach((update) => {
              tx.run(revertRating, update.old_rating, update.player_id, update.league_id)
            })
            
            // Delete rating update records
            const deleteUpdates = db.prepare(`
              DELETE FROM rating_updates WHERE match_id = ?
            `)
            tx.run(deleteUpdates, sanitizedMatchId)
          }
        }

        // Build update query dynamically
        const updates: string[] = []
        const values: any[] = []

        if (player1Score !== undefined) {
          updates.push('player1_score = ?')
          values.push(sanitizedPlayer1Score)
        }

        if (player2Score !== undefined) {
          updates.push('player2_score = ?')
          values.push(sanitizedPlayer2Score)
        }

        if (status !== undefined) {
          if (!['pending', 'completed', 'voided'].includes(status)) {
            throw new Error('Invalid match status')
          }
          updates.push('status = ?')
          values.push(status)
        }

        if (winnerId !== undefined) {
          // Validate winnerId is one of the players or null
          if (winnerId !== null && winnerId !== existingMatch.player1_id && winnerId !== existingMatch.player2_id) {
            throw new Error('Winner ID must be one of the players or null')
          }
          const sanitizedWinnerId = winnerId ? sanitizeUUID(winnerId) : null
          if (winnerId !== null && !sanitizedWinnerId) {
            throw new Error('Invalid winner ID format')
          }
          updates.push('winner_id = ?')
          values.push(sanitizedWinnerId)
        } else if ((player1Score !== undefined || player2Score !== undefined) && willBeCompleted) {
          // Auto-calculate winner if scores changed and match is completed
          const finalP1Score = player1Score !== undefined ? sanitizedPlayer1Score : existingMatch.player1_score
          const finalP2Score = player2Score !== undefined ? sanitizedPlayer2Score : existingMatch.player2_score
          
          if (finalP1Score > finalP2Score) {
            updates.push('winner_id = ?')
            values.push(existingMatch.player1_id)
          } else if (finalP2Score > finalP1Score) {
            updates.push('winner_id = ?')
            values.push(existingMatch.player2_id)
          } else {
            updates.push('winner_id = ?')
            values.push(null)
          }
        }

        if (updates.length === 0) {
          throw new Error('No fields to update')
        }

        // Add matchId to values for WHERE clause
        values.push(sanitizedMatchId)

        // Execute update
        tx.run(
          db.prepare(`
            UPDATE matches
            SET ${updates.join(', ')}
            WHERE id = ?
          `),
          ...values
        )

        // If match is now completed, calculate new ratings
        if (willBeCompleted && !wasCompleted) {
          // Get current ratings for both players within transaction
          const rating1 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            existingMatch.player1_id,
            existingMatch.league_id
          ) as any
          
          const rating2 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            existingMatch.player2_id,
            existingMatch.league_id
          ) as any
          
          if (!rating1 || !rating2) {
            throw new Error('Player ratings not found')
          }
          
          // Calculate new ratings using Elo system
          const finalP1Score = player1Score !== undefined ? sanitizedPlayer1Score : existingMatch.player1_score
          const finalP2Score = player2Score !== undefined ? sanitizedPlayer2Score : existingMatch.player2_score
          const result = elo.calculateForMatch(
            rating1.rating,
            rating2.rating,
            finalP1Score,
            finalP2Score
          )
          
          // Update player 1 rating
          const updateRating1 = db.prepare(`
            UPDATE player_ratings
            SET rating = ?, updated_at = CURRENT_TIMESTAMP
            WHERE player_id = ? AND league_id = ?
          `)
          tx.run(updateRating1, result.newRatingA, existingMatch.player1_id, existingMatch.league_id)
          
          // Update player 2 rating
          const updateRating2 = db.prepare(`
            UPDATE player_ratings
            SET rating = ?, updated_at = CURRENT_TIMESTAMP
            WHERE player_id = ? AND league_id = ?
          `)
          tx.run(updateRating2, result.newRatingB, existingMatch.player2_id, existingMatch.league_id)
          
          // Record rating updates for history
          const insertUpdate1 = db.prepare(`
            INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          tx.run(
            insertUpdate1,
            crypto.randomUUID(),
            sanitizedMatchId,
            existingMatch.player1_id,
            existingMatch.league_id,
            rating1.rating,
            result.newRatingA,
            result.changeA
          )
          
          const insertUpdate2 = db.prepare(`
            INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          tx.run(
            insertUpdate2,
            crypto.randomUUID(),
            sanitizedMatchId,
            existingMatch.player2_id,
            existingMatch.league_id,
            rating2.rating,
            result.newRatingB,
            result.changeB
          )
          
          // Mark challenge as completed if match is now completed and challenge exists
          if (challengeId) {
            const updateChallenge = db.prepare(`
              UPDATE challenges
              SET status = 'completed'
              WHERE id = ? AND status = 'accepted'
            `)
            tx.run(updateChallenge, challengeId)
          }
        } else if (willBeCompleted && wasCompleted && (player1Score !== undefined || player2Score !== undefined)) {
          // Recalculate ratings if scores changed on a completed match
          // Get current ratings for both players within transaction
          const rating1 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            existingMatch.player1_id,
            existingMatch.league_id
          ) as any
          
          const rating2 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            existingMatch.player2_id,
            existingMatch.league_id
          ) as any
          
          if (!rating1 || !rating2) {
            throw new Error('Player ratings not found')
          }
          
          // Calculate new ratings using Elo system
          const finalP1Score = player1Score !== undefined ? sanitizedPlayer1Score : existingMatch.player1_score
          const finalP2Score = player2Score !== undefined ? sanitizedPlayer2Score : existingMatch.player2_score
          const result = elo.calculateForMatch(
            rating1.rating,
            rating2.rating,
            finalP1Score,
            finalP2Score
          )
          
          // Update player 1 rating
          const updateRating1 = db.prepare(`
            UPDATE player_ratings
            SET rating = ?, updated_at = CURRENT_TIMESTAMP
            WHERE player_id = ? AND league_id = ?
          `)
          tx.run(updateRating1, result.newRatingA, existingMatch.player1_id, existingMatch.league_id)
          
          // Update player 2 rating
          const updateRating2 = db.prepare(`
            UPDATE player_ratings
            SET rating = ?, updated_at = CURRENT_TIMESTAMP
            WHERE player_id = ? AND league_id = ?
          `)
          tx.run(updateRating2, result.newRatingB, existingMatch.player2_id, existingMatch.league_id)
          
          // Delete old rating updates and insert new ones
          const deleteUpdates = db.prepare(`
            DELETE FROM rating_updates WHERE match_id = ?
          `)
          tx.run(deleteUpdates, sanitizedMatchId)
          
          // Record new rating updates for history
          const insertUpdate1 = db.prepare(`
            INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          tx.run(
            insertUpdate1,
            crypto.randomUUID(),
            sanitizedMatchId,
            existingMatch.player1_id,
            existingMatch.league_id,
            rating1.rating,
            result.newRatingA,
            result.changeA
          )
          
          const insertUpdate2 = db.prepare(`
            INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          tx.run(
            insertUpdate2,
            crypto.randomUUID(),
            sanitizedMatchId,
            existingMatch.player2_id,
            existingMatch.league_id,
            rating2.rating,
            result.newRatingB,
            result.changeB
          )
        }
      })
    } catch (error: any) {
      // Rollback using backup if transaction fails
      console.error('Error in match update transaction:', error)
      try {
        restoreBackup(backup)
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      return NextResponse.json(
        { error: error.message || 'Failed to update match' },
        { status: 500 }
      )
    }

    // Get updated match
    const updatedMatch = db.prepare(`
      SELECT 
        m.*,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE m.id = ?
    `).get(sanitizedMatchId) as any

    return NextResponse.json({
      success: true,
      match: updatedMatch
    })

  } catch (error: any) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update match' },
      { status: 500 }
    )
  }
}
