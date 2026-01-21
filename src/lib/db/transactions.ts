import { db } from './index'

/**
 * Transaction wrapper for database operations using Prisma
 * Ensures all operations succeed or all are rolled back
 * 
 * Note: Prisma transactions use $transaction() which automatically
 * handles commit/rollback. This class provides a compatible interface.
 */
export class DatabaseTransaction {
  /**
   * Execute a function within a transaction with automatic rollback on error
   * The callback receives a transaction client that behaves like the main db client
   * 
   * @param callback - Function to execute within transaction
   * @returns Result of callback function (always a Promise for Prisma)
   */
  static execute<T>(
    callback: (tx: Parameters<Parameters<typeof db.$transaction>[0]>[0]) => T | Promise<T>
  ): Promise<T> {
    // Prisma $transaction automatically handles commit/rollback
    return db.$transaction(async (tx) => {
      const result = callback(tx)
      // If callback returns a Promise, await it
      if (result instanceof Promise) {
        return await result
      }
      return result
    })
  }
}

/**
 * Create a backup of critical data before operations
 */
export interface BackupData {
  matches?: any[]
  playerRatings?: any[]
  ratingUpdates?: any[]
  challenges?: any[]
}

export async function createBackup(ids: {
  matchIds?: string[]
  playerIds?: string[]
  challengeIds?: string[]
}): Promise<BackupData> {
  const backup: BackupData = {}

  if (ids.matchIds && ids.matchIds.length > 0) {
    backup.matches = await db.match.findMany({
      where: { id: { in: ids.matchIds } },
    }) as any[]

    backup.ratingUpdates = await db.ratingUpdate.findMany({
      where: { matchId: { in: ids.matchIds } },
    }) as any[]
  }

  if (ids.playerIds && ids.playerIds.length > 0) {
    backup.playerRatings = await db.playerRating.findMany({
      where: { playerId: { in: ids.playerIds } },
    }) as any[]
  }

  if (ids.challengeIds && ids.challengeIds.length > 0) {
    backup.challenges = await db.challenge.findMany({
      where: { id: { in: ids.challengeIds } },
    }) as any[]
  }

  return backup
}

/**
 * Restore data from backup
 * Uses transaction to ensure atomic restore
 */
export async function restoreBackup(backup: BackupData): Promise<void> {
  await db.$transaction(async (tx) => {
    // Restore matches
    if (backup.matches) {
      for (const match of backup.matches) {
        // Delete existing match if it exists
        await tx.match.deleteMany({ where: { id: match.id } })
        // Restore match
        await tx.match.create({
          data: {
            id: match.id,
            challengeId: match.challenge_id || null,
            player1Id: match.player1_id,
            player2Id: match.player2_id,
            leagueId: match.league_id,
            player1Score: match.player1_score,
            player2Score: match.player2_score,
            status: match.status,
            winnerId: match.winner_id || null,
            reportedBy: match.reported_by || null,
            playedAt: match.played_at ? new Date(match.played_at) : new Date(),
            confirmedAt: match.confirmed_at ? new Date(match.confirmed_at) : null,
          },
        })
      }
    }

    // Restore player ratings
    if (backup.playerRatings) {
      for (const rating of backup.playerRatings) {
        await tx.playerRating.upsert({
          where: {
            playerId_leagueId: {
              playerId: rating.player_id,
              leagueId: rating.league_id,
            },
          },
          update: {
            rating: rating.rating,
            gamesPlayed: rating.games_played,
            wins: rating.wins,
            losses: rating.losses,
            draws: rating.draws,
          },
          create: {
            id: rating.id,
            playerId: rating.player_id,
            leagueId: rating.league_id,
            rating: rating.rating,
            gamesPlayed: rating.games_played,
            wins: rating.wins,
            losses: rating.losses,
            draws: rating.draws,
          },
        })
      }
    }

    // Restore rating updates
    if (backup.ratingUpdates) {
      for (const update of backup.ratingUpdates) {
        await tx.ratingUpdate.upsert({
          where: { id: update.id },
          update: {
            matchId: update.match_id,
            playerId: update.player_id,
            leagueId: update.league_id,
            oldRating: update.old_rating,
            newRating: update.new_rating,
            change: update.change,
            createdAt: update.created_at ? new Date(update.created_at) : new Date(),
          },
          create: {
            id: update.id,
            matchId: update.match_id,
            playerId: update.player_id,
            leagueId: update.league_id,
            oldRating: update.old_rating,
            newRating: update.new_rating,
            change: update.change,
            createdAt: update.created_at ? new Date(update.created_at) : new Date(),
          },
        })
      }
    }

    // Restore challenges
    if (backup.challenges) {
      for (const challenge of backup.challenges) {
        await tx.challenge.update({
          where: { id: challenge.id },
          data: {
            status: challenge.status,
            expiresAt: challenge.expires_at ? new Date(challenge.expires_at) : null,
          },
        })
      }
    }
  })
}
