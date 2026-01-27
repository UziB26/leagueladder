import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const rateLimitResponse = await strictRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { matchId } = await params
    const sanitizedMatchId = sanitizeUUID(matchId)
    if (!sanitizedMatchId) {
      return NextResponse.json(
        { error: 'Invalid match ID format' },
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

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Get match with rating updates
      const match = await tx.match.findUnique({
        where: { id: sanitizedMatchId },
        include: {
          ratingUpdates: true
        }
      })

      if (!match) {
        throw new Error('Match not found')
      }

      if (match.status === 'voided') {
        throw new Error('Match is already voided')
      }

      // Only void completed matches (or pending_confirmation that were completed)
      if (match.status !== 'completed' && match.status !== 'pending_confirmation') {
        throw new Error('Only completed matches can be voided')
      }

      // Get rating updates for this match
      const ratingUpdates = await tx.ratingUpdate.findMany({
        where: { matchId: sanitizedMatchId }
      })

      if (ratingUpdates.length === 0) {
        // No rating updates to revert, just mark as voided
        await tx.match.update({
          where: { id: sanitizedMatchId },
          data: { status: 'voided' }
        })
        return { message: 'Match voided (no rating changes to revert)' }
      }

      // Revert ratings and stats for each player
      for (const update of ratingUpdates) {
        const rating = await tx.playerRating.findUnique({
          where: {
            playerId_leagueId: {
              playerId: update.playerId,
              leagueId: update.leagueId
            }
          }
        })

        if (!rating) continue

        // Determine if this was a win, loss, or draw based on match result
        const isPlayer1 = match.player1Id === update.playerId
        const isPlayer2 = match.player2Id === update.playerId
        const playerWon = (isPlayer1 && match.player1Score > match.player2Score) ||
                          (isPlayer2 && match.player2Score > match.player1Score)
        const playerLost = (isPlayer1 && match.player1Score < match.player2Score) ||
                           (isPlayer2 && match.player2Score < match.player1Score)
        const isDraw = match.player1Score === match.player2Score

        // Revert rating and stats
        await tx.playerRating.update({
          where: { id: rating.id },
          data: {
            rating: update.oldRating,
            gamesPlayed: { decrement: 1 },
            wins: playerWon ? { decrement: 1 } : undefined,
            losses: playerLost ? { decrement: 1 } : undefined,
            draws: isDraw ? { decrement: 1 } : undefined
          }
        })
      }

      // Mark match as voided
      await tx.match.update({
        where: { id: sanitizedMatchId },
        data: { status: 'voided' }
      })

      return { message: 'Match voided and ratings reverted successfully' }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'void_match',
        targetId: sanitizedMatchId,
        details: JSON.stringify({ 
          match_id: sanitizedMatchId
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: result.message
    })
    
  } catch (error: any) {
    console.error('Error voiding match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to void match' },
      { status: 500 }
    )
  }
}
