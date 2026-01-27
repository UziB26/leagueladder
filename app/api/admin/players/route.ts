import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

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

    // Get all players with their user info
    const players = await db.player.findMany({
      include: {
        user: {
          select: {
            email: true,
            isAdmin: true
          }
        },
        memberships: {
          where: { isActive: true }
        },
        matchesAsPlayer1: true,
        matchesAsPlayer2: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format players
    const formattedPlayers = players.map((p: {
      id: string
      userId: string
      name: string | null
      email: string | null
      avatar: string | null
      createdAt: Date
      user: { email: string; isAdmin: boolean }
      memberships: Array<{ isActive: boolean }>
      matchesAsPlayer1: Array<unknown>
      matchesAsPlayer2: Array<unknown>
    }) => {
      const allMatches = [...p.matchesAsPlayer1, ...p.matchesAsPlayer2]
      return {
        id: p.id,
        user_id: p.userId,
        name: p.name,
        email: p.email || p.user.email,
        avatar: p.avatar,
        created_at: p.createdAt.toISOString(),
        user_email: p.user.email,
        is_admin: p.user.isAdmin,
        league_count: p.memberships.length,
        match_count: allMatches.length
      }
    })
    
    return NextResponse.json({ players: formattedPlayers })
    
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}
