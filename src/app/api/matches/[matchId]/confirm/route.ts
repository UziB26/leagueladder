import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, DatabaseTransaction, createBackup, restoreBackup } from '@/lib/db'
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
        DatabaseTransaction.execute((tx) => {
          // Record confirmation
          const confirmationId = crypto.randomUUID()
          tx.run(
            db.prepare(`
              INSERT INTO match_confirmations (id, match_id, player_id, action, created_at)
              VALUES (?, ?, ?, 'confirmed', CURRENT_TIMESTAMP)
            `),
            confirmationId,
            sanitizedMatchId,
            player.id
          )

          // Update match status to completed
          tx.run(
            db.prepare(`
              UPDATE matches
              SET status = 'completed', confirmed_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `),
            sanitizedMatchId
          )

          // Update Elo ratings
          const rating1 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            match.player1_id,
            match.league_id
          ) as any
          
          const rating2 = tx.get(
            db.prepare(`
              SELECT rating FROM player_ratings
              WHERE player_id = ? AND league_id = ?
            `),
            match.player2_id,
            match.league_id
          ) as any
          
          if (!rating1 || !rating2) {
            throw new Error('Player ratings not found')
          }
          
          const result = elo.calculateForMatch(
            rating1.rating,
            rating2.rating,
            match.player1_score,
            match.player2_score
          )
          
          // Update player 1 rating
          tx.run(
            db.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `),
            result.newRatingA,
            match.player1_id,
            match.league_id
          )
          
          // Update player 2 rating
          tx.run(
            db.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `),
            result.newRatingB,
            match.player2_id,
            match.league_id
          )
          
          // Record rating updates
          tx.run(
            db.prepare(`
              INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `),
            crypto.randomUUID(),
            sanitizedMatchId,
            match.player1_id,
            match.league_id,
            rating1.rating,
            result.newRatingA,
            result.changeA
          )
          
          tx.run(
            db.prepare(`
              INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `),
            crypto.randomUUID(),
            sanitizedMatchId,
            match.player2_id,
            match.league_id,
            rating2.rating,
            result.newRatingB,
            result.changeB
          )

          // Note: Player stats (wins/losses/draws) are automatically updated by the 
          // update_player_stats_on_match_completion trigger when status changes to 'completed'

          // Mark challenge as completed if exists
          if (match.challenge_id) {
            tx.run(
              db.prepare(`
                UPDATE challenges
                SET status = 'completed'
                WHERE id = ? AND status = 'accepted'
              `),
              match.challenge_id
            )
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Match confirmed successfully. Ratings have been updated.'
        })
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
      console.error('Error in match confirmation:', error)
      try {
        restoreBackup(backup)
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error confirming match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to confirm match' },
      { status: 500 }
    )
  }
}
