import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LeaderboardEntry } from '@/types/database'
import { League } from '@/types/database'

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
    
    const league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(leagueId) as League | undefined
    
    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      league,
      players,
      count: players.length,
      totalRating: players.reduce((sum, p) => sum + p.rating, 0),
      totalGames: players.reduce((sum, p) => sum + p.games_played, 0)
    })
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}