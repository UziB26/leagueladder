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
    const { wins, losses, draws, games_played, reason } = body

    // Get current stats
    const currentStats = await db.playerRating.findUnique({
      where: {
        playerId_leagueId: {
          playerId: sanitizedPlayerId,
          leagueId: sanitizedLeagueId
        }
      }
    })

    if (!currentStats) {
      return NextResponse.json(
        { error: 'Player stats not found for this league' },
        { status: 404 }
      )
    }

    // Build update data (only update provided fields)
    const updateData: any = {}
    if (wins !== undefined) {
      if (typeof wins !== 'number' || wins < 0) {
        return NextResponse.json(
          { error: 'Wins must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.wins = wins
    }
    if (losses !== undefined) {
      if (typeof losses !== 'number' || losses < 0) {
        return NextResponse.json(
          { error: 'Losses must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.losses = losses
    }
    if (draws !== undefined) {
      if (typeof draws !== 'number' || draws < 0) {
        return NextResponse.json(
          { error: 'Draws must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.draws = draws
    }
    if (games_played !== undefined) {
      if (typeof games_played !== 'number' || games_played < 0) {
        return NextResponse.json(
          { error: 'Games played must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.gamesPlayed = games_played
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'At least one stat field must be provided' },
        { status: 400 }
      )
    }

    // Update stats
    const updatedStats = await db.playerRating.update({
      where: {
        playerId_leagueId: {
          playerId: sanitizedPlayerId,
          leagueId: sanitizedLeagueId
        }
      },
      data: updateData,
      include: {
        player: true,
        league: true
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'adjust_stats',
        targetId: sanitizedPlayerId,
        details: JSON.stringify({ 
          league_id: sanitizedLeagueId,
          old_stats: {
            wins: currentStats.wins,
            losses: currentStats.losses,
            draws: currentStats.draws,
            games_played: currentStats.gamesPlayed
          },
          new_stats: updateData,
          reason: reason || null
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Stats adjusted successfully',
      stats: {
        player_id: updatedStats.playerId,
        league_id: updatedStats.leagueId,
        wins: updatedStats.wins,
        losses: updatedStats.losses,
        draws: updatedStats.draws,
        games_played: updatedStats.gamesPlayed
      }
    })
    
  } catch (error) {
    console.error('Error adjusting stats:', error)
    return NextResponse.json(
      { error: 'Failed to adjust stats' },
      { status: 500 }
    )
  }
}
