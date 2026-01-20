import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

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

    if (match.status === 'voided') {
      return NextResponse.json({ error: "Match is already voided" }, { status: 400 })
    }

    // Use Prisma transaction to void match and revert ratings
    await db.$transaction(async (tx) => {
      // If match was completed, revert Elo ratings
      if (match.status === 'completed') {
        // Get the rating updates for this match
        const ratingUpdates = await tx.ratingUpdate.findMany({
          where: { matchId: matchId },
          orderBy: { createdAt: 'desc' },
          take: 2
        })
        
        if (ratingUpdates.length === 2) {
          // Revert ratings to old values
          for (const update of ratingUpdates) {
            await tx.playerRating.update({
              where: {
                playerId_leagueId: {
                  playerId: update.playerId,
                  leagueId: update.leagueId
                }
              },
              data: {
                rating: update.oldRating,
                updatedAt: new Date(),
                // Decrement stats
                gamesPlayed: { decrement: 1 }
              }
            })

            // Determine which stat to decrement
            const playerRating = await tx.playerRating.findUnique({
              where: {
                playerId_leagueId: {
                  playerId: update.playerId,
                  leagueId: update.leagueId
                }
              }
            })

            if (playerRating) {
              const isPlayer1 = update.playerId === match.player1Id
              const player1Won = match.player1Score > match.player2Score
              const player2Won = match.player2Score > match.player1Score
              const isDraw = match.player1Score === match.player2Score

              if (isPlayer1) {
                await tx.playerRating.update({
                  where: { id: playerRating.id },
                  data: {
                    wins: player1Won ? { decrement: 1 } : undefined,
                    losses: player2Won ? { decrement: 1 } : undefined,
                    draws: isDraw ? { decrement: 1 } : undefined
                  }
                })
              } else {
                await tx.playerRating.update({
                  where: { id: playerRating.id },
                  data: {
                    wins: player2Won ? { decrement: 1 } : undefined,
                    losses: player1Won ? { decrement: 1 } : undefined,
                    draws: isDraw ? { decrement: 1 } : undefined
                  }
                })
              }
            }
          }
          
          // Delete rating update records
          await tx.ratingUpdate.deleteMany({
            where: { matchId: matchId }
          })
        }
      }

      // Update match status to voided
      await tx.match.update({
        where: { id: matchId },
        data: { status: 'voided' }
      })

      // If match had a challenge, revert challenge status if needed
      if (match.challengeId) {
        const challenge = await tx.challenge.findUnique({
          where: { id: match.challengeId }
        })
        
        if (challenge && challenge.status === 'completed') {
          // Revert challenge to accepted status
          await tx.challenge.update({
            where: { id: match.challengeId },
            data: { status: 'accepted' }
          })
        }
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id,
        action: 'void_match',
        targetId: matchId,
        details: JSON.stringify({ 
          match_id: matchId,
          previous_status: match.status,
          player1_id: match.player1Id,
          player2_id: match.player2Id
        })
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "Match voided successfully. Ratings have been reverted."
    })
  } catch (error: any) {
    console.error('Error voiding match:', error)
    return NextResponse.json(
      { error: error.message || "Failed to void match" },
      { status: 500 }
    )
  }
})
