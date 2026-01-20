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

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json({ challenges: [] })
    }

    const challenges = await db.challenge.findMany({
      where: {
        OR: [
          { challengerId: player.id },
          { challengeeId: player.id }
        ]
      },
      include: {
        challenger: true,
        challengee: true,
        league: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
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

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const challenger = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!challenger) {
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }
    
    // Check if players are in the same league
    const challengerInLeague = await db.leagueMembership.findFirst({
      where: {
        playerId: challenger.id,
        leagueId: leagueId,
        isActive: true
      }
    })
    
    const challengeeInLeague = await db.leagueMembership.findFirst({
      where: {
        playerId: challengeeId,
        leagueId: leagueId,
        isActive: true
      }
    })
    
    if (!challengerInLeague || !challengeeInLeague) {
      return NextResponse.json(
        { error: 'Both players must be in the same league' },
        { status: 400 }
      )
    }
    
    // Check for existing pending challenge
    const existingChallenge = await db.challenge.findFirst({
      where: {
        challengerId: challenger.id,
        challengeeId: challengeeId,
        leagueId: leagueId,
        status: 'pending'
      }
    })
    
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
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Challenge expires in 7 days
    
    const challenge = await db.challenge.create({
      data: {
        challengerId: challenger.id,
        challengeeId: challengeeId,
        leagueId: leagueId,
        expiresAt: expiresAt,
        status: 'pending'
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      challengeId: challenge.id,
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
