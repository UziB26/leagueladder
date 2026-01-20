import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import { elo } from "@/lib/elo"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const POST = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ matchId: string }> }
) => {
  try {
    const user = request.session?.user as { id?: string }
    
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { matchId } = await (context?.params || Promise.resolve({ matchId: '' }))

    // Get the match using Prisma
    const match = await db.match.findUnique({
      where: { id: matchId }
    })

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== 'voided') {
      return NextResponse.json({ error: "Match is not voided" }, { status: 400 })
    }

    // Use Prisma transaction to un-void match and restore ratings
    await db.$transaction(async (tx) => {
      // Get current ratings for both players
      const player1Rating = await tx.playerRating.findUnique({
        where: {
          playerId_leagueId: {
            playerId: match.player1Id,
            leagueId: match.leagueId
          }
        }
      })

      const player2Rating = await tx.playerRating.findUnique({
        where: {
          playerId_leagueId: {
            playerId: match.player2Id,
            leagueId: match.leagueId
          }
        }
      })

      if (!player1Rating || !player2Rating) {
        throw new Error('Player ratings not found')
      }

      // Recalculate Elo ratings
      const eloResult = elo.calculateForMatch(
        player1Rating.rating,
        player2Rating.rating,
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
        where: { id: player1Rating.id },
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
        where: { id: player2Rating.id },
        data: {
          rating: newRating2,
          gamesPlayed: { increment: 1 },
          wins: player2Won ? { increment: 1 } : undefined,
          losses: player1Won ? { increment: 1 } : undefined,
          draws: isDraw ? { increment: 1 } : undefined,
          updatedAt: new Date()
        }
      })

      // Create rating update records
      await tx.ratingUpdate.createMany({
        data: [
          {
            matchId: matchId,
            playerId: match.player1Id,
            leagueId: match.leagueId,
            oldRating: player1Rating.rating,
            newRating: newRating1,
            change: eloResult.changeA
          },
          {
            matchId: matchId,
            playerId: match.player2Id,
            leagueId: match.leagueId,
            oldRating: player2Rating.rating,
            newRating: newRating2,
            change: eloResult.changeB
          }
        ]
      })

      // Update match status to completed
      await tx.match.update({
        where: { id: matchId },
        data: {
          status: 'completed',
          confirmedAt: new Date()
        }
      })

      // If match had a challenge, restore challenge status
      if (match.challengeId) {
        const challenge = await tx.challenge.findUnique({
          where: { id: match.challengeId }
        })
        
        if (challenge && challenge.status !== 'completed') {
          await tx.challenge.update({
            where: { id: match.challengeId },
            data: { status: 'completed' }
          })
        }
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id,
        action: 'unvoid_match',
        targetId: matchId,
        details: JSON.stringify({ 
          match_id: matchId,
          player1_id: match.player1Id,
          player2_id: match.player2Id
        })
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "Match un-voided successfully. Ratings have been restored."
    })
  } catch (error: any) {
    console.error('Error un-voiding match:', error)
    return NextResponse.json(
      { error: error.message || "Failed to un-void match" },
      { status: 500 }
    )
  }
})
