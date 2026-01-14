import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Challenge } from '@/types/database'

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
      return NextResponse.json({ challenges: [] })
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
      WHERE c.challengee_id = ?
      ORDER BY c.created_at DESC
      LIMIT 50
    `).all(player.id) as Challenge[]
    
    return NextResponse.json({ challenges })
    
  } catch (error) {
    console.error('Error fetching incoming challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}
