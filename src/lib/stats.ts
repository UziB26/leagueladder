import { db } from './db'
import crypto from 'crypto'

/**
 * Updates player statistics after a match result
 * @param playerId - The player's ID
 * @param leagueId - The league ID
 * @param result - 'win', 'loss', or 'draw'
 */
export function updatePlayerStats(
  playerId: string,
  leagueId: string,
  result: 'win' | 'loss' | 'draw'
) {
  // Get current rating record
  const rating = db.prepare(`
    SELECT * FROM player_ratings 
    WHERE player_id = ? AND league_id = ?
  `).get(playerId, leagueId) as {
    id: string
    games_played: number
    wins: number
    losses: number
    draws: number
  } | undefined

  if (!rating) {
    throw new Error(`Player rating not found for player ${playerId} in league ${leagueId}`)
  }

  // Update stats based on result
  const updates: { [key: string]: number } = {
    games_played: rating.games_played + 1,
    wins: rating.wins,
    losses: rating.losses,
    draws: rating.draws,
  }

  if (result === 'win') {
    updates.wins = rating.wins + 1
  } else if (result === 'loss') {
    updates.losses = rating.losses + 1
  } else {
    updates.draws = rating.draws + 1
  }

  // Update the rating record
  db.prepare(`
    UPDATE player_ratings 
    SET 
      games_played = ?,
      wins = ?,
      losses = ?,
      draws = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND league_id = ?
  `).run(
    updates.games_played,
    updates.wins,
    updates.losses,
    updates.draws,
    playerId,
    leagueId
  )

  return updates
}

/**
 * Updates ratings and stats for both players after a match
 * @param player1Id - First player's ID
 * @param player2Id - Second player's ID
 * @param leagueId - The league ID
 * @param player1Score - First player's score
 * @param player2Score - Second player's score
 * @param newPlayer1Rating - New rating for player 1 (after Elo calculation)
 * @param newPlayer2Rating - New rating for player 2 (after Elo calculation)
 */
export function recordMatchResult(
  player1Id: string,
  player2Id: string,
  leagueId: string,
  player1Score: number,
  player2Score: number,
  newPlayer1Rating: number,
  newPlayer2Rating: number
) {
  // Determine results
  let player1Result: 'win' | 'loss' | 'draw'
  let player2Result: 'win' | 'loss' | 'draw'

  if (player1Score > player2Score) {
    player1Result = 'win'
    player2Result = 'loss'
  } else if (player1Score < player2Score) {
    player1Result = 'loss'
    player2Result = 'win'
  } else {
    player1Result = 'draw'
    player2Result = 'draw'
  }

  // Update stats for both players
  const player1Stats = updatePlayerStats(player1Id, leagueId, player1Result)
  const player2Stats = updatePlayerStats(player2Id, leagueId, player2Result)

  // Update ratings
  db.prepare(`
    UPDATE player_ratings 
    SET rating = ?, updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND league_id = ?
  `).run(newPlayer1Rating, player1Id, leagueId)

  db.prepare(`
    UPDATE player_ratings 
    SET rating = ?, updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND league_id = ?
  `).run(newPlayer2Rating, player2Id, leagueId)

  return {
    player1: {
      ...player1Stats,
      newRating: newPlayer1Rating,
    },
    player2: {
      ...player2Stats,
      newRating: newPlayer2Rating,
    },
  }
}
