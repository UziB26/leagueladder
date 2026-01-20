import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import { z } from "zod"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"

export const runtime = 'nodejs' // Required for Prisma on Vercel

const updateStatsSchema = z.object({
  wins: z.number().int().min(0).optional(),
  losses: z.number().int().min(0).optional(),
  draws: z.number().int().min(0).optional(),
  games_played: z.number().int().min(0).optional(),
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
      const validationResult = updateStatsSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: "Invalid request data", details: validationResult.error.issues },
          { status: 400 }
        )
      }

      const { wins, losses, draws, games_played, reason } = validationResult.data

      // At least one stat must be provided
      if (wins === undefined && losses === undefined && draws === undefined && games_played === undefined) {
        return NextResponse.json({ error: "At least one stat must be provided" }, { status: 400 })
      }

      // Verify player and league exist
      const [player, league, currentStats] = await Promise.all([
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

      if (!currentStats) {
        return NextResponse.json({ error: "Player stats not found for this league" }, { status: 404 })
      }

      // Build update data
      const updateData: {
        wins?: number
        losses?: number
        draws?: number
        gamesPlayed?: number
        updatedAt?: Date
      } = {
        updatedAt: new Date()
      }

      if (wins !== undefined) updateData.wins = wins
      if (losses !== undefined) updateData.losses = losses
      if (draws !== undefined) updateData.draws = draws
      if (games_played !== undefined) updateData.gamesPlayed = games_played

      // Update stats using Prisma
      await db.playerRating.update({
        where: {
          playerId_leagueId: {
            playerId: sanitizedPlayerId,
            leagueId: sanitizedLeagueId
          }
        },
        data: updateData
      })

      // Log admin action
      await db.adminAction.create({
        data: {
          userId: user.id,
          action: 'adjust_stats',
          targetId: sanitizedPlayerId,
          details: JSON.stringify({ 
            player_id: sanitizedPlayerId,
            league_id: sanitizedLeagueId,
            old_stats: {
              wins: currentStats.wins,
              losses: currentStats.losses,
              draws: currentStats.draws,
              games_played: currentStats.gamesPlayed
            },
            new_stats: {
              wins: wins !== undefined ? wins : currentStats.wins,
              losses: losses !== undefined ? losses : currentStats.losses,
              draws: draws !== undefined ? draws : currentStats.draws,
              games_played: games_played !== undefined ? games_played : currentStats.gamesPlayed
            },
            reason: reason || 'Manual admin adjustment'
          })
        }
      })

      const changes: string[] = []
      if (wins !== undefined && wins !== currentStats.wins) {
        changes.push(`wins: ${currentStats.wins} → ${wins}`)
      }
      if (losses !== undefined && losses !== currentStats.losses) {
        changes.push(`losses: ${currentStats.losses} → ${losses}`)
      }
      if (draws !== undefined && draws !== currentStats.draws) {
        changes.push(`draws: ${currentStats.draws} → ${draws}`)
      }
      if (games_played !== undefined && games_played !== currentStats.gamesPlayed) {
        changes.push(`games_played: ${currentStats.gamesPlayed} → ${games_played}`)
      }

      return NextResponse.json({ 
        success: true,
        message: `Stats updated: ${changes.join(', ')}`
      })
    } catch (error: any) {
      console.error('Error adjusting stats:', error)
      return NextResponse.json(
        { error: error.message || "Failed to adjust stats" },
        { status: 500 }
      )
    }
  },
  {
    validationSchema: undefined, // We handle validation manually
  }
)
