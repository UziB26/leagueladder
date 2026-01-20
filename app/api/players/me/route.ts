import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Player } from '@/types/database'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface User {
  id: string;
  email: string;
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
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ player })
    
  } catch (error) {
    console.error('Error fetching current player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player data' },
      { status: 500 }
    )
  }
}
