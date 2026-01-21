import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { playerId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json(
        { error: 'Invalid player ID format' },
        { status: 400 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })
    
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const player = await db.player.findUnique({
      where: { id: sanitizedPlayerId },
      include: {
        user: {
          select: {
            email: true,
            isAdmin: true
          }
        },
        ratings: {
          include: {
            league: true
          }
        }
      }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Format ratings
    const ratings = player.ratings.map(r => ({
      player_id: r.playerId,
      league_id: r.leagueId,
      rating: r.rating,
      wins: r.wins,
      losses: r.losses,
      draws: r.draws,
      games_played: r.gamesPlayed,
      league_name: r.league.name
    }))

    return NextResponse.json({
      id: player.id,
      user_id: player.userId,
      name: player.name,
      email: player.email || player.user.email,
      avatar: player.avatar,
      created_at: player.createdAt.toISOString(),
      ratings
    })
    
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { playerId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json(
        { error: 'Invalid player ID format' },
        { status: 400 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true }
    })
    
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get player before deletion for logging
    const player = await db.player.findUnique({
      where: { id: sanitizedPlayerId },
      select: { name: true, userId: true }
    })

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Delete player (cascades to ratings, memberships, etc.)
    await db.player.delete({
      where: { id: sanitizedPlayerId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'delete_player',
        targetId: sanitizedPlayerId,
        details: JSON.stringify({ 
          player_name: player.name
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Player deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}
