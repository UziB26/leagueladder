import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID, sanitizeString } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string; leagueId: string }> }
) {
  try {
    const rateLimitResponse = await strictRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { playerId, leagueId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    const sanitizedLeagueId = sanitizeString(leagueId)
    
    if (!sanitizedPlayerId || !sanitizedLeagueId) {
      return NextResponse.json(
        { error: 'Invalid player ID or league ID format' },
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

    const body = await request.json()
    const { rating, reason } = body

    if (typeof rating !== 'number' || rating < 0 || rating > 5000) {
      return NextResponse.json(
        { error: 'Rating must be a number between 0 and 5000' },
        { status: 400 }
      )
    }

    // Get current rating
    const currentRating = await db.playerRating.findUnique({
      where: {
        playerId_leagueId: {
          playerId: sanitizedPlayerId,
          leagueId: sanitizedLeagueId
        }
      }
    })

    if (!currentRating) {
      return NextResponse.json(
        { error: 'Player rating not found for this league' },
        { status: 404 }
      )
    }

    const oldRating = currentRating.rating

    // Update rating
    const updatedRating = await db.playerRating.update({
      where: {
        playerId_leagueId: {
          playerId: sanitizedPlayerId,
          leagueId: sanitizedLeagueId
        }
      },
      data: {
        rating: Math.round(rating)
      },
      include: {
        player: true,
        league: true
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'adjust_rating',
        targetId: sanitizedPlayerId,
        details: JSON.stringify({ 
          league_id: sanitizedLeagueId,
          old_rating: oldRating,
          new_rating: Math.round(rating),
          reason: reason || null
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Rating adjusted successfully',
      rating: {
        player_id: updatedRating.playerId,
        league_id: updatedRating.leagueId,
        rating: updatedRating.rating,
        old_rating: oldRating
      }
    })
    
  } catch (error) {
    console.error('Error adjusting rating:', error)
    return NextResponse.json(
      { error: 'Failed to adjust rating' },
      { status: 500 }
    )
  }
}
