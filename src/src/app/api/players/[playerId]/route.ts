import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Player } from '@/types/database'
import { PlayerRating } from '@/types/database'

interface RatingWithLeague extends PlayerRating {
  league_name: string
  game_type: string
}

interface MatchWithDetails {
  id: string
  challenge_id?: string
  player1_id: string
  player2_id: string
  league_id: string
  player1_score: number
  player2_score: number
  winner_id?: string
  status: string
  played_at: string
  confirmed_at?: string
  league_name: string
  player1_name: string
  player2_name: string
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId) as Player | undefined
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }
    
    const ratings = db.prepare(`
      SELECT pr.*, l.name as league_name, l.game_type
      FROM player_ratings pr
      JOIN leagues l ON pr.league_id = l.id
      WHERE pr.player_id = ?
    `).all(playerId) as RatingWithLeague[]
    
    const matches = db.prepare(`
      SELECT 
        m.*,
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
      LIMIT 20
    `).all(playerId, playerId) as MatchWithDetails[]
    
    return NextResponse.json({
      player,
      ratings,
      matches,
      stats: {
        totalGames: ratings.reduce((sum, r) => sum + r.games_played, 0),
        totalWins: ratings.reduce((sum, r) => sum + r.wins, 0),
        totalLosses: ratings.reduce((sum, r) => sum + r.losses, 0),
        totalDraws: ratings.reduce((sum, r) => sum + r.draws, 0)
      }
    })
    
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    )
  }
}