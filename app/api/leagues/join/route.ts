import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import crypto from 'crypto'

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Player {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
}

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { leagueId } = await request.json()
    
    if (!leagueId) {
      return NextResponse.json(
        { error: 'League ID is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if player exists, create if not
    let player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      const playerId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO players (id, user_id, name, email) 
        VALUES (?, ?, ?, ?)
      `).run(playerId, user.id, user.name || session.user.name || 'Player', user.email)
      
      player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player
    }

    // Check if already joined
    const existingMembership = db.prepare(`
      SELECT * FROM league_memberships 
      WHERE player_id = ? AND league_id = ?
    `).get(player.id, leagueId)

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already joined this league' },
        { status: 400 }
      )
    }

    // Join league
    const membershipId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO league_memberships (id, player_id, league_id) 
      VALUES (?, ?, ?)
    `).run(membershipId, player.id, leagueId)

    // Initialize rating
    const ratingId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO player_ratings (id, player_id, league_id, rating) 
      VALUES (?, ?, ?, 1000)
    `).run(ratingId, player.id, leagueId)

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined league' 
    })

  } catch (error) {
    console.error('Error joining league:', error)
    return NextResponse.json(
      { error: 'Failed to join league' },
      { status: 500 }
    )
  }
}
