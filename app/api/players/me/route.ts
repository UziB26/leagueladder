import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Player } from '@/types/database'
import { sanitizeString } from '@/lib/sanitize'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

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

export async function PUT(request: Request) {
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
      return NextResponse.json(
        { error: 'Player profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const sanitizedName = sanitizeString(name.trim())
    
    if (!sanitizedName || sanitizedName.length < 1) {
      return NextResponse.json(
        { error: 'Invalid name format' },
        { status: 400 }
      )
    }

    if (sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be 100 characters or less' },
        { status: 400 }
      )
    }

    // Check if name is already taken by another player
    const existingPlayer = await db.player.findFirst({
      where: {
        name: sanitizedName,
        userId: { not: user.id }
      }
    })

    if (existingPlayer) {
      return NextResponse.json(
        { error: 'This name is already taken' },
        { status: 400 }
      )
    }

    // Update player name
    const updatedPlayer = await db.player.update({
      where: { id: player.id },
      data: { name: sanitizedName }
    })

    return NextResponse.json({ 
      player: updatedPlayer,
      message: 'Name updated successfully'
    })
    
  } catch (error: any) {
    console.error('Error updating player name:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This name is already taken' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update player name' },
      { status: 500 }
    )
  }
}
