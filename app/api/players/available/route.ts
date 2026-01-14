import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface User {
  id: string;
  email: string;
}

interface Player {
  id: string;
  user_id: string;
  name: string;
}

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ players: [] })
    }

    const currentPlayer = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!currentPlayer) {
      return NextResponse.json({ players: [] })
    }

    // Get optional leagueId from query params
    const leagueId = request.nextUrl.searchParams.get('leagueId')
    
    let players
    
    if (leagueId) {
      // Get players in the specific league
      players = db.prepare(`
        SELECT DISTINCT 
          p.id, 
          p.name,
          COALESCE(pr.rating, 1000) as rating
        FROM players p
        JOIN league_memberships lm ON p.id = lm.player_id
        LEFT JOIN player_ratings pr ON p.id = pr.player_id AND pr.league_id = ?
        WHERE lm.league_id = ?
        AND p.id != ?
        AND lm.is_active = 1
        ORDER BY p.name
      `).all(leagueId, leagueId, currentPlayer.id)
    } else {
      // Get all players who are in at least one league (excluding current player)
      players = db.prepare(`
        SELECT DISTINCT 
          p.id, 
          p.name,
          COALESCE(MAX(pr.rating), 1000) as rating
        FROM players p
        JOIN league_memberships lm ON p.id = lm.player_id
        LEFT JOIN player_ratings pr ON p.id = pr.player_id
        WHERE p.id != ?
        AND lm.is_active = 1
        GROUP BY p.id, p.name
        ORDER BY p.name
      `).all(currentPlayer.id)
    }
    
    return NextResponse.json({ players })
    
  } catch (error) {
    console.error('Error fetching available players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available players' },
      { status: 500 }
    )
  }
}
