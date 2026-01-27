// @ts-nocheck

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ challenges: [] })
    }

    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json({ challenges: [] })
    }

    const challenges = await db.challenge.findMany({
      where: {
        challengeeId: player.id
      },
      include: {
        challenger: {
          select: {
            name: true
          }
        },
        challengee: {
          select: {
            name: true
          }
        },
        league: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    }) as Array<{
      id: string
      createdAt: Date
      expiresAt: Date | null
      status: string
      challengeeId: string
      challengerId: string
      leagueId: string
      challenger: { name: string }
      challengee: { name: string }
      league: { name: string }
    }>

    // Transform to match expected format
    const formattedChallenges = challenges.map((c: {
      id: string
      challengerId: string
      challengeeId: string
      leagueId: string
      status: string
      createdAt: Date
      expiresAt: Date | null
      challenger: { name: string }
      challengee: { name: string }
      league: { name: string }
    }) => ({
      id: c.id,
      challenger_id: c.challengerId,
      challengee_id: c.challengeeId,
      league_id: c.leagueId,
      status: c.status,
      created_at: c.createdAt.toISOString(),
      expires_at: c.expiresAt ? c.expiresAt.toISOString() : null,
      challenger_name: c.challenger.name,
      challengee_name: c.challengee.name,
      league_name: c.league.name
    }))
    
    return NextResponse.json({ challenges: formattedChallenges })
    
  } catch (error) {
    console.error('Error fetching incoming challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    )
  }
}
