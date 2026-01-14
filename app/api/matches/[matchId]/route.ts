import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, dbHelpers } from '@/lib/db'
import { elo } from '@/lib/elo'

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
    const { matchId } = await params
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
    const body = await request.json()
    const { player1Score, player2Score, status, winnerId } = body

    // Get existing match
    const existingMatch = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId) as any

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    const wasCompleted = existingMatch.status === 'completed'
    const willBeCompleted = status === 'completed' || (status === undefined && wasCompleted)

    // Get challenge_id before update (if exists)
    const challengeId = existingMatch.challenge_id

    // If match was completed and we're changing scores or status, revert ratings
    if (wasCompleted && (player1Score !== undefined || player2Score !== undefined || status !== undefined)) {
      try {
        dbHelpers.revertEloRatings(matchId)
      } catch (error: any) {
        console.error('Error reverting Elo ratings:', error)
        // Continue with update even if revert fails
      }
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (player1Score !== undefined) {
      if (player1Score < 0) {
        return NextResponse.json(
          { error: 'Player 1 score must be non-negative' },
          { status: 400 }
        )
      }
      updates.push('player1_score = ?')
      values.push(player1Score)
    }

    if (player2Score !== undefined) {
      if (player2Score < 0) {
        return NextResponse.json(
          { error: 'Player 2 score must be non-negative' },
          { status: 400 }
        )
      }
      updates.push('player2_score = ?')
      values.push(player2Score)
    }

    if (status !== undefined) {
      updates.push('status = ?')
      values.push(status)
    }

    if (winnerId !== undefined) {
      // Validate winnerId is one of the players or null
      if (winnerId !== null && winnerId !== existingMatch.player1_id && winnerId !== existingMatch.player2_id) {
        return NextResponse.json(
          { error: 'Winner ID must be one of the players or null' },
          { status: 400 }
        )
      }
      updates.push('winner_id = ?')
      values.push(winnerId)
    } else if ((player1Score !== undefined || player2Score !== undefined) && willBeCompleted) {
      // Auto-calculate winner if scores changed and match is completed
      const finalPlayer1Score = player1Score !== undefined ? player1Score : existingMatch.player1_score
      const finalPlayer2Score = player2Score !== undefined ? player2Score : existingMatch.player2_score
      
      if (finalPlayer1Score > finalPlayer2Score) {
        updates.push('winner_id = ?')
        values.push(existingMatch.player1_id)
      } else if (finalPlayer2Score > finalPlayer1Score) {
        updates.push('winner_id = ?')
        values.push(existingMatch.player2_id)
      } else {
        updates.push('winner_id = ?')
        values.push(null)
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Add matchId to values for WHERE clause
    values.push(matchId)

    // Execute update
    db.prepare(`
      UPDATE matches
      SET ${updates.join(', ')}
      WHERE id = ?
    `).run(...values)

    // If match is now completed, calculate new ratings
    if (willBeCompleted && !wasCompleted) {
      try {
        dbHelpers.updateEloRatings(matchId, elo)
      } catch (error: any) {
        console.error('Error updating Elo ratings:', error)
        // Continue even if rating update fails
      }
      
      // Mark challenge as completed if match is now completed and challenge exists
      if (challengeId) {
        db.prepare(`
          UPDATE challenges
          SET status = 'completed'
          WHERE id = ? AND status = 'accepted'
        `).run(challengeId)
      }
    } else if (willBeCompleted && wasCompleted && (player1Score !== undefined || player2Score !== undefined)) {
      // Recalculate ratings if scores changed on a completed match
      try {
        dbHelpers.updateEloRatings(matchId, elo)
      } catch (error: any) {
        console.error('Error recalculating Elo ratings:', error)
      }
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
    `).get(matchId) as any

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
