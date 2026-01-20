import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import { elo } from "@/lib/elo"
import { z } from "zod"

export const runtime = 'nodejs' // Required for Prisma on Vercel

const updateMatchScoreSchema = z.object({
  player1_score: z.number().int().min(0).max(1000, "Score must be reasonable"),
  player2_score: z.number().int().min(0).max(1000, "Score must be reasonable"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason is too long").optional(),
})

export const PUT = apiHandlers.admin(
  async (
    request: NextRequest & { session?: any; validatedData?: any },
    context?: { params?: Promise<{ matchId: string }> }
  ) => {
    try {
      const { matchId } = await (context?.params || Promise.resolve({ matchId: '' }))
      const user = request.session?.user as { id?: string }
      
      if (!user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Validate request body
      const body = await request.json()
      const validationResult = updateMatchScoreSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: "Invalid request data", details: validationResult.error.issues },
          { status: 400 }
        )
      }

      const { player1_score, player2_score, reason } = validationResult.data

      // Get the match using Prisma
      const match = await db.match.findUnique({
        where: { id: matchId }
      })

      if (!match) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 })
      }

      if (match.status === 'voided') {
        return NextResponse.json({ error: "Cannot update scores for voided matches. Un-void the match first." }, { status: 400 })
      }

      const oldPlayer1Score = match.player1Score
      const oldPlayer2Score = match.player2Score
      const oldWinnerId = match.winnerId

      // Determine new winner
      let newWinnerId: string | null = null
      if (player1_score > player2_score) {
        newWinnerId = match.player1Id
      } else if (player2_score > player1_score) {
        newWinnerId = match.player2Id
      }

      // Use Prisma transaction to update match and recalculate ratings if needed
      await db.$transaction(async (tx) => {
        // Update match scores and winner
        await tx.match.update({
          where: { id: matchId },
          data: {
            player1Score: player1_score,
            player2Score: player2_score,
            winnerId: newWinnerId || undefined
          }
        })

        // If match was completed and winner changed, recalculate ratings
        if (match.status === 'completed' && oldWinnerId !== newWinnerId) {
          // Get current player ratings
          const [player1Rating, player2Rating, originalUpdates] = await Promise.all([
            tx.playerRating.findUnique({
              where: {
                playerId_leagueId: {
                  playerId: match.player1Id,
                  leagueId: match.leagueId
                }
              }
            }),
            tx.playerRating.findUnique({
              where: {
                playerId_leagueId: {
                  playerId: match.player2Id,
                  leagueId: match.leagueId
                }
              }
            }),
            tx.ratingUpdate.findMany({
              where: { matchId },
              orderBy: { createdAt: 'desc' },
              take: 2
            })
          ])

          if (player1Rating && player2Rating && originalUpdates.length === 2) {
            // Get the original old ratings from the rating updates
            const player1OriginalOld = originalUpdates.find(u => u.playerId === match.player1Id)?.oldRating || player1Rating.rating
            const player2OriginalOld = originalUpdates.find(u => u.playerId === match.player2Id)?.oldRating || player2Rating.rating

            // Revert to original ratings first
            await tx.playerRating.update({
              where: { id: player1Rating.id },
              data: {
                rating: player1OriginalOld,
                updatedAt: new Date()
              }
            })

            await tx.playerRating.update({
              where: { id: player2Rating.id },
              data: {
                rating: player2OriginalOld,
                updatedAt: new Date()
              }
            })

            // Recalculate with new scores
            const eloResult = elo.calculateForMatch(
              player1OriginalOld,
              player2OriginalOld,
              player1_score,
              player2_score
            )

            const newRating1 = Math.round(eloResult.newRatingA)
            const newRating2 = Math.round(eloResult.newRatingB)

            // Update ratings with new values
            await tx.playerRating.update({
              where: { id: player1Rating.id },
              data: {
                rating: newRating1,
                updatedAt: new Date()
              }
            })

            await tx.playerRating.update({
              where: { id: player2Rating.id },
              data: {
                rating: newRating2,
                updatedAt: new Date()
              }
            })

            // Update rating update records
            const update1 = originalUpdates.find(u => u.playerId === match.player1Id)
            if (update1) {
              await tx.ratingUpdate.update({
                where: { id: update1.id },
                data: {
                  oldRating: player1OriginalOld,
                  newRating: newRating1,
                  change: eloResult.changeA
                }
              })
            }

            const update2 = originalUpdates.find(u => u.playerId === match.player2Id)
            if (update2) {
              await tx.ratingUpdate.update({
                where: { id: update2.id },
                data: {
                  oldRating: player2OriginalOld,
                  newRating: newRating2,
                  change: eloResult.changeB
                }
              })
            }
          }
        }
      })

      // Log admin action
      await db.adminAction.create({
        data: {
          userId: user.id,
          action: 'update_match_scores',
          targetId: matchId,
          details: JSON.stringify({ 
            match_id: matchId,
            old_scores: { player1: oldPlayer1Score, player2: oldPlayer2Score },
            new_scores: { player1: player1_score, player2: player2_score },
            reason: reason || 'Manual admin correction'
          })
        }
      })

      return NextResponse.json({ 
        success: true,
        message: `Match scores updated from ${oldPlayer1Score}-${oldPlayer2Score} to ${player1_score}-${player2_score}`
      })
    } catch (error: any) {
      console.error('Error updating match scores:', error)
      return NextResponse.json(
        { error: error.message || "Failed to update match scores" },
        { status: 500 }
      )
    }
  },
  {
    validationSchema: undefined, // We handle validation manually
  }
)

export const DELETE = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ matchId: string }> }
) => {
  try {
    const { matchId } = await (context?.params || Promise.resolve({ matchId: '' }))
    const user = request.session?.user as { id?: string }
    
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete match using Prisma (cascade will handle related records)
    await db.match.delete({
      where: { id: matchId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id,
        action: 'delete_match',
        targetId: matchId,
        details: JSON.stringify({ match_id: matchId })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    )
  }
})
