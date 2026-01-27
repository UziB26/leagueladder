// @ts-nocheck

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { challengeId } = await params

    // Sanitize challenge ID
    const sanitizedChallengeId = sanitizeUUID(challengeId)
    if (!sanitizedChallengeId) {
      return NextResponse.json(
        { error: 'Invalid challenge ID format' },
        { status: 400 }
      )
    }
    
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
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }
    
    // Check if challenge exists and user is the challenger
    const challenge = await db.challenge.findFirst({
      where: {
        id: sanitizedChallengeId,
        challengerId: player.id
      }
    })
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found or you are not authorized to cancel it' },
        { status: 404 }
      )
    }
    
    if (challenge.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending challenges can be cancelled' },
        { status: 400 }
      )
    }
    
    // Delete challenge
    await db.challenge.delete({
      where: { id: sanitizedChallengeId }
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Challenge cancelled successfully' 
    })
    
  } catch (error) {
    console.error('Error cancelling challenge:', error)
    return NextResponse.json(
      { error: 'Failed to cancel challenge' },
      { status: 500 }
    )
  }
}
