import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { pgAll, pgGet, isPostgresAvailable } from '@/lib/db/postgres'
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
    const usePostgres = isPostgresAvailable()
    
    // Debug: Check if league exists
    let league
    if (usePostgres) {
      league = await pgGet('SELECT * FROM leagues WHERE id = $1', leagueId)
    } else {
      league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(leagueId)
    }
    
    if (!league) {
      console.error('League not found:', leagueId)
      return NextResponse.json({ players: [] })
    }
    
    // Debug: Check memberships
    let memberships
    if (usePostgres) {
      memberships = await pgGet(`
        SELECT COUNT(*)::int as count 
        FROM league_memberships 
        WHERE league_id = $1 AND is_active = TRUE
      `, leagueId) as { count: number }
    } else {
      memberships = db.prepare(`
        SELECT COUNT(*) as count 
        FROM league_memberships 
        WHERE league_id = ? AND is_active = 1
      `).get(leagueId) as { count: number }
    }
    console.log(`League ${leagueId} has ${memberships.count} active memberships`)
    
    // Debug: Check ratings
    let ratings
    if (usePostgres) {
      ratings = await pgGet(`
        SELECT COUNT(*)::int as count 
        FROM player_ratings 
        WHERE league_id = $1
      `, leagueId) as { count: number }
    } else {
      ratings = db.prepare(`
        SELECT COUNT(*) as count 
        FROM player_ratings 
        WHERE league_id = ?
      `).get(leagueId) as { count: number }
    }
    console.log(`League ${leagueId} has ${ratings.count} ratings`)
    
    let players: LeaderboardEntry[]
    if (usePostgres) {
      players = await pgAll(`
        SELECT 
          p.id, p.name, p.email, p.avatar,
          pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
        FROM players p
        JOIN player_ratings pr ON p.id = pr.player_id
        WHERE pr.league_id = $1
        ORDER BY pr.rating DESC
        LIMIT 100
      `, leagueId) as LeaderboardEntry[]
    } else {
      players = db.prepare(`
        SELECT 
          p.id, p.name, p.email, p.avatar,
          pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
        FROM players p
        JOIN player_ratings pr ON p.id = pr.player_id
        WHERE pr.league_id = ?
        ORDER BY pr.rating DESC
        LIMIT 100
      `).all(leagueId) as LeaderboardEntry[]
    }
    
    console.log(`Leaderboard query returned ${players.length} players for league ${leagueId}`)

    return NextResponse.json({ players })
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
