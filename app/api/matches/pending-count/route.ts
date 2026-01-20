import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

/**
 * GET /api/matches/pending-count
 * Get count of accepted challenges that need to be reported (no match exists yet)
 * 
 * Response:
 * {
 *   count: number
 * }
 */
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ count: 0 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    if (!user) {
      return NextResponse.json({ count: 0 })
    }

    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    if (!player) {
      return NextResponse.json({ count: 0 })
    }

    // Get all accepted challenges for this player that don't have matches yet
    const acceptedChallenges = await db.challenge.findMany({
      where: {
        status: 'accepted',
        OR: [
          { challengerId: player.id },
          { challengeeId: player.id }
        ],
        match: null // No match exists for this challenge
      }
    })

    return NextResponse.json({ count: acceptedChallenges.length })
  } catch (error: any) {
    console.error('Error fetching pending matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
