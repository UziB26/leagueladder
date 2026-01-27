import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { elo } from '@/lib/elo'
import { apiRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * POST /api/matches/[matchId]/confirm
 * Confirm a match result reported by opponent
 * 
 * Request Body:
 * {
 *   action: 'confirmed' | 'disputed',
 *   dispute_reason?: string,  // Required if action is 'disputed'
 *   confirmed_score1?: number,  // Optional: if disputing, provide correct scores
 *   confirmed_score2?: number
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
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

    const body = await request.json()
    const { action, dispute_reason, confirmed_score1, confirmed_score2 } = body

    if (!action || !['confirmed', 'disputed'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "confirmed" or "disputed"' },
        { status: 400 }
      )
    }

    if (action === 'disputed' && !dispute_reason) {
      return NextResponse.json(
        { error: 'Dispute reason is required when disputing a match' },
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

    // Get user using Prisma
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get player using Prisma
    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Get the match using Prisma
    const match = await db.match.findUnique({
      where: { id: sanitizedMatchId },
      include: {
        player1: {
          select: {
            name: true
          }
        },
        player2: {
          select: {
            name: true
          }
        }
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    console.log('Match found:', {
      id: match.id,
      status: match.status,
      player1Id: match.player1Id,
      player2Id: match.player2Id,
      leagueId: match.leagueId
    })

    // Verify the player is part of this match
    if (player.id !== match.player1Id && player.id !== match.player2Id) {
      return NextResponse.json(
        { error: 'You can only confirm matches you participated in' },
        { status: 403 }
      )
    }

    // Verify match is pending confirmation
    if (match.status !== 'pending_confirmation') {
      return NextResponse.json(
        { error: `Match is not pending confirmation. Current status: ${match.status}` },
        { status: 400 }
      )
    }

    // Verify player is not the one who reported
    if (match.reportedBy === player.id) {
      return NextResponse.json(
        { error: 'You cannot confirm your own match report' },
        { status: 400 }
      )
    }

    // Check if player already confirmed/disputed using Prisma
    const existingConfirmation = await db.matchConfirmation.findFirst({
      where: {
        matchId: sanitizedMatchId,
        playerId: player.id
      }
    })

    if (existingConfirmation) {
      return NextResponse.json(
        { error: 'You have already responded to this match' },
        { status: 400 }
      )
    }

    try {
      if (action === 'confirmed') {
        // Player confirmed the match - use Prisma transaction
        console.log('=== MATCH CONFIRMATION START ===')
        console.log('Match ID:', sanitizedMatchId)
        console.log('Player confirming:', player.id)
        console.log('Match data:', {
          player1Id: match.player1Id,
          player2Id: match.player2Id,
          leagueId: match.leagueId,
          player1Score: match.player1Score,
          player2Score: match.player2Score,
          status: match.status
        })
        
        // Use Prisma transaction for atomicity
        const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
          // Record confirmation
          await tx.matchConfirmation.create({
            data: {
              matchId: sanitizedMatchId,
              playerId: player.id,
              action: 'confirmed'
            }
          })

          // Get or create player ratings
          const rating1 = await tx.playerRating.upsert({
            where: {
              playerId_leagueId: {
                playerId: match.player1Id,
                leagueId: match.leagueId
              }
            },
            update: {},
            create: {
              playerId: match.player1Id,
              leagueId: match.leagueId,
              rating: 1000,
              gamesPlayed: 0,
              wins: 0,
              losses: 0,
              draws: 0
            }
          })

          const rating2 = await tx.playerRating.upsert({
            where: {
              playerId_leagueId: {
                playerId: match.player2Id,
                leagueId: match.leagueId
              }
            },
            update: {},
            create: {
              playerId: match.player2Id,
              leagueId: match.leagueId,
              rating: 1000,
              gamesPlayed: 0,
              wins: 0,
              losses: 0,
              draws: 0
            }
          })

          console.log('Current ratings before update:', {
            player1: { id: match.player1Id, rating: rating1.rating },
            player2: { id: match.player2Id, rating: rating2.rating }
          })

          // Calculate new Elo ratings
          const eloResult = elo.calculateForMatch(
            rating1.rating,
            rating2.rating,
            match.player1Score,
            match.player2Score
          )

          const newRating1 = Math.round(eloResult.newRatingA)
          const newRating2 = Math.round(eloResult.newRatingB)

          console.log('Elo calculation result:', {
            player1: { old: rating1.rating, new: newRating1, change: eloResult.changeA },
            player2: { old: rating2.rating, new: newRating2, change: eloResult.changeB },
            scores: { player1: match.player1Score, player2: match.player2Score },
            matchId: sanitizedMatchId
          })

          // Warn if change is 0 for a win/loss (shouldn't happen)
          if ((match.player1Score > match.player2Score && eloResult.changeA === 0) ||
              (match.player2Score > match.player1Score && eloResult.changeB === 0)) {
            console.warn('WARNING: Elo change is 0 for a win!', {
              matchId: sanitizedMatchId,
              scores: { player1: match.player1Score, player2: match.player2Score },
              ratings: { player1: rating1.rating, player2: rating2.rating },
              changes: { player1: eloResult.changeA, player2: eloResult.changeB }
            })
          }

          // Determine winner for stats
          const isDraw = match.player1Score === match.player2Score
          const player1Won = match.player1Score > match.player2Score
          const player2Won = match.player2Score > match.player1Score

          // Update player 1 rating and stats
          const player1UpdateData: any = {
            rating: newRating1,
            gamesPlayed: { increment: 1 },
            updatedAt: new Date()
          }
          if (player1Won) {
            player1UpdateData.wins = { increment: 1 }
          }
          if (player2Won) {
            player1UpdateData.losses = { increment: 1 }
          }
          if (isDraw) {
            player1UpdateData.draws = { increment: 1 }
          }
          
          await tx.playerRating.update({
            where: { id: rating1.id },
            data: player1UpdateData
          })

          // Update player 2 rating and stats
          const player2UpdateData: any = {
            rating: newRating2,
            gamesPlayed: { increment: 1 },
            updatedAt: new Date()
          }
          if (player2Won) {
            player2UpdateData.wins = { increment: 1 }
          }
          if (player1Won) {
            player2UpdateData.losses = { increment: 1 }
          }
          if (isDraw) {
            player2UpdateData.draws = { increment: 1 }
          }
          
          await tx.playerRating.update({
            where: { id: rating2.id },
            data: player2UpdateData
          })

          // Record rating updates - check if they already exist first to prevent duplicates
          const existingUpdate1 = await tx.ratingUpdate.findFirst({
            where: {
              matchId: sanitizedMatchId,
              playerId: match.player1Id
            }
          })
          
          const existingUpdate2 = await tx.ratingUpdate.findFirst({
            where: {
              matchId: sanitizedMatchId,
              playerId: match.player2Id
            }
          })

          if (!existingUpdate1) {
            await tx.ratingUpdate.create({
              data: {
                matchId: sanitizedMatchId,
                playerId: match.player1Id,
                leagueId: match.leagueId,
                oldRating: rating1.rating,
                newRating: newRating1,
                change: eloResult.changeA
              }
            })
          }

          if (!existingUpdate2) {
            await tx.ratingUpdate.create({
              data: {
                matchId: sanitizedMatchId,
                playerId: match.player2Id,
                leagueId: match.leagueId,
                oldRating: rating2.rating,
                newRating: newRating2,
                change: eloResult.changeB
              }
            })
          }

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
            player1Rating: newRating1,
            player2Rating: newRating2
          }
        })

        console.log('=== MATCH CONFIRMATION SUCCESS ===')

        return NextResponse.json({
          success: true,
          message: 'Match confirmed successfully. Ratings have been updated.',
          ratings: {
            player1: result.player1Rating,
            player2: result.player2Rating
          }
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          }
        })
      } else {
        // Player disputed the match - use Prisma
        await db.$transaction(async (tx: Prisma.TransactionClient) => {
          // Record dispute
          await tx.matchConfirmation.create({
            data: {
              matchId: sanitizedMatchId,
              playerId: player.id,
              action: 'disputed',
              disputeReason: dispute_reason || undefined,
              confirmedScore1: confirmed_score1 || undefined,
              confirmedScore2: confirmed_score2 || undefined
            }
          })

          // Update match status to disputed
          await tx.match.update({
            where: { id: sanitizedMatchId },
            data: {
              status: 'disputed'
            }
          })
        })

        return NextResponse.json({
          success: true,
          message: 'Match disputed. An admin will review the dispute.'
        })
      }
    } catch (error: any) {
      console.error('=== MATCH CONFIRMATION ERROR ===')
      console.error('Error in match confirmation:', error)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      console.error('Match ID:', sanitizedMatchId)
      console.error('Player ID:', player?.id)
      return NextResponse.json(
        { 
          error: error.message || 'Failed to confirm match',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error in match confirmation route:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to confirm match',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
