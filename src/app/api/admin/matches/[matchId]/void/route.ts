import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db, DatabaseTransaction, createBackup, restoreBackup } from "@/lib/db"
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

    if (match.status === 'voided') {
      return NextResponse.json({ error: "Match is already voided" }, { status: 400 })
    }

    // Create backup before voiding
    const backup = createBackup({
      matchIds: [matchId],
      playerIds: [match.player1_id, match.player2_id],
    })

    // Use transaction to void match and revert ratings
    try {
      DatabaseTransaction.execute((tx) => {
        // If match was completed, revert Elo ratings
        if (match.status === 'completed') {
          // Get the most recent rating updates for this match
          const updates = tx.all(
            db.prepare(`
              SELECT player_id, league_id, old_rating
              FROM rating_updates
              WHERE match_id = ?
              ORDER BY created_at DESC
              LIMIT 2
            `),
            matchId
          ) as any[]
          
          if (updates.length === 2) {
            // Revert ratings to old values
            const revertRating = db.prepare(`
              UPDATE player_ratings
              SET rating = ?, updated_at = CURRENT_TIMESTAMP
              WHERE player_id = ? AND league_id = ?
            `)
            updates.forEach((update) => {
              tx.run(revertRating, update.old_rating, update.player_id, update.league_id)
            })
            
            // Delete rating update records
            const deleteUpdates = db.prepare(`
              DELETE FROM rating_updates WHERE match_id = ?
            `)
            tx.run(deleteUpdates, matchId)
          }
        }

        // Update match status to voided
        const updateMatch = db.prepare(`
          UPDATE matches
          SET status = 'voided'
          WHERE id = ?
        `)
        tx.run(updateMatch, matchId)

        // If match had a challenge, revert challenge status if needed
        if (match.challenge_id) {
          const challenge = tx.get(
            db.prepare('SELECT * FROM challenges WHERE id = ?'),
            match.challenge_id
          ) as any
          
          if (challenge && challenge.status === 'completed') {
            // Revert challenge to accepted status
            const updateChallenge = db.prepare(`
              UPDATE challenges
              SET status = 'accepted'
              WHERE id = ?
            `)
            tx.run(updateChallenge, match.challenge_id)
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
        'void_match',
        matchId,
        JSON.stringify({ 
          match_id: matchId,
          previous_status: match.status,
          player1_id: match.player1_id,
          player2_id: match.player2_id
        })
      )

      return NextResponse.json({ 
        success: true,
        message: "Match voided successfully. Ratings have been reverted."
      })
    } catch (error: any) {
      // Rollback using backup if transaction fails
      console.error('Error voiding match:', error)
      try {
        restoreBackup(backup)
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error voiding match:', error)
    return NextResponse.json(
      { error: error.message || "Failed to void match" },
      { status: 500 }
    )
  }
})
