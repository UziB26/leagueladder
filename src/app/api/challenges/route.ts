import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Challenge } from '@/types/database'
import { apiRateLimit } from '@/lib/rate-limit'
import { validateRequest, requestSchemas } from '@/lib/validation'
import { sanitizeUUID, sanitizeString } from '@/lib/sanitize'
import crypto from 'crypto'

interface User {
  id: string;
  email: string;
}

interface Player {
  id: string;
  user_id: string;
}

export async function GET() {
  try {
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
      return NextResponse.json({ challenges: [] })
    }

    const challenges = db.prepare(`
      SELECT 
        c.*,
        p1.name as challenger_name,
        p2.name as challengee_name,
        l.name as league_name
      FROM challenges c
      JOIN players p1 ON c.challenger_id = p1.id
      JOIN players p2 ON c.challengee_id = p2.id
      JOIN leagues l ON c.league_id = l.id
      WHERE c.challenger_id = ? OR c.challengee_id = ?
      ORDER BY c.created_at DESC
      LIMIT 50
    `).all(player.id, player.id) as Challenge[]
    
    return NextResponse.json({ challenges })
    
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Validate request
    const validator = validateRequest({
      schema: requestSchemas.createChallenge,
      errorMessage: 'Invalid challenge data',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { challengeeId, leagueId } = data

    // Sanitize inputs
    const sanitizedChallengeeId = sanitizeUUID(challengeeId)
    // League IDs are strings like 'tt_league', 'fifa_league', not UUIDs
    const sanitizedLeagueId = sanitizeString(leagueId)
    
    if (!sanitizedChallengeeId) {
      return NextResponse.json(
        { error: 'Invalid challengee ID format' },
        { status: 400 }
      )
    }
    
    if (!sanitizedLeagueId || sanitizedLeagueId.length === 0) {
      return NextResponse.json(
        { error: 'Invalid league ID format' },
        { status: 400 }
      )
    }
      return NextResponse.json(
        { error: 'Invalid challengee ID or league ID format' },
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

    const challenger = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!challenger) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }
    
    // Check if challenger is in the league
    const challengerInLeague = db.prepare(`
      SELECT 1 FROM league_memberships 
      WHERE player_id = ? AND league_id = ? AND is_active = 1
    `).get(challenger.id, leagueId)
    
    if (!challengerInLeague) {
      return NextResponse.json(
        { error: 'You must be a member of the league to send challenges' },
        { status: 400 }
      )
    }
    
    // Check if challengee is in the league (allow challenging even if they're not in the league yet)
    // But if they are in the league, make sure they're active
    const challengeeInLeague = db.prepare(`
      SELECT 1 FROM league_memberships 
      WHERE player_id = ? AND league_id = ? AND is_active = 1
    `).get(sanitizedChallengeeId, sanitizedLeagueId)
    
    if (!challengeeInLeague) {
      return NextResponse.json(
        { error: 'The challenged player must be a member of the selected league' },
        { status: 400 }
      )
    }
    
    // Check for existing pending challenge
    const existingChallenge = db.prepare(`
      SELECT 1 FROM challenges 
      WHERE challenger_id = ? AND challengee_id = ? AND league_id = ? AND status = 'pending'
    `).get(challenger.id, sanitizedChallengeeId, sanitizedLeagueId)
    
    if (existingChallenge) {
      return NextResponse.json(
        { error: 'A pending challenge already exists between these players in this league' },
        { status: 400 }
      )
    }
    
    // Prevent self-challenge
    if (challenger.id === sanitizedChallengeeId) {
      return NextResponse.json(
        { error: 'Cannot challenge yourself' },
        { status: 400 }
      )
    }
    
    // Create challenge
    const challengeId = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Challenge expires in 7 days
    
    db.prepare(`
      INSERT INTO challenges (id, challenger_id, challengee_id, league_id, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(challengeId, challenger.id, sanitizedChallengeeId, sanitizedLeagueId, expiresAt.toISOString())
    
    return NextResponse.json({ 
      success: true, 
      challengeId,
      message: 'Challenge created successfully' 
    })
    
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    )
  }
}
