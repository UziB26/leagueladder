import { db } from "@/lib/db"
import { LeaderboardListClient } from "@/components/leaderboard/leaderboard-list-client"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"

export default async function LeaderboardPage() {
  // Fetch leagues
  const leagues = db.prepare('SELECT * FROM leagues').all() as League[]
  
  // Fetch leaderboard data for each league
  const leagueData = leagues.map((league) => {
    const players = db.prepare(`
      SELECT 
        p.id, p.name, p.email, p.avatar,
        pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
      FROM players p
      JOIN player_ratings pr ON p.id = pr.player_id
      WHERE pr.league_id = ?
      ORDER BY pr.rating DESC
      LIMIT 50
    `).all(league.id) as LeaderboardEntry[]
    
    return {
      league,
      players
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <LeaderboardListClient initialLeagueData={leagueData} />
    </div>
  )
}
