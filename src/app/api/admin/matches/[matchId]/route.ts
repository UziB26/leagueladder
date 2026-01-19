import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db, DatabaseTransaction, createBackup, restoreBackup } from "@/lib/db"
import { EloCalculator } from "@/lib/elo"
import { z } from "zod"
import crypto from "crypto"

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

      // Get the match
      const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId) as any
      if (!match) {
        return NextResponse.json({ error: "Match not found" }, { status: 404 })
      }

      if (match.status === 'voided') {
        return NextResponse.json({ error: "Cannot update scores for voided matches. Un-void the match first." }, { status: 400 })
      }

      // Create backup
      const backup = createBackup({
        matchIds: [matchId],
        playerIds: [match.player1_id, match.player2_id],
      })

      try {
        DatabaseTransaction.execute((tx) => {
          const oldPlayer1Score = match.player1_score
          const oldPlayer2Score = match.player2_score

          // Determine old and new winners
          const oldWinnerId = match.winner_id
          let newWinnerId: string | null = null
          if (player1_score > player2_score) {
            newWinnerId = match.player1_id
          } else if (player2_score > player1_score) {
            newWinnerId = match.player2_id
          }

          // Update match scores and winner
          tx.run(
            db.prepare(`
              UPDATE matches
              SET player1_score = ?, player2_score = ?, winner_id = ?
              WHERE id = ?
            `),
            player1_score,
            player2_score,
            newWinnerId,
            matchId
          )

          // If match was completed, we need to recalculate ratings
          if (match.status === 'completed' && oldWinnerId !== newWinnerId) {
            // Get current ratings
            const player1Rating = tx.get(
              db.prepare('SELECT * FROM player_ratings WHERE player_id = ? AND league_id = ?'),
              match.player1_id,
              match.league_id
            ) as any

            const player2Rating = tx.get(
              db.prepare('SELECT * FROM player_ratings WHERE player_id = ? AND league_id = ?'),
              match.player2_id,
              match.league_id
            ) as any

            if (player1Rating && player2Rating) {
              // Get the original rating updates for this match
              const originalUpdates = tx.all(
                db.prepare(`
                  SELECT * FROM rating_updates
                  WHERE match_id = ?
                  ORDER BY created_at DESC
                  LIMIT 2
                `),
                matchId
              ) as any[]

              if (originalUpdates.length === 2) {
                // Revert to old ratings first
                const revertRating = db.prepare(`
                  UPDATE player_ratings
                  SET rating = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE player_id = ? AND league_id = ?
                `)
                originalUpdates.forEach((update) => {
                  tx.run(revertRating, update.old_rating, update.player_id, update.league_id)
                })

                // Recalculate with new scores
                const eloCalculator = new EloCalculator()
                const player1OldRating = originalUpdates.find((u: any) => u.player_id === match.player1_id)?.old_rating || player1Rating.rating
                const player2OldRating = originalUpdates.find((u: any) => u.player_id === match.player2_id)?.old_rating || player2Rating.rating

                const player1Expected = eloCalculator.expectedScore(player1OldRating, player2OldRating)
                const player2Expected = eloCalculator.expectedScore(player2OldRating, player1OldRating)

                let player1Actual = 0.5
                if (newWinnerId === match.player1_id) {
                  player1Actual = 1.0
                } else if (newWinnerId === match.player2_id) {
                  player1Actual = 0.0
                }

                const player2Actual = 1.0 - player1Actual

                const scoreDiff = Math.abs(player1_score - player2_score)
                const multiplier = eloCalculator.marginOfVictoryMultiplier(
                  scoreDiff,
                  newWinnerId === match.player1_id ? player1OldRating : player2OldRating,
                  newWinnerId === match.player1_id ? player2OldRating : player1OldRating
                )

                const kFactor = 32
                const player1Change = Math.round(kFactor * multiplier * (player1Actual - player1Expected))
                const player2Change = Math.round(kFactor * multiplier * (player2Actual - player2Expected))

                const player1NewRating = player1OldRating + player1Change
                const player2NewRating = player2OldRating + player2Change

                // Update ratings
                tx.run(
                  db.prepare(`
                    UPDATE player_ratings
                    SET rating = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE player_id = ? AND league_id = ?
                  `),
                  player1NewRating,
                  match.player1_id,
                  match.league_id
                )

                tx.run(
                  db.prepare(`
                    UPDATE player_ratings
                    SET rating = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE player_id = ? AND league_id = ?
                  `),
                  player2NewRating,
                  match.player2_id,
                  match.league_id
                )

                // Update rating update records
                const update1 = originalUpdates.find((u: any) => u.player_id === match.player1_id)
                if (update1) {
                  tx.run(
                    db.prepare(`
                      UPDATE rating_updates
                      SET old_rating = ?, new_rating = ?, change = ?
                      WHERE id = ?
                    `),
                    player1OldRating,
                    player1NewRating,
                    player1Change,
                    update1.id
                  )
                }

                const update2 = originalUpdates.find((u: any) => u.player_id === match.player2_id)
                if (update2) {
                  tx.run(
                    db.prepare(`
                      UPDATE rating_updates
                      SET old_rating = ?, new_rating = ?, change = ?
                      WHERE id = ?
                    `),
                    player2OldRating,
                    player2NewRating,
                    player2Change,
                    update2.id
                  )
                }
              }
            }
          }
        })

        // Log admin action
        const actionId = crypto.randomUUID()
        db.prepare(`
          INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(
          actionId,
          user.id,
          'update_match_scores',
          matchId,
          JSON.stringify({ 
            match_id: matchId,
            old_scores: { player1: match.player1_score, player2: match.player2_score },
            new_scores: { player1: player1_score, player2: player2_score },
            reason: reason || 'Manual admin correction'
          })
        )

        return NextResponse.json({ 
          success: true,
          message: `Match scores updated from ${match.player1_score}-${match.player2_score} to ${player1_score}-${player2_score}`
        })
      } catch (error: any) {
        console.error('Error updating match scores:', error)
        try {
          restoreBackup(backup)
        } catch (restoreError) {
          console.error('Error restoring backup:', restoreError)
        }
        throw error
      }
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

    // Delete match (cascade will handle related records)
    db.prepare('DELETE FROM matches WHERE id = ?').run(matchId)

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      'delete_match',
      matchId,
      JSON.stringify({ match_id: matchId })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    )
  }
})
