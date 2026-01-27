import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { elo } from '@/lib/elo'
import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * POST /api/admin/matches/[matchId]/resolve-dispute
 * Resolve a disputed match by choosing which scores are correct
 * 
 * Request Body:
 * {
 *   use_reported_scores: boolean,  // true to use reported scores, false to use disputed scores
 *   reason?: string  // Optional reason for the resolution
 * }
 */
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

    const body = await request.json()
    const { use_reported_scores, reason } = body

    if (typeof use_reported_scores !== 'boolean') {
      return NextResponse.json(
        { error: 'use_reported_scores must be a boolean' },
        { status: 400 }
      )
    }

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get match with confirmations and rating updates
      const match = await tx.match.findUnique({
        where: { id: sanitizedMatchId },
        include: {
          confirmations: {
            where: {
              action: 'disputed'
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          ratingUpdates: true
        }
      })

      if (!match) {
        throw new Error('Match not found')
      }

      if (match.status !== 'disputed') {
        throw new Error('Match is not disputed')
      }

      // Get the dispute confirmation (should have corrected scores)
      const dispute = match.confirmations[0]
      if (!dispute) {
        throw new Error('No dispute found for this match')
      }

      // Determine which scores to use
      let finalPlayer1Score: number
      let finalPlayer2Score: number

      if (use_reported_scores) {
        // Use the originally reported scores
        finalPlayer1Score = match.player1Score
        finalPlayer2Score = match.player2Score
      } else {
        // Use the disputed scores (corrected scores from the dispute)
        if (dispute.confirmedScore1 === null || dispute.confirmedScore2 === null) {
          throw new Error('Disputed match does not have corrected scores. Please use reported scores.')
        }
        finalPlayer1Score = dispute.confirmedScore1
        finalPlayer2Score = dispute.confirmedScore2
      }

      // If match was previously completed, revert old ratings first
      if (match.ratingUpdates.length > 0) {
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
          const playerWon = (isPlayer1 && match.player1Score > match.player2Score) ||
                            (isPlayer2 && match.player2Score > match.player1Score)
          const playerLost = (isPlayer1 && match.player1Score < match.player2Score) ||
                             (isPlayer2 && match.player2Score < match.player1Score)
          const isDraw = match.player1Score === match.player2Score

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

      // Update match with final scores
      await tx.match.update({
        where: { id: sanitizedMatchId },
        data: {
          player1Score: finalPlayer1Score,
          player2Score: finalPlayer2Score,
          winnerId: finalPlayer1Score > finalPlayer2Score 
            ? match.player1Id 
            : finalPlayer2Score > finalPlayer1Score 
            ? match.player2Id 
            : null
        }
      })

      // Get current ratings for both players
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

      if (!rating1 || !rating2) {
        throw new Error('Player ratings not found')
      }

      // Calculate new Elo ratings with final scores
      const eloResult = elo.calculateForMatch(
        rating1.rating,
        rating2.rating,
        finalPlayer1Score,
        finalPlayer2Score
      )

      const newRating1 = Math.round(eloResult.newRatingA)
      const newRating2 = Math.round(eloResult.newRatingB)

      // Determine winner for stats
      const isDraw = finalPlayer1Score === finalPlayer2Score
      const player1Won = finalPlayer1Score > finalPlayer2Score
      const player2Won = finalPlayer2Score > finalPlayer1Score

      // Update player 1 rating and stats
      await tx.playerRating.update({
        where: { id: rating1.id },
        data: {
          rating: newRating1,
          gamesPlayed: { increment: 1 },
          wins: player1Won ? { increment: 1 } : undefined,
          losses: player2Won ? { increment: 1 } : undefined,
          draws: isDraw ? { increment: 1 } : undefined,
          updatedAt: new Date()
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
          draws: isDraw ? { increment: 1 } : undefined,
          updatedAt: new Date()
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

      // Update match status to completed
      await tx.match.update({
        where: { id: sanitizedMatchId },
        data: {
          status: 'completed',
          confirmedAt: new Date()
        }
      })

      // Mark challenge as completed if exists
      if (match.challengeId) {
        await tx.challenge.updateMany({
          where: {
            id: match.challengeId,
            status: 'accepted'
          },
          data: {
            status: 'completed'
          }
        })
      }

      return {
        message: 'Dispute resolved successfully. Match completed with chosen scores.',
        scores: {
          player1: finalPlayer1Score,
          player2: finalPlayer2Score
        },
        ratings: {
          player1: newRating1,
          player2: newRating2
        }
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'resolve_dispute',
        targetId: sanitizedMatchId,
        details: JSON.stringify({ 
          match_id: sanitizedMatchId,
          use_reported_scores: use_reported_scores,
          reason: reason || null
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: result.message,
      scores: result.scores,
      ratings: result.ratings
    })
    
  } catch (error: any) {
    console.error('Error resolving dispute:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to resolve dispute' },
      { status: 500 }
    )
  }
}
