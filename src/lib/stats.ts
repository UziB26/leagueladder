import { db } from './db'
import crypto from 'crypto'

/**
 * Updates player statistics after a match result
 * @param playerId - The player's ID
 * @param leagueId - The league ID
 * @param result - 'win', 'loss', or 'draw'
 */
export async function updatePlayerStats(
  playerId: string,
  leagueId: string,
  result: 'win' | 'loss' | 'draw'
) {
  // Get current rating record
  const rating = await db.playerRating.findUnique({
    where: {
      playerId_leagueId: {
        playerId,
        leagueId,
      },
    },
    select: {
      id: true,
      gamesPlayed: true,
      wins: true,
      losses: true,
      draws: true,
    },
  })

  if (!rating) {
    throw new Error(`Player rating not found for player ${playerId} in league ${leagueId}`)
  }

  // Update stats based on result
  const updates: { gamesPlayed: number; wins: number; losses: number; draws: number } = {
    gamesPlayed: rating.gamesPlayed + 1,
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
  await db.playerRating.update({
    where: {
      playerId_leagueId: {
        playerId,
        leagueId,
      },
    },
    data: {
      gamesPlayed: updates.gamesPlayed,
      wins: updates.wins,
      losses: updates.losses,
      draws: updates.draws,
    },
  })

  return {
    games_played: updates.gamesPlayed,
    wins: updates.wins,
    losses: updates.losses,
    draws: updates.draws,
  }
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
export async function recordMatchResult(
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
  const player1Stats = await updatePlayerStats(player1Id, leagueId, player1Result)
  const player2Stats = await updatePlayerStats(player2Id, leagueId, player2Result)

  // Update ratings
  await db.playerRating.update({
    where: {
      playerId_leagueId: {
        playerId: player1Id,
        leagueId,
      },
    },
    data: {
      rating: newPlayer1Rating,
    },
  })

  await db.playerRating.update({
    where: {
      playerId_leagueId: {
        playerId: player2Id,
        leagueId,
      },
    },
    data: {
      rating: newPlayer2Rating,
    },
  })

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
