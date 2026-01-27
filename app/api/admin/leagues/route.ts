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

    // Get all leagues with member counts
    const leagues = await db.league.findMany({
      include: {
        memberships: {
          where: { isActive: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Format leagues
    const formattedLeagues = leagues.map((l: { 
      id: string; 
      name: string; 
      gameType: string; 
      createdAt: Date; 
      memberships: Array<{ isActive: boolean }> 
    }) => ({
      id: l.id,
      name: l.name,
      game_type: l.gameType,
      created_at: l.createdAt.toISOString(),
      member_count: l.memberships.length
    }))
    
    return NextResponse.json({ leagues: formattedLeagues })
    
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leagues' },
      { status: 500 }
    )
  }
}
