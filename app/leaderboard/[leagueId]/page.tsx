import { db } from "@/lib/db"
import { LeaderboardClient } from "@/components/leaderboard/leaderboard-client"
import { LeagueMatchHistory } from "@/components/league/league-match-history"
import { notFound } from "next/navigation"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaguePageProps {
  params: Promise<{
    leagueId: string
  }>
}

export default async function LeagueLeaderboardPage({ params }: LeaguePageProps) {
  const { leagueId } = await params
  
  // Fetch league
  const league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(leagueId) as League | undefined
  
  if (!league) {
    notFound()
  }
  
  // Fetch leaderboard
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
            league.game_type === 'fifa' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <span className="text-2xl">
              {league.game_type === 'fifa' ? '🎮' : '🏓'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-500">{league.name} Leaderboard</h1>
          </div>
        </div>
      </div>

      <Tabs defaultValue="leaderboard" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="matches">Match History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="mt-4">
          <LeaderboardClient 
            leagueId={league.id} 
            leagueName={league.name} 
            initialPlayers={players} 
          />
        </TabsContent>
        
        <TabsContent value="matches" className="mt-4">
          <LeagueMatchHistory leagueId={league.id} leagueName={league.name} />
        </TabsContent>
      </Tabs>

      {/* Top 3 Players - Now handled by LeaderboardClient component */}
    </div>
  )
}
