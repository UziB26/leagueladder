import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface RatingHistoryEntry {
  id: string
  match_id: string
  league_id: string
  league_name: string
  old_rating: number
  new_rating: number
  change: number
  created_at: string
  opponent_name?: string
  match_score?: string
  match_date?: string
}

/**
 * GET /api/players/[playerId]/rating-history
 * Fetch rating change history for a specific player
 * 
 * Query Parameters:
 *   leagueId: string (optional) - Filter by league
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   history: RatingHistoryEntry[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('leagueId')
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

    // Fetch rating updates with related data
    const ratingUpdates = await db.ratingUpdate.findMany({
      where: {
        playerId,
        ...(leagueId && { leagueId })
      },
      include: {
        league: {
          select: {
            name: true
          }
        },
        match: {
          include: {
            player1: {
              select: {
                id: true,
                name: true
              }
            },
            player2: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Enrich with opponent information
    const enrichedHistory: RatingHistoryEntry[] = ratingUpdates.map((ru) => {
      // Determine opponent
      const isPlayer1 = ru.match.player1Id === playerId
      const opponent = isPlayer1 ? ru.match.player2 : ru.match.player1
      
      // Format match score
      const playerScore = isPlayer1 ? ru.match.player1Score : ru.match.player2Score
      const opponentScore = isPlayer1 ? ru.match.player2Score : ru.match.player1Score
      const matchScore = `${playerScore}-${opponentScore}`
      
      return {
        id: ru.id,
        match_id: ru.matchId,
        league_id: ru.leagueId,
        league_name: ru.league.name,
        old_rating: ru.oldRating,
        new_rating: ru.newRating,
        change: ru.change,
        created_at: ru.createdAt.toISOString(),
        opponent_name: opponent.name,
        match_score: matchScore,
        match_date: ru.match.playedAt?.toISOString()
      }
    })

    return NextResponse.json({ history: enrichedHistory })
  } catch (error: any) {
    console.error('Error fetching rating history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating history' },
      { status: 500 }
    )
  }
}
