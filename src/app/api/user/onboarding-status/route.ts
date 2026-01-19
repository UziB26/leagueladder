import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface User {
  id: string
  email: string
  created_at: string
}

/**
 * Check if a user is new (should see onboarding)
 * A user is considered "new" if:
 * 1. They were created within the last 7 days, OR
 * 2. They have no matches or challenges yet
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

    const user = db.prepare('SELECT id, email, created_at FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user was created recently (within last 7 days)
    const createdAt = new Date(user.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const isRecentlyCreated = createdAt >= sevenDaysAgo

    // Check if user has any activity (matches or challenges)
    // First check if player exists
    const player = db.prepare('SELECT id FROM players WHERE user_id = ?').get(user.id) as { id: string } | undefined
    
    let hasActivity = false
    if (player) {
      // Check for matches
      const matchCount = db.prepare(`
        SELECT COUNT(*) as count 
        FROM matches 
        WHERE player1_id = ? OR player2_id = ?
      `).get(player.id, player.id) as { count: number } | undefined
      
      // Check for challenges (as challenger or challengee)
      const challengeCount = db.prepare(`
        SELECT COUNT(*) as count 
        FROM challenges 
        WHERE challenger_id = ? OR challengee_id = ?
      `).get(player.id, player.id) as { count: number } | undefined
      
      hasActivity = ((matchCount?.count ?? 0) > 0) || ((challengeCount?.count ?? 0) > 0)
    }

    // User is "new" if they were created recently OR have no activity
    const isNewUser = isRecentlyCreated || !hasActivity

    return NextResponse.json({ 
      isNewUser,
      recentlyCreated: isRecentlyCreated,
      hasActivity,
      createdAt: user.created_at
    })
    
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.json(
      { error: 'Failed to check onboarding status', isNewUser: true }, // Default to showing onboarding on error
      { status: 500 }
    )
  }
}
