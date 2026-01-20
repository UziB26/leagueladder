/**
 * PostgreSQL transaction helper for match confirmation
 * This contains the logic for confirming a match and updating Elo ratings
 */

import { pgTransaction } from '@/lib/db/postgres'
import { elo } from '@/lib/elo'
import crypto from 'crypto'

export async function confirmMatchPostgres(
  matchId: string,
  playerId: string,
  match: any
) {
  console.log('=== POSTGRESQL TRANSACTION START ===')
  
  const result = await pgTransaction(async (tx) => {
    // Record confirmation
    const confirmationId = crypto.randomUUID()
    console.log('Inserting confirmation:', confirmationId)
    await tx.run(`
      INSERT INTO match_confirmations (id, match_id, player_id, action, created_at)
      VALUES ($1, $2, $3, 'confirmed', CURRENT_TIMESTAMP)
    `, confirmationId, matchId, playerId)
    console.log('Confirmation inserted')

    // Ensure player ratings exist (create if they don't)
    const ratingId1 = crypto.randomUUID()
    const ratingId2 = crypto.randomUUID()
    await tx.run(`
      INSERT INTO player_ratings (id, player_id, league_id, rating, games_played, wins, losses, draws)
      VALUES ($1, $2, $3, 1000, 0, 0, 0, 0)
      ON CONFLICT (player_id, league_id) DO NOTHING
    `, ratingId1, match.player1_id, match.league_id)
    
    await tx.run(`
      INSERT INTO player_ratings (id, player_id, league_id, rating, games_played, wins, losses, draws)
      VALUES ($1, $2, $3, 1000, 0, 0, 0, 0)
      ON CONFLICT (player_id, league_id) DO NOTHING
    `, ratingId2, match.player2_id, match.league_id)

    // Get current ratings
    console.log('Fetching current ratings...')
    const rating1 = await tx.get(`
      SELECT rating, games_played, wins, losses, draws FROM player_ratings
      WHERE player_id = $1 AND league_id = $2
    `, match.player1_id, match.league_id) as any
    
    const rating2 = await tx.get(`
      SELECT rating, games_played, wins, losses, draws FROM player_ratings
      WHERE player_id = $1 AND league_id = $2
    `, match.player2_id, match.league_id) as any

    if (!rating1 || !rating2) {
      throw new Error(`Ratings not found. Player1: ${!!rating1}, Player2: ${!!rating2}`)
    }

    console.log('Current ratings before update:', {
      player1: { id: match.player1_id, rating: rating1.rating },
      player2: { id: match.player2_id, rating: rating2.rating }
    })

    // Calculate new Elo ratings
    const eloResult = elo.calculateForMatch(
      rating1.rating,
      rating2.rating,
      match.player1_score,
      match.player2_score
    )

    console.log('Elo calculation result:', {
      player1: { old: rating1.rating, new: eloResult.newRatingA, change: eloResult.changeA },
      player2: { old: rating2.rating, new: eloResult.newRatingB, change: eloResult.changeB }
    })

    const newRating1 = Math.round(eloResult.newRatingA)
    const newRating2 = Math.round(eloResult.newRatingB)

    // Determine winner for stats update
    const isDraw = match.player1_score === match.player2_score
    const player1Won = match.player1_score > match.player2_score
    const player2Won = match.player2_score > match.player1_score

    // Update player 1 rating and stats
    await tx.run(`
      UPDATE player_ratings
      SET rating = $1, 
          games_played = games_played + 1,
          wins = wins + CASE WHEN $2 THEN 1 ELSE 0 END,
          losses = losses + CASE WHEN $3 THEN 1 ELSE 0 END,
          draws = draws + CASE WHEN $4 THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = $5 AND league_id = $6
    `, newRating1, player1Won, player2Won, isDraw ? 1 : 0, match.player1_id, match.league_id)

    // Update player 2 rating and stats
    await tx.run(`
      UPDATE player_ratings
      SET rating = $1, 
          games_played = games_played + 1,
          wins = wins + CASE WHEN $2 THEN 1 ELSE 0 END,
          losses = losses + CASE WHEN $3 THEN 1 ELSE 0 END,
          draws = draws + CASE WHEN $4 THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = $5 AND league_id = $6
    `, newRating2, player2Won, player1Won, isDraw ? 1 : 0, match.player2_id, match.league_id)

    // Record rating updates
    const updateId1 = crypto.randomUUID()
    const updateId2 = crypto.randomUUID()
    
    await tx.run(`
      INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, updateId1, matchId, match.player1_id, match.league_id, rating1.rating, newRating1, eloResult.changeA)

    await tx.run(`
      INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, updateId2, matchId, match.player2_id, match.league_id, rating2.rating, newRating2, eloResult.changeB)

    // Update match status to completed
    await tx.run(`
      UPDATE matches
      SET status = 'completed', confirmed_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, matchId)

    // Mark challenge as completed if exists
    if (match.challenge_id) {
      await tx.run(`
        UPDATE challenges
        SET status = 'completed'
        WHERE id = $1 AND status = 'accepted'
      `, match.challenge_id)
    }

    console.log('=== POSTGRESQL TRANSACTION COMPLETING ===')

    // Return final ratings for verification
    return {
      player1Rating: newRating1,
      player2Rating: newRating2,
      player1OldRating: rating1.rating,
      player2OldRating: rating2.rating
    }
  })

  console.log('=== POSTGRESQL TRANSACTION COMMITTED ===')
  
  // Verify the updates
  const { pgGet } = await import('@/lib/db/postgres')
  const verifyMatch = await pgGet('SELECT status FROM matches WHERE id = $1', matchId)
  if (verifyMatch?.status !== 'completed') {
    throw new Error('Match status was not updated to completed')
  }

  const finalRating1 = await pgGet(`
    SELECT rating FROM player_ratings
    WHERE player_id = $1 AND league_id = $2
  `, match.player1_id, match.league_id)

  const finalRating2 = await pgGet(`
    SELECT rating FROM player_ratings
    WHERE player_id = $1 AND league_id = $2
  `, match.player2_id, match.league_id)

  console.log('Final ratings after transaction:', {
    player1: finalRating1?.rating,
    player2: finalRating2?.rating
  })

  return {
    success: true,
    ratings: {
      player1: finalRating1?.rating || result.player1Rating,
      player2: finalRating2?.rating || result.player2Rating
    }
  }
}
