import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LeaderboardEntry } from '@/types/database'

/**
 * GET /api/leaderboard/[leagueId]
 * Fetch leaderboard for a specific league
 * 
 * Response:
 * {
 *   players: LeaderboardEntry[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    const players = db.prepare(`
      SELECT 
        p.id, p.name, p.email, p.avatar,
        pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
      FROM players p
      JOIN player_ratings pr ON p.id = pr.player_id
      WHERE pr.league_id = ?
      ORDER BY pr.rating DESC
      LIMIT 100
    `).all(leagueId) as LeaderboardEntry[]

    return NextResponse.json({ players })
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
