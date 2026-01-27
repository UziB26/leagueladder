import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// CRITICAL: Force Node.js runtime to prevent edge runtime from triggering client engine type
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/user/onboarding-status
 * Checks if the current user is new (hasn't completed onboarding)
 * A user is considered "new" if they don't have any players created yet
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      // User doesn't exist in database, consider them new
      return NextResponse.json({ isNewUser: true })
    }

    // Check if user has any players
    // If they have players, they've already completed onboarding
    const playerCount = await db.player.count({
      where: { userId: user.id }
    })

    const isNewUser = playerCount === 0

    return NextResponse.json({ isNewUser })
  } catch (error) {
    console.error('[onboarding-status] Error:', error)
    // On error, default to showing onboarding (safer for new users)
    return NextResponse.json({ isNewUser: true })
  }
}
