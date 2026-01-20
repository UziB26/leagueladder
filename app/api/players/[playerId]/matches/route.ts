import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface MatchWithRatings {
  id: string
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  winner_id: string | null
  league_name: string
  played_at: string
  status: string
  rating_updates?: {
    player1?: {
      old_rating: number
      new_rating: number
      change: number
    }
    player2?: {
      old_rating: number
      new_rating: number
      change: number
    }
  }
}

/**
 * GET /api/players/[playerId]/matches
 * Fetch match history for a specific player
 * 
 * Query Parameters:
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   matches: MatchWithRatings[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Verify player exists
    const player = await db.player.findUnique({
      where: { id: playerId }
    })
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Fetch completed matches for this player
    const matches = await db.match.findMany({
      where: {
        OR: [
          { player1Id: playerId },
          { player2Id: playerId }
        ],
        status: 'completed'
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
        },
        ratingUpdates: {
          select: {
            playerId: true,
            oldRating: true,
            newRating: true,
            change: true
          }
        }
      },
      orderBy: {
        playedAt: 'desc'
      },
      take: limit
    }) as Array<{
      id: string
      challengeId: string | null
      player1Id: string
      player2Id: string
      leagueId: string
      player1Score: number
      player2Score: number
      winnerId: string | null
      status: string
      reportedBy: string | null
      playedAt: Date
      confirmedAt: Date | null
      league: { name: string }
      player1: { name: string }
      player2: { name: string }
      ratingUpdates: Array<{
        playerId: string
        oldRating: number
        newRating: number
        change: number
      }>
    }>

    // Transform matches with rating updates
    const matchesWithRatings: MatchWithRatings[] = matches.map((match) => {
      const player1Update = match.ratingUpdates.find(ru => ru.playerId === match.player1Id)
      const player2Update = match.ratingUpdates.find(ru => ru.playerId === match.player2Id)

      return {
        id: match.id,
        player1_id: match.player1Id,
        player2_id: match.player2Id,
        player1_name: match.player1.name,
        player2_name: match.player2.name,
        player1_score: match.player1Score,
        player2_score: match.player2Score,
        winner_id: match.winnerId,
        league_name: match.league.name,
        played_at: match.playedAt?.toISOString() || '',
        status: match.status,
        rating_updates: {
          player1: player1Update ? {
            old_rating: player1Update.oldRating,
            new_rating: player1Update.newRating,
            change: player1Update.change
          } : undefined,
          player2: player2Update ? {
            old_rating: player2Update.oldRating,
            new_rating: player2Update.newRating,
            change: player2Update.change
          } : undefined
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })
  } catch (error: any) {
    console.error('Error fetching player match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
