import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    // Get authenticated user
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ isMember: false })
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ isMember: false })
    }

    // Get player
    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json({ isMember: false })
    }

    // Check membership
    const membership = await db.leagueMembership.findFirst({
      where: {
        playerId: player.id,
        leagueId
      }
    })

    return NextResponse.json({ 
      isMember: !!membership 
    })

  } catch (error) {
    console.error('Error checking membership:', error)
    return NextResponse.json({ isMember: false })
  }
}
