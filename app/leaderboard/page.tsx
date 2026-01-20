import { db } from "@/lib/db"
import { LeaderboardListClient } from "@/components/leaderboard/leaderboard-list-client"
import { LeaderboardEntry } from "@/types/database"
import { League } from "@/types/database"

export default async function LeaderboardPage() {
  // Fetch leagues using Prisma
  const leaguesData = await db.league.findMany({
    orderBy: { name: 'asc' }
  })
  
  // Transform to match League type
  const leagues: League[] = leaguesData.map(l => ({
    id: l.id,
    name: l.name,
    game_type: l.gameType as 'table-tennis' | 'fifa',
    created_at: l.createdAt.toISOString()
  }))
  
  // Fetch leaderboard data for each league using Prisma
  const leagueData = await Promise.all(leagues.map(async (league) => {
    const playerRatingsRaw = await db.playerRating.findMany({
      where: { leagueId: league.id },
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
      take: 50
    })
    
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
    
    return {
      league,
      players
    }
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <LeaderboardListClient initialLeagueData={leagueData} />
    </div>
  )
}
