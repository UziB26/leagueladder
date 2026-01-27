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

    // TypeScript sometimes fails to narrow session.user.email; capture explicitly
    const userEmail = session.user.email as string

    // @ts-ignore - Prisma Accelerate overload typing trips Turbopack here
    const user = await db.user.findFirst({
      where: { email: userEmail }
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
    
    // Check if challenge exists and user is the challengee
    const challenge = await db.challenge.findFirst({
      where: {
        id: sanitizedChallengeId,
        challengeeId: player.id
      }
    })
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found or you are not authorized to accept it' },
        { status: 404 }
      )
    }
    
    if (challenge.status !== 'pending') {
      return NextResponse.json(
        { error: 'Challenge is not pending' },
        { status: 400 }
      )
    }
    
    // Check if challenge has expired
    if (challenge.expiresAt && new Date(challenge.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This challenge has expired' },
        { status: 400 }
      )
    }
    
    // Update challenge status
    await db.challenge.update({
      where: { id: sanitizedChallengeId },
      data: { status: 'accepted' }
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Challenge accepted successfully' 
    })
    
  } catch (error) {
    console.error('Error accepting challenge:', error)
    return NextResponse.json(
      { error: 'Failed to accept challenge' },
      { status: 500 }
    )
  }
}
