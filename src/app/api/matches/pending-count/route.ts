import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as any
    if (!user) {
      return NextResponse.json({ count: 0 })
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as any
    if (!player) {
      return NextResponse.json({ count: 0 })
    }

    // Get all accepted challenges for this player
    const acceptedChallenges = db.prepare(`
      SELECT id FROM challenges
      WHERE status = 'accepted'
        AND (challenger_id = ? OR challengee_id = ?)
    `).all(player.id, player.id) as any[]

    // Count how many don't have matches yet
    let pendingCount = 0
    for (const challenge of acceptedChallenges) {
      const existingMatch = db.prepare('SELECT id FROM matches WHERE challenge_id = ?').get(challenge.id)
      if (!existingMatch) {
        pendingCount++
      }
    }

    return NextResponse.json({ count: pendingCount })
  } catch (error: any) {
    console.error('Error fetching pending matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
