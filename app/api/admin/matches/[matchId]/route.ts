import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { elo } from '@/lib/elo'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function PUT(
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

    const body = await request.json()
    const { player1_score, player2_score, reason } = body

    if (typeof player1_score !== 'number' || typeof player2_score !== 'number') {
      return NextResponse.json(
        { error: 'Both scores must be numbers' },
        { status: 400 }
      )
    }

    if (player1_score < 0 || player2_score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative' },
        { status: 400 }
      )
    }

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Get match with current rating updates
      const match = await tx.match.findUnique({
        where: { id: sanitizedMatchId },
        include: {
          ratingUpdates: true
        }
      })

      if (!match) {
        throw new Error('Match not found')
      }

      const oldScores = {
        player1: match.player1Score,
        player2: match.player2Score
      }

      // If match was completed, we need to revert old ratings first
      if (match.status === 'completed' && match.ratingUpdates.length > 0) {
        // Revert old ratings
        for (const update of match.ratingUpdates) {
          const rating = await tx.playerRating.findUnique({
            where: {
              playerId_leagueId: {
                playerId: update.playerId,
                leagueId: update.leagueId
              }
            }
          })

          if (!rating) continue

          const isPlayer1 = match.player1Id === update.playerId
          const isPlayer2 = match.player2Id === update.playerId
          const playerWon = (isPlayer1 && oldScores.player1 > oldScores.player2) ||
                            (isPlayer2 && oldScores.player2 > oldScores.player1)
          const playerLost = (isPlayer1 && oldScores.player1 < oldScores.player2) ||
                             (isPlayer2 && oldScores.player2 < oldScores.player1)
          const isDraw = oldScores.player1 === oldScores.player2

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

        // Delete old rating updates
        await tx.ratingUpdate.deleteMany({
          where: { matchId: sanitizedMatchId }
        })
      }

      // Update match scores
      await tx.match.update({
        where: { id: sanitizedMatchId },
        data: {
          player1Score: player1_score,
          player2Score: player2_score,
          winnerId: player1_score > player2_score 
            ? match.player1Id 
            : player2_score > player1_score 
            ? match.player2Id 
            : null
        }
      })

      // If match is completed, recalculate ratings with new scores
      if (match.status === 'completed') {
        const rating1 = await tx.playerRating.findUnique({
          where: {
            playerId_leagueId: {
              playerId: match.player1Id,
              leagueId: match.leagueId
            }
          }
        })

        const rating2 = await tx.playerRating.findUnique({
          where: {
            playerId_leagueId: {
              playerId: match.player2Id,
              leagueId: match.leagueId
            }
          }
        })

        if (rating1 && rating2) {
          // Calculate new Elo ratings
          const eloResult = elo.calculateForMatch(
            rating1.rating,
            rating2.rating,
            player1_score,
            player2_score
          )

          const newRating1 = Math.round(eloResult.newRatingA)
          const newRating2 = Math.round(eloResult.newRatingB)

          // Determine winner for stats
          const isDraw = player1_score === player2_score
          const player1Won = player1_score > player2_score
          const player2Won = player2_score > player1_score

          // Update player 1 rating and stats
          await tx.playerRating.update({
            where: { id: rating1.id },
            data: {
              rating: newRating1,
              gamesPlayed: { increment: 1 },
              wins: player1Won ? { increment: 1 } : undefined,
              losses: player2Won ? { increment: 1 } : undefined,
              draws: isDraw ? { increment: 1 } : undefined
            }
          })

          // Update player 2 rating and stats
          await tx.playerRating.update({
            where: { id: rating2.id },
            data: {
              rating: newRating2,
              gamesPlayed: { increment: 1 },
              wins: player2Won ? { increment: 1 } : undefined,
              losses: player1Won ? { increment: 1 } : undefined,
              draws: isDraw ? { increment: 1 } : undefined
            }
          })

          // Record new rating updates
          await tx.ratingUpdate.createMany({
            data: [
              {
                matchId: sanitizedMatchId,
                playerId: match.player1Id,
                leagueId: match.leagueId,
                oldRating: rating1.rating,
                newRating: newRating1,
                change: eloResult.changeA
              },
              {
                matchId: sanitizedMatchId,
                playerId: match.player2Id,
                leagueId: match.leagueId,
                oldRating: rating2.rating,
                newRating: newRating2,
                change: eloResult.changeB
              }
            ]
          })
        }
      }

      return { message: 'Match scores updated successfully' }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'edit_match_score',
        targetId: sanitizedMatchId,
        details: JSON.stringify({ 
          match_id: sanitizedMatchId,
          reason: reason || null
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: result.message
    })
    
  } catch (error: any) {
    console.error('Error updating match scores:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update match scores' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Get match before deletion for logging
    const match = await db.match.findUnique({
      where: { id: sanitizedMatchId },
      select: { id: true }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Delete match (cascades to rating updates, confirmations, etc.)
    await db.match.delete({
      where: { id: sanitizedMatchId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'delete_match',
        targetId: sanitizedMatchId,
        details: JSON.stringify({ 
          match_id: sanitizedMatchId
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Match deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
}
