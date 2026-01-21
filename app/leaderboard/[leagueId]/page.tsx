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
  
  // Fetch league using Prisma
  const leagueData = await db.league.findUnique({
    where: { id: leagueId }
  })
  
  if (!leagueData) {
    notFound()
  }
  
  // Transform to match League type (convert camelCase to snake_case)
  const league: League = {
    id: leagueData.id,
    name: leagueData.name,
    game_type: leagueData.gameType as 'table-tennis' | 'fifa',
    created_at: leagueData.createdAt.toISOString()
  }
  
  // Fetch leaderboard using Prisma
  const playerRatingsRaw = (await db.playerRating.findMany({
    where: { leagueId },
    include: {
      player: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      }
    },
    orderBy: { rating: 'desc' },
    take: 100
  })) as unknown as Array<{
    id: string
    rating: number
    gamesPlayed: number
    wins: number
    losses: number
    draws: number
    player: {
      id: string
      name: string
      email: string | null
      avatar: string | null
    }
  }>
  
  // Transform to match expected format
  const players: LeaderboardEntry[] = playerRatingsRaw.map(pr => ({
    id: pr.player.id,
    name: pr.player.name,
    email: pr.player.email || undefined,
    avatar: pr.player.avatar || undefined,
    rating: pr.rating,
    games_played: pr.gamesPlayed,
    wins: pr.wins,
    losses: pr.losses,
    draws: pr.draws
  }))

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
