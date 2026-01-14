import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface MatchWithRatings {
  id: string
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  winner_id: string | null
  league_name: string
  played_at: string
  status: string
  rating_updates?: {
    player1?: {
      old_rating: number
      new_rating: number
      change: number
    }
    player2?: {
      old_rating: number
      new_rating: number
      change: number
    }
  }
}

/**
 * GET /api/players/[playerId]/matches
 * Fetch match history for a specific player
 * 
 * Query Parameters:
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   matches: MatchWithRatings[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Verify player exists
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId)
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Fetch completed matches for this player
    const matches = db.prepare(`
      SELECT 
        m.id,
        m.player1_id,
        m.player2_id,
        m.player1_score,
        m.player2_score,
        m.winner_id,
        m.status,
        m.played_at,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
        AND m.status = 'completed'
      ORDER BY m.played_at DESC
      LIMIT ?
    `).all(playerId, playerId, limit) as any[]

    // Fetch rating updates for each match
    const matchesWithRatings: MatchWithRatings[] = matches.map((match) => {
      const ratingUpdates = db.prepare(`
        SELECT 
          ru.player_id,
          ru.old_rating,
          ru.new_rating,
          (ru.new_rating - ru.old_rating) as change
        FROM rating_updates ru
        WHERE ru.match_id = ?
      `).all(match.id) as any[]

      const player1Update = ratingUpdates.find(ru => ru.player_id === match.player1_id)
      const player2Update = ratingUpdates.find(ru => ru.player_id === match.player2_id)

      return {
        ...match,
        rating_updates: {
          player1: player1Update ? {
            old_rating: player1Update.old_rating,
            new_rating: player1Update.new_rating,
            change: player1Update.change
          } : undefined,
          player2: player2Update ? {
            old_rating: player2Update.old_rating,
            new_rating: player2Update.new_rating,
            change: player2Update.change
          } : undefined
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })
  } catch (error: any) {
    console.error('Error fetching player match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
