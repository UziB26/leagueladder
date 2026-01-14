import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface User {
  id: string;
  email: string;
}

interface Player {
  id: string;
  user_id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    // Get authenticated user
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ isMember: false })
    }

    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json({ isMember: false })
    }

    // Get player
    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json({ isMember: false })
    }

    // Check membership
    const membership = db.prepare(`
      SELECT * FROM league_memberships 
      WHERE player_id = ? AND league_id = ?
    `).get(player.id, leagueId)

    return NextResponse.json({ 
      isMember: !!membership 
    })

  } catch (error) {
    console.error('Error checking membership:', error)
    return NextResponse.json({ isMember: false })
  }
}
