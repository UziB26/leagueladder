import { db } from "@/lib/db"
import { PlayerProfile } from "@/components/player/player-profile"
import { notFound } from "next/navigation"
import { Player } from "@/types/database"
import { PlayerRating } from "@/types/database"

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic'

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
  
  // Fetch player using Prisma
  const playerData = await db.player.findUnique({
    where: { id: playerId }
  })
  
  if (!playerData) {
    notFound()
  }
  
  // Transform to match Player type
  const player: Player = {
    id: playerData.id,
    user_id: playerData.userId,
    name: playerData.name,
    email: playerData.email || undefined,
    avatar: playerData.avatar || undefined,
    created_at: playerData.createdAt.toISOString()
  }
  
  // Fetch ratings with league info using Prisma
  const playerRatings = await db.playerRating.findMany({
    where: { playerId },
    include: {
      league: {
        select: {
          name: true,
          gameType: true
        }
      }
    }
  }) as Array<{
    id: string
    playerId: string
    leagueId: string
    rating: number
    gamesPlayed: number
    wins: number
    losses: number
    draws: number
    updatedAt: Date
    league: {
      name: string
      gameType: string
    }
  }>
  
  // Transform to match expected format
  const ratings: RatingWithLeague[] = playerRatings.map(pr => ({
    id: pr.id,
    player_id: pr.playerId,
    league_id: pr.leagueId,
    rating: pr.rating,
    games_played: pr.gamesPlayed,
    wins: pr.wins,
    losses: pr.losses,
    draws: pr.draws,
    updated_at: pr.updatedAt.toISOString(),
    league_name: pr.league.name,
    game_type: pr.league.gameType
  }))
  
  // Fetch recent matches using Prisma (excluding voided)
  const matchRecordsRaw = (await db.match.findMany({
    where: {
      OR: [
        { player1Id: playerId },
        { player2Id: playerId }
      ],
      status: {
        not: 'voided'
      }
    },
    include: {
      league: {
        select: {
          name: true
        }
      },
      player1: {
        select: {
          name: true
        }
      },
      player2: {
        select: {
          name: true
        }
      }
    },
    orderBy: { playedAt: 'desc' },
    take: 20
  })) as unknown as Array<{
    id: string
    challengeId: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId: string | null
    status: string
    playedAt: Date
    confirmedAt: Date | null
    league: { name: string }
    player1: { name: string }
    player2: { name: string }
  }>
  
  // Transform to match expected format
  const matches: MatchWithDetails[] = matchRecordsRaw.map(m => ({
    id: m.id,
    challenge_id: m.challengeId || undefined,
    player1_id: m.player1Id,
    player2_id: m.player2Id,
    league_id: m.leagueId,
    player1_score: m.player1Score,
    player2_score: m.player2Score,
    winner_id: m.winnerId || undefined,
    status: m.status,
    played_at: m.playedAt.toISOString(),
    confirmed_at: m.confirmedAt?.toISOString(),
    league_name: m.league.name,
    player1_name: m.player1.name,
    player2_name: m.player2.name
  }))

  // Fetch admin actions for this player
  const adminActions = await db.adminAction.findMany({
    where: {
      OR: [
        {
          action: 'adjust_rating',
          targetId: playerId
        },
        {
          action: 'adjust_stats',
          targetId: playerId
        }
      ]
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  // Transform admin actions to activity format
  const adminActivities = adminActions.map(action => {
    const details = action.details ? JSON.parse(action.details) : {}
    let description = ''
    
    if (action.action === 'adjust_rating') {
      description = `Rating adjusted: ${details.old_rating || 'N/A'} → ${details.new_rating || 'N/A'}`
      if (details.league_id) {
        const league = ratings.find(r => r.league_id === details.league_id)
        if (league) {
          description += ` (${league.league_name})`
        }
      }
    } else if (action.action === 'adjust_stats') {
      description = 'Stats adjusted by admin'
      if (details.league_id) {
        const league = ratings.find(r => r.league_id === details.league_id)
        if (league) {
          description += ` (${league.league_name})`
        }
      }
    }
    
    if (details.reason) {
      description += ` - ${details.reason}`
    }

    return {
      id: action.id,
      type: 'admin_action' as const,
      description,
      created_at: action.createdAt.toISOString(),
      admin_name: action.user?.name || action.user?.email || 'Admin'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerProfile 
        player={player}
        ratings={ratings}
        matches={matches}
        adminActivities={adminActivities}
      />
    </div>
  )
}
