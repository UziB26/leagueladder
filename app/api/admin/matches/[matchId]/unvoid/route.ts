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
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Get match
      const match = await tx.match.findUnique({
        where: { id: sanitizedMatchId }
      })

      if (!match) {
        throw new Error('Match not found')
      }

      if (match.status !== 'voided') {
        throw new Error('Match is not voided')
      }

      // Get current ratings
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

      // Calculate new Elo ratings
      const eloResult = elo.calculateForMatch(
        rating1.rating,
        rating2.rating,
        match.player1Score,
        match.player2Score
      )

      const newRating1 = Math.round(eloResult.newRatingA)
      const newRating2 = Math.round(eloResult.newRatingB)

      // Determine winner for stats
      const isDraw = match.player1Score === match.player2Score
      const player1Won = match.player1Score > match.player2Score
      const player2Won = match.player2Score > match.player1Score

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

      // Record rating updates (or update existing ones)
      await tx.ratingUpdate.deleteMany({
        where: { matchId: sanitizedMatchId }
      })

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

      // Mark match as completed
      await tx.match.update({
        where: { id: sanitizedMatchId },
        data: { 
          status: 'completed',
          winnerId: player1Won ? match.player1Id : player2Won ? match.player2Id : null
        }
      })

      return { message: 'Match un-voided and ratings recalculated successfully' }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'unvoid_match',
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
    console.error('Error un-voiding match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to un-void match' },
      { status: 500 }
    )
  }
}
