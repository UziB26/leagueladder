import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db, DatabaseTransaction, createBackup, restoreBackup } from "@/lib/db"
import { z } from "zod"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"
import crypto from "crypto"

const updateRatingSchema = z.object({
  rating: z.number().int().min(0).max(5000, "Rating must be between 0 and 5000"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason is too long").optional(),
})

export const PUT = apiHandlers.admin(
  async (
    request: NextRequest & { session?: any; validatedData?: any },
    context?: { params?: Promise<{ playerId: string; leagueId: string }> }
  ) => {
    try {
      const { playerId, leagueId } = await (context?.params || Promise.resolve({ playerId: '', leagueId: '' }))
      const user = request.session?.user as { id?: string }
      
      if (!user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const sanitizedPlayerId = sanitizeUUID(playerId)
      const sanitizedLeagueId = sanitizeString(leagueId)
      
      if (!sanitizedPlayerId || !sanitizedLeagueId) {
        return NextResponse.json({ error: "Invalid player ID or league ID" }, { status: 400 })
      }

      // Validate request body
      const body = await request.json()
      const validationResult = updateRatingSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: "Invalid request data", details: validationResult.error.issues },
          { status: 400 }
        )
      }

      const { rating, reason } = validationResult.data

      // Verify player exists
      const player = db.prepare('SELECT * FROM players WHERE id = ?').get(sanitizedPlayerId) as any
      if (!player) {
        return NextResponse.json({ error: "Player not found" }, { status: 404 })
      }

      // Verify league exists
      const league = db.prepare('SELECT * FROM leagues WHERE id = ?').get(sanitizedLeagueId) as any
      if (!league) {
        return NextResponse.json({ error: "League not found" }, { status: 404 })
      }

      // Get current rating
      const currentRating = db.prepare(`
        SELECT * FROM player_ratings 
        WHERE player_id = ? AND league_id = ?
      `).get(sanitizedPlayerId, sanitizedLeagueId) as any

      if (!currentRating) {
        return NextResponse.json({ error: "Player rating not found for this league" }, { status: 404 })
      }

      const oldRating = currentRating.rating
      const ratingChange = rating - oldRating

      // Create backup
      const backup = createBackup({
        playerIds: [sanitizedPlayerId],
      })

      // Update rating using transaction
      try {
        DatabaseTransaction.execute((tx) => {
          // Update rating
          tx.run(
            db.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `),
            rating,
            sanitizedPlayerId,
            sanitizedLeagueId
          )

          // Log rating update (using a special match_id to indicate manual admin adjustment)
          const updateId = crypto.randomUUID()
          tx.run(
            db.prepare(`
              INSERT INTO rating_updates (
                id, match_id, player_id, league_id, old_rating, new_rating, change, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `),
            updateId,
            `admin_adjustment_${crypto.randomUUID()}`,
            sanitizedPlayerId,
            sanitizedLeagueId,
            oldRating,
            rating,
            ratingChange
          )
        })

        // Log admin action
        const actionId = crypto.randomUUID()
        db.prepare(`
          INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(
          actionId,
          user.id,
          'adjust_rating',
          sanitizedPlayerId,
          JSON.stringify({ 
            player_id: sanitizedPlayerId,
            league_id: sanitizedLeagueId,
            old_rating: oldRating,
            new_rating: rating,
            change: ratingChange,
            reason: reason || 'Manual admin adjustment'
          })
        )

        return NextResponse.json({ 
          success: true,
          message: `Rating updated from ${oldRating} to ${rating} (change: ${ratingChange > 0 ? '+' : ''}${ratingChange})`
        })
      } catch (error: any) {
        // Rollback using backup if transaction fails
        console.error('Error adjusting rating:', error)
        try {
          restoreBackup(backup)
        } catch (restoreError) {
          console.error('Error restoring backup:', restoreError)
        }
        throw error
      }
    } catch (error: any) {
      console.error('Error adjusting rating:', error)
      return NextResponse.json(
        { error: error.message || "Failed to adjust rating" },
        { status: 500 }
      )
    }
  },
  {
    validationSchema: undefined, // We handle validation manually
  }
)
