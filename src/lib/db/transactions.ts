import { db } from './index'
import { v4 as uuidv4 } from 'uuid'

/**
 * Transaction wrapper for database operations
 * Ensures all operations succeed or all are rolled back
 */
export class DatabaseTransaction {
  private savepointId: string
  private committed: boolean = false
  private rolledBack: boolean = false

  constructor() {
    this.savepointId = `sp_${uuidv4().replace(/-/g, '_')}`
    // Create savepoint
    db.exec(`SAVEPOINT ${this.savepointId}`)
  }

  /**
   * Execute a prepared statement within the transaction
   */
  run(statement: any, ...params: any[]): any {
    if (this.committed || this.rolledBack) {
      throw new Error('Transaction already committed or rolled back')
    }
    return statement.run(...params)
  }

  /**
   * Get a single row within the transaction
   */
  get(statement: any, ...params: any[]): any {
    if (this.committed || this.rolledBack) {
      throw new Error('Transaction already committed or rolled back')
    }
    return statement.get(...params)
  }

  /**
   * Get multiple rows within the transaction
   */
  all(statement: any, ...params: any[]): any[] {
    if (this.committed || this.rolledBack) {
      throw new Error('Transaction already committed or rolled back')
    }
    return statement.all(...params)
  }

  /**
   * Execute raw SQL within the transaction
   */
  exec(sql: string): void {
    if (this.committed || this.rolledBack) {
      throw new Error('Transaction already committed or rolled back')
    }
    db.exec(sql)
  }

  /**
   * Commit the transaction
   */
  commit(): void {
    if (this.committed) {
      throw new Error('Transaction already committed')
    }
    if (this.rolledBack) {
      throw new Error('Transaction already rolled back')
    }
    db.exec(`RELEASE SAVEPOINT ${this.savepointId}`)
    this.committed = true
  }

  /**
   * Rollback the transaction
   */
  rollback(): void {
    if (this.committed) {
      throw new Error('Transaction already committed')
    }
    if (this.rolledBack) {
      return // Already rolled back
    }
    db.exec(`ROLLBACK TO SAVEPOINT ${this.savepointId}`)
    db.exec(`RELEASE SAVEPOINT ${this.savepointId}`)
    this.rolledBack = true
  }

  /**
   * Execute a function within a transaction with automatic rollback on error
   * Supports both synchronous and asynchronous callbacks
   */
  static execute<T>(
    callback: (tx: DatabaseTransaction) => T
  ): T {
    const tx = new DatabaseTransaction()
    try {
      const result = callback(tx)
      // If result is a Promise, handle it asynchronously
      if (result instanceof Promise) {
        return result.then(
          (res) => {
            tx.commit()
            return res
          },
          (error) => {
            tx.rollback()
            throw error
          }
        ) as T
      }
      // Synchronous result
      tx.commit()
      return result
    } catch (error) {
      tx.rollback()
      throw error
    }
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

export function createBackup(ids: {
  matchIds?: string[]
  playerIds?: string[]
  challengeIds?: string[]
}): BackupData {
  const backup: BackupData = {}

  if (ids.matchIds && ids.matchIds.length > 0) {
    const placeholders = ids.matchIds.map(() => '?').join(',')
    backup.matches = db
      .prepare(`SELECT * FROM matches WHERE id IN (${placeholders})`)
      .all(...ids.matchIds) as any[]

    backup.ratingUpdates = db
      .prepare(`SELECT * FROM rating_updates WHERE match_id IN (${placeholders})`)
      .all(...ids.matchIds) as any[]
  }

  if (ids.playerIds && ids.playerIds.length > 0) {
    const placeholders = ids.playerIds.map(() => '?').join(',')
    backup.playerRatings = db
      .prepare(`SELECT * FROM player_ratings WHERE player_id IN (${placeholders})`)
      .all(...ids.playerIds) as any[]
  }

  if (ids.challengeIds && ids.challengeIds.length > 0) {
    const placeholders = ids.challengeIds.map(() => '?').join(',')
    backup.challenges = db
      .prepare(`SELECT * FROM challenges WHERE id IN (${placeholders})`)
      .all(...ids.challengeIds) as any[]
  }

  return backup
}

/**
 * Restore data from backup
 * Uses transaction to ensure atomic restore
 */
export function restoreBackup(backup: BackupData): void {
  return DatabaseTransaction.execute((tx) => {
    // Restore matches
    if (backup.matches) {
      backup.matches.forEach((match) => {
        // Delete existing match if it exists
        tx.run(db.prepare('DELETE FROM matches WHERE id = ?'), match.id)
        // Restore match
        tx.run(
          db.prepare(`
            INSERT INTO matches (
              id, challenge_id, player1_id, player2_id, league_id,
              player1_score, player2_score, status, winner_id, 
              played_at, confirmed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `),
          match.id,
          match.challenge_id,
          match.player1_id,
          match.player2_id,
          match.league_id,
          match.player1_score,
          match.player2_score,
          match.status,
          match.winner_id,
          match.played_at,
          match.confirmed_at
        )
      })
    }

    // Restore player ratings
    if (backup.playerRatings) {
      backup.playerRatings.forEach((rating) => {
        tx.run(
          db.prepare(`
            UPDATE player_ratings
            SET rating = ?, games_played = ?, wins = ?, losses = ?, draws = ?, updated_at = ?
            WHERE player_id = ? AND league_id = ?
          `),
          rating.rating,
          rating.games_played,
          rating.wins,
          rating.losses,
          rating.draws,
          rating.updated_at,
          rating.player_id,
          rating.league_id
        )
      })
    }

    // Restore rating updates
    if (backup.ratingUpdates) {
      backup.ratingUpdates.forEach((update) => {
        tx.run(
          db.prepare(`
            INSERT OR REPLACE INTO rating_updates (
              id, match_id, player_id, league_id, old_rating, new_rating, change, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `),
          update.id,
          update.match_id,
          update.player_id,
          update.league_id,
          update.old_rating,
          update.new_rating,
          update.change,
          update.created_at
        )
      })
    }

    // Restore challenges
    if (backup.challenges) {
      backup.challenges.forEach((challenge) => {
        tx.run(
          db.prepare(`
            UPDATE challenges
            SET status = ?, expires_at = ?
            WHERE id = ?
          `),
          challenge.status,
          challenge.expires_at,
          challenge.id
        )
      })
    }
  })
}
