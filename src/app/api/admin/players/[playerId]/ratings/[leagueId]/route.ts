import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import { z } from "zod"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"

export const runtime = 'nodejs' // Required for Prisma on Vercel

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

      // Verify player, league, and current rating exist
      const [player, league, currentRating] = await Promise.all([
        db.player.findUnique({ where: { id: sanitizedPlayerId } }),
        db.league.findUnique({ where: { id: sanitizedLeagueId } }),
        db.playerRating.findUnique({
          where: {
            playerId_leagueId: {
              playerId: sanitizedPlayerId,
              leagueId: sanitizedLeagueId
            }
          }
        })
      ])

      if (!player) {
        return NextResponse.json({ error: "Player not found" }, { status: 404 })
      }

      if (!league) {
        return NextResponse.json({ error: "League not found" }, { status: 404 })
      }

      if (!currentRating) {
        return NextResponse.json({ error: "Player rating not found for this league" }, { status: 404 })
      }

      const oldRating = currentRating.rating
      const ratingChange = rating - oldRating

      // Use Prisma transaction to update rating and log the change
      await db.$transaction(async (tx) => {
        // Update rating
        await tx.playerRating.update({
          where: {
            playerId_leagueId: {
              playerId: sanitizedPlayerId,
              leagueId: sanitizedLeagueId
            }
          },
          data: {
            rating,
            updatedAt: new Date()
          }
        })

        // Create a placeholder match ID for admin adjustments (rating updates require a matchId)
        // We'll use a special prefix to identify admin adjustments
        const adminMatchId = `admin_adjustment_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // Log rating update
        await tx.ratingUpdate.create({
          data: {
            matchId: adminMatchId,
            playerId: sanitizedPlayerId,
            leagueId: sanitizedLeagueId,
            oldRating,
            newRating: rating,
            change: ratingChange
          }
        })
      })

      // Log admin action
      await db.adminAction.create({
        data: {
          userId: user.id,
          action: 'adjust_rating',
          targetId: sanitizedPlayerId,
          details: JSON.stringify({ 
            player_id: sanitizedPlayerId,
            league_id: sanitizedLeagueId,
            old_rating: oldRating,
            new_rating: rating,
            change: ratingChange,
            reason: reason || 'Manual admin adjustment'
          })
        }
      })

      return NextResponse.json({ 
        success: true,
        message: `Rating updated from ${oldRating} to ${rating} (change: ${ratingChange > 0 ? '+' : ''}${ratingChange})`
      })
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
