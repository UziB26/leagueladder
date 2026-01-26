import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

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

      // Check if match is already deleted (shouldn't happen, but safety check)
      // No need to check for voided status since we're deleting now

      // When admin cancels a match, delete it instead of voiding
      // First, revert any rating changes if the match was completed
      if (match.status === 'completed') {
        // Get rating updates for this match
        const ratingUpdates = await tx.ratingUpdate.findMany({
          where: { matchId: sanitizedMatchId }
        })

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
      }

      // Delete the match (cascades to rating updates, confirmations, etc.)
      await tx.match.delete({
        where: { id: sanitizedMatchId }
      })

      return { message: 'Match cancelled and deleted successfully' }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'cancel_match',
        targetId: sanitizedMatchId,
        details: JSON.stringify({ 
          match_id: sanitizedMatchId,
          action: 'cancelled_and_deleted'
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: result.message
    })
    
  } catch (error: any) {
    console.error('Error cancelling match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel match' },
      { status: 500 }
    )
  }
}
