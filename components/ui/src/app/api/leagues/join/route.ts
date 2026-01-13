import { NextResponse } from 'next/server'
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'

interface User {
  id: string;
  email: string;
  name: string;
}

interface Player {
  id: string;
  user_id: string;
  name: string;
  email: string;
}

export async function POST(request: Request) {
  try {
    // Simple auth check for now - we'll fix this properly later
    const authHeader = request.headers.get('authorization')
    
    // For now, accept all requests to keep moving forward
    // We'll implement proper auth in Day 6
    
    const { leagueId } = await request.json()
    
    if (!leagueId) {
      return NextResponse.json(
        { error: 'League ID is required' },
        { status: 400 }
      )
    }

    // For testing, use a mock user
    const mockUserEmail = "test@example.com"
    
    // Get user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(mockUserEmail) as User | undefined
    
    if (!user) {
      // Create mock user for testing
      const userId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO users (id, email, name) 
        VALUES (?, ?, ?)
      `).run(userId, mockUserEmail, 'Test Player')
      
      // Create player
      const playerId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO players (id, user_id, name, email) 
        VALUES (?, ?, ?, ?)
      `).run(playerId, userId, 'Test Player', mockUserEmail)
      
      // Join league
      const membershipId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO league_memberships (id, player_id, league_id) 
        VALUES (?, ?, ?)
      `).run(membershipId, playerId, leagueId)

      // Initialize rating
      const ratingId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO player_ratings (id, player_id, league_id, rating) 
        VALUES (?, ?, ?, 1000)
      `).run(ratingId, playerId, leagueId)

      return NextResponse.json({ 
        success: true, 
        message: 'Successfully created user and joined league' 
      })
    }

    // Check if player exists
    let player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      // Create player
      const playerId = crypto.randomUUID()
      db.prepare(`
        INSERT INTO players (id, user_id, name, email) 
        VALUES (?, ?, ?, ?)
      `).run(playerId, user.id, 'Player', mockUserEmail)
      
      player = { 
        id: playerId, 
        user_id: user.id, 
        name: 'Player', 
        email: mockUserEmail 
      }
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