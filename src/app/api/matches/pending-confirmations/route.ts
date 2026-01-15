import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'

interface User {
  id: string
  email: string
}

interface Player {
  id: string
  user_id: string
}

/**
 * GET /api/matches/pending-confirmations
 * Get all matches pending confirmation for the authenticated player
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
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

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json({ matches: [] })
    }

    // Get matches pending confirmation where this player is the opponent (not the reporter)
    const matches = db.prepare(`
      SELECT 
        m.id,
        m.challenge_id,
        m.player1_id,
        m.player2_id,
        m.league_id,
        m.player1_score,
        m.player2_score,
        m.winner_id,
        m.status,
        m.reported_by,
        m.played_at,
        m.confirmed_at,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name,
        reporter.name as reporter_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      LEFT JOIN players reporter ON m.reported_by = reporter.id
      WHERE m.status = 'pending_confirmation'
        AND m.reported_by != ?
        AND (m.player1_id = ? OR m.player2_id = ?)
      ORDER BY m.played_at DESC
    `).all(player.id, player.id, player.id) as any[]

    return NextResponse.json({ matches })
  } catch (error: any) {
    console.error('Error fetching pending confirmations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending confirmations' },
      { status: 500 }
    )
  }
}
