import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface User {
  id: string
  email: string
}

interface Player {
  id: string
  user_id: string
}

export async function GET(request: Request) {
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
      return NextResponse.json({ matches: [] })
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get matches for the current player with rating updates
    const matches = db.prepare(`
      SELECT 
        m.id,
        m.player1_id,
        m.player2_id,
        m.player1_score,
        m.player2_score,
        m.winner_id,
        m.league_id,
        m.status,
        m.played_at,
        m.confirmed_at,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
        AND m.status = 'completed'
      ORDER BY m.played_at DESC
      LIMIT ?
    `).all(player.id, player.id, limit) as any[]

    // Get rating updates for each match
    const matchesWithRatings = matches.map(match => {
      // Get rating updates for player1
      const ratingUpdate1 = db.prepare(`
        SELECT old_rating, new_rating, change
        FROM rating_updates
        WHERE match_id = ? AND player_id = ?
        LIMIT 1
      `).get(match.id, match.player1_id) as any

      // Get rating updates for player2
      const ratingUpdate2 = db.prepare(`
        SELECT old_rating, new_rating, change
        FROM rating_updates
        WHERE match_id = ? AND player_id = ?
        LIMIT 1
      `).get(match.id, match.player2_id) as any

      return {
        ...match,
        rating_updates: {
          player1: ratingUpdate1 || null,
          player2: ratingUpdate2 || null
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })

  } catch (error: any) {
    console.error('Error fetching match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
