import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db, DatabaseTransaction, createBackup, restoreBackup } from "@/lib/db"
import { z } from "zod"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"
import crypto from "crypto"

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

      // Get current stats
      const currentStats = db.prepare(`
        SELECT * FROM player_ratings 
        WHERE player_id = ? AND league_id = ?
      `).get(sanitizedPlayerId, sanitizedLeagueId) as any

      if (!currentStats) {
        return NextResponse.json({ error: "Player stats not found for this league" }, { status: 404 })
      }

      // Create backup
      const backup = createBackup({
        playerIds: [sanitizedPlayerId],
      })

      // Update stats using transaction
      try {
        DatabaseTransaction.execute((tx) => {
          const updates: string[] = []
          const values: any[] = []

          if (wins !== undefined) {
            updates.push('wins = ?')
            values.push(wins)
          }

          if (losses !== undefined) {
            updates.push('losses = ?')
            values.push(losses)
          }

          if (draws !== undefined) {
            updates.push('draws = ?')
            values.push(draws)
          }

          if (games_played !== undefined) {
            updates.push('games_played = ?')
            values.push(games_played)
          }

          // Always update updated_at
          updates.push('updated_at = CURRENT_TIMESTAMP')

          values.push(sanitizedPlayerId, sanitizedLeagueId)

          tx.run(
            db.prepare(`
              UPDATE player_ratings
              SET ${updates.join(', ')}
              WHERE player_id = ? AND league_id = ?
            `),
            ...values
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
          'adjust_stats',
          sanitizedPlayerId,
          JSON.stringify({ 
            player_id: sanitizedPlayerId,
            league_id: sanitizedLeagueId,
            old_stats: {
              wins: currentStats.wins,
              losses: currentStats.losses,
              draws: currentStats.draws,
              games_played: currentStats.games_played
            },
            new_stats: {
              wins: wins !== undefined ? wins : currentStats.wins,
              losses: losses !== undefined ? losses : currentStats.losses,
              draws: draws !== undefined ? draws : currentStats.draws,
              games_played: games_played !== undefined ? games_played : currentStats.games_played
            },
            reason: reason || 'Manual admin adjustment'
          })
        )

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
        if (games_played !== undefined && games_played !== currentStats.games_played) {
          changes.push(`games_played: ${currentStats.games_played} → ${games_played}`)
        }

        return NextResponse.json({ 
          success: true,
          message: `Stats updated: ${changes.join(', ')}`
        })
      } catch (error: any) {
        // Rollback using backup if transaction fails
        console.error('Error adjusting stats:', error)
        try {
          restoreBackup(backup)
        } catch (restoreError) {
          console.error('Error restoring backup:', restoreError)
        }
        throw error
      }
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
