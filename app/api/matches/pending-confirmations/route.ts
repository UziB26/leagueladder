import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/matches/pending-confirmations
 * Get all matches pending confirmation for the authenticated player
 */
export async function GET(request: NextRequest) {
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

    // Get matches pending confirmation where this player is the opponent (not the reporter)
    const matches = await db.match.findMany({
      where: {
        status: 'pending_confirmation',
        reportedBy: {
          not: player.id
        },
        OR: [
          { player1Id: player.id },
          { player2Id: player.id }
        ]
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
        reporter: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        playedAt: 'desc'
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
      reporter: { name: string } | null
    }>

    // Transform to match expected format
    const formattedMatches = matches.map(m => ({
      id: m.id,
      challenge_id: m.challengeId,
      player1_id: m.player1Id,
      player2_id: m.player2Id,
      league_id: m.leagueId,
      player1_score: m.player1Score,
      player2_score: m.player2Score,
      winner_id: m.winnerId,
      status: m.status,
      reported_by: m.reportedBy,
      played_at: m.playedAt.toISOString(),
      confirmed_at: m.confirmedAt?.toISOString(),
      league_name: m.league.name,
      player1_name: m.player1.name,
      player2_name: m.player2.name,
      reporter_name: m.reporter?.name
    }))

    return NextResponse.json({ matches: formattedMatches })
  } catch (error: any) {
    console.error('Error fetching pending confirmations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending confirmations' },
      { status: 500 }
    )
  }
}
