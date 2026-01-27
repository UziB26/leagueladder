import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json({ matches: [] })
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get matches for the current player with rating updates using Prisma
    const matches = await db.match.findMany({
      where: {
        OR: [
          { player1Id: player.id },
          { player2Id: player.id }
        ],
        status: {
          in: ['completed', 'pending_confirmation']
        }
      },
      take: limit,
      orderBy: { playedAt: 'desc' },
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
      }
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

    // Transform to match expected format
    const matchesWithRatings = matches.map(match => {
      const ratingUpdate1 = match.ratingUpdates.find(ru => ru.playerId === match.player1Id)
      const ratingUpdate2 = match.ratingUpdates.find(ru => ru.playerId === match.player2Id)

      return {
        id: match.id,
        player1_id: match.player1Id,
        player2_id: match.player2Id,
        player1_score: match.player1Score,
        player2_score: match.player2Score,
        winner_id: match.winnerId,
        league_id: match.leagueId,
        status: match.status,
        reported_by: match.reportedBy,
        played_at: match.playedAt.toISOString(),
        confirmed_at: match.confirmedAt?.toISOString(),
        league_name: match.league.name,
        player1_name: match.player1.name,
        player2_name: match.player2.name,
        rating_updates: {
          player1: ratingUpdate1 ? {
            old_rating: ratingUpdate1.oldRating,
            new_rating: ratingUpdate1.newRating,
            change: ratingUpdate1.change
          } : null,
          player2: ratingUpdate2 ? {
            old_rating: ratingUpdate2.oldRating,
            new_rating: ratingUpdate2.newRating,
            change: ratingUpdate2.change
          } : null
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })

  } catch (error: any) {
    console.error('Error fetching match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
