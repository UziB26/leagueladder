import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Challenge } from '@/types/database'
import { apiRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'

interface User {
  id: string;
  email: string;
}

interface Player {
  id: string;
  user_id: string;
}

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

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }
    
    // Check if challenge exists and user is the challenger
    const challenge = db.prepare(`
      SELECT * FROM challenges WHERE id = ? AND challenger_id = ?
    `).get(sanitizedChallengeId, player.id) as Challenge | undefined
    
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
    
    // Delete challenge (or mark as cancelled)
    db.prepare(`
      DELETE FROM challenges WHERE id = ?
    `).run(sanitizedChallengeId)
    
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
