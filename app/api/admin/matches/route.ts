import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET(request: NextRequest) {
  try {
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get all matches with related data
    const matches = await db.match.findMany({
      include: {
        player1: {
          select: { name: true }
        },
        player2: {
          select: { name: true }
        },
        league: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format matches
    const formattedMatches = matches.map(m => ({
      id: m.id,
      player1_id: m.player1Id,
      player2_id: m.player2Id,
      league_id: m.leagueId,
      player1_score: m.player1Score,
      player2_score: m.player2Score,
      status: m.status,
      winner_id: m.winnerId,
      challenge_id: m.challengeId,
      played_at: m.playedAt.toISOString(),
      created_at: m.createdAt.toISOString(),
      player1_name: m.player1.name,
      player2_name: m.player2.name,
      league_name: m.league.name
    }))
    
    return NextResponse.json({ matches: formattedMatches })
    
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
