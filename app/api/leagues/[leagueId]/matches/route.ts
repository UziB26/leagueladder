import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface MatchWithDetails {
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
 * GET /api/leagues/[leagueId]/matches
 * Fetch match history for a specific league
 * 
 * Query Parameters:
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   matches: MatchWithDetails[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Verify league exists
    const league = await db.league.findUnique({
      where: { id: leagueId }
    })
    
    if (!league) {
      return NextResponse.json(
        { error: 'League not found' },
        { status: 404 }
      )
    }

    // Fetch completed matches for this league
    const matches = await db.match.findMany({
      where: {
        leagueId,
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
    })

    // Transform matches with rating updates
    const matchesWithRatings: MatchWithDetails[] = matches.map((match) => {
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
    console.error('Error fetching league match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
