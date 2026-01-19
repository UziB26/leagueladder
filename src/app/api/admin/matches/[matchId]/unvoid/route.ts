import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db, DatabaseTransaction, createBackup, restoreBackup } from "@/lib/db"
import { EloCalculator } from "@/lib/elo"
import crypto from "crypto"

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

    // Get the match
    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(matchId) as any
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.status !== 'voided') {
      return NextResponse.json({ error: "Match is not voided" }, { status: 400 })
    }

    // Create backup before un-voiding
    const backup = createBackup({
      matchIds: [matchId],
      playerIds: [match.player1_id, match.player2_id],
    })

    // Use transaction to un-void match and restore ratings
    try {
      DatabaseTransaction.execute((tx) => {
        // Get the rating updates that were deleted when match was voided
        // We need to restore them - check if there are any rating_updates records
        // If not, we'll need to recalculate based on the match result
        
        // First, check if we can find the original rating updates
        // Since voiding deletes rating_updates, we need to recalculate
        
        // Get current ratings for both players
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

        if (!player1Rating || !player2Rating) {
          throw new Error('Player ratings not found')
        }

        // Determine winner
        let winnerId: string | null = null
        if (match.player1_score > match.player2_score) {
          winnerId = match.player1_id
        } else if (match.player2_score > match.player1_score) {
          winnerId = match.player2_id
        }

        // Recalculate Elo ratings
        const eloCalculator = new EloCalculator()
        const player1OldRating = player1Rating.rating
        const player2OldRating = player2Rating.rating

        const player1Expected = eloCalculator.expectedScore(player1OldRating, player2OldRating)
        const player2Expected = eloCalculator.expectedScore(player2OldRating, player1OldRating)

        let player1Actual = 0.5 // Draw
        if (winnerId === match.player1_id) {
          player1Actual = 1.0
        } else if (winnerId === match.player2_id) {
          player1Actual = 0.0
        }

        const player2Actual = 1.0 - player1Actual

        // Calculate margin of victory multiplier
        const scoreDiff = Math.abs(match.player1_score - match.player2_score)
        const multiplier = eloCalculator.marginOfVictoryMultiplier(
          scoreDiff,
          winnerId === match.player1_id ? player1OldRating : player2OldRating,
          winnerId === match.player1_id ? player2OldRating : player1OldRating
        )

        // Calculate rating changes
        const kFactor = 32
        const player1Change = Math.round(
          kFactor * multiplier * (player1Actual - player1Expected)
        )
        const player2Change = Math.round(
          kFactor * multiplier * (player2Actual - player2Expected)
        )

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

        // Create rating update records
        const update1Id = crypto.randomUUID()
        tx.run(
          db.prepare(`
            INSERT INTO rating_updates (
              id, match_id, player_id, league_id, old_rating, new_rating, change, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `),
          update1Id,
          matchId,
          match.player1_id,
          match.league_id,
          player1OldRating,
          player1NewRating,
          player1Change
        )

        const update2Id = crypto.randomUUID()
        tx.run(
          db.prepare(`
            INSERT INTO rating_updates (
              id, match_id, player_id, league_id, old_rating, new_rating, change, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `),
          update2Id,
          matchId,
          match.player2_id,
          match.league_id,
          player2OldRating,
          player2NewRating,
          player2Change
        )

        // Update match status to completed
        tx.run(
          db.prepare(`
            UPDATE matches
            SET status = 'completed'
            WHERE id = ?
          `),
          matchId
        )

        // If match had a challenge, restore challenge status
        if (match.challenge_id) {
          const challenge = tx.get(
            db.prepare('SELECT * FROM challenges WHERE id = ?'),
            match.challenge_id
          ) as any
          
          if (challenge && challenge.status !== 'completed') {
            tx.run(
              db.prepare(`
                UPDATE challenges
                SET status = 'completed'
                WHERE id = ?
              `),
              match.challenge_id
            )
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
        'unvoid_match',
        matchId,
        JSON.stringify({ 
          match_id: matchId,
          player1_id: match.player1_id,
          player2_id: match.player2_id
        })
      )

      return NextResponse.json({ 
        success: true,
        message: "Match un-voided successfully. Ratings have been restored."
      })
    } catch (error: any) {
      // Rollback using backup if transaction fails
      console.error('Error un-voiding match:', error)
      try {
        restoreBackup(backup)
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error un-voiding match:', error)
    return NextResponse.json(
      { error: error.message || "Failed to un-void match" },
      { status: 500 }
    )
  }
})
