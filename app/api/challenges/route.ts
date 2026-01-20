import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Challenge } from '@/types/database'
import crypto from 'crypto'

export const runtime = 'nodejs' // Required for Prisma on Vercel

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

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { challengeeId, leagueId } = await request.json()
    
    if (!challengeeId || !leagueId) {
      return NextResponse.json(
        { error: 'Challengee ID and League ID are required' },
        { status: 400 }
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
    
    // Check if players are in the same league
    const challengerInLeague = db.prepare(`
      SELECT 1 FROM league_memberships 
      WHERE player_id = ? AND league_id = ? AND is_active = 1
    `).get(challenger.id, leagueId)
    
    const challengeeInLeague = db.prepare(`
      SELECT 1 FROM league_memberships 
      WHERE player_id = ? AND league_id = ? AND is_active = 1
    `).get(challengeeId, leagueId)
    
    if (!challengerInLeague || !challengeeInLeague) {
      return NextResponse.json(
        { error: 'Both players must be in the same league' },
        { status: 400 }
      )
    }
    
    // Check for existing pending challenge
    const existingChallenge = db.prepare(`
      SELECT 1 FROM challenges 
      WHERE challenger_id = ? AND challengee_id = ? AND league_id = ? AND status = 'pending'
    `).get(challenger.id, challengeeId, leagueId)
    
    if (existingChallenge) {
      return NextResponse.json(
        { error: 'A pending challenge already exists between these players in this league' },
        { status: 400 }
      )
    }
    
    // Prevent self-challenge
    if (challenger.id === challengeeId) {
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
    `).run(challengeId, challenger.id, challengeeId, leagueId, expiresAt.toISOString())
    
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
