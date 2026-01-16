import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Debug endpoint to check match status and rating updates
 * GET /api/debug/match-status?matchId=[id]
 */
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId parameter required' },
        { status: 400 }
      )
    }

    // Get match details
    const match = db.prepare(`
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

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Get rating updates
    const ratingUpdates = db.prepare(`
      SELECT * FROM rating_updates WHERE match_id = ?
    `).all(matchId) as any[]

    // Get current player ratings
    const player1Rating = db.prepare(`
      SELECT * FROM player_ratings 
      WHERE player_id = ? AND league_id = ?
    `).get(match.player1_id, match.league_id) as any

    const player2Rating = db.prepare(`
      SELECT * FROM player_ratings 
      WHERE player_id = ? AND league_id = ?
    `).get(match.player2_id, match.league_id) as any

    // Get confirmations
    const confirmations = db.prepare(`
      SELECT * FROM match_confirmations WHERE match_id = ?
    `).all(matchId) as any[]

    return NextResponse.json({
      match: {
        id: match.id,
        status: match.status,
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        player1_score: match.player1_score,
        player2_score: match.player2_score,
        league_id: match.league_id,
        reported_by: match.reported_by,
        confirmed_at: match.confirmed_at,
        played_at: match.played_at,
      },
      ratingUpdates: ratingUpdates,
      playerRatings: {
        player1: player1Rating,
        player2: player2Rating,
      },
      confirmations: confirmations,
      diagnostic: {
        hasRatingUpdates: ratingUpdates.length > 0,
        isCompleted: match.status === 'completed',
        hasConfirmations: confirmations.length > 0,
        playerRatingsExist: !!(player1Rating && player2Rating),
      }
    })
  } catch (error: any) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get match status' },
      { status: 500 }
    )
  }
}
