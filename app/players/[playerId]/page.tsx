import { db } from "@/lib/db"
import { PlayerProfile } from "@/components/player/player-profile"
import { notFound } from "next/navigation"
import { Player } from "@/types/database"
import { PlayerRating } from "@/types/database"

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

interface PlayerPageProps {
  params: Promise<{
    playerId: string
  }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params
  
  // Fetch player
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId) as Player | undefined
  
  if (!player) {
    notFound()
  }
  
  // Fetch ratings with league info
  const ratings = db.prepare(`
    SELECT pr.*, l.name as league_name, l.game_type
    FROM player_ratings pr
    JOIN leagues l ON pr.league_id = l.id
    WHERE pr.player_id = ?
  `).all(playerId) as RatingWithLeague[]
  
  // Fetch recent matches
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerProfile 
        player={player}
        ratings={ratings}
        matches={matches}
      />
    </div>
  )
}
