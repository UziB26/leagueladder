/**
 * Unified Database Adapter
 * Supports both SQLite (local dev) and PostgreSQL (Vercel production)
 * Provides async API for both
 */

import { sql } from '@vercel/postgres'
import Database from 'better-sqlite3'
import { join } from 'path'

// Check if we should use PostgreSQL
const usePostgres = !!process.env.POSTGRES_URL

// SQLite setup (for local development)
let sqliteDb: Database.Database | null = null

if (!usePostgres) {
  const getDbPath = () => {
    if (process.env.DATABASE_PATH) {
      return process.env.DATABASE_PATH
    }
    return join(process.cwd(), 'league-ladder.db')
  }

  try {
    sqliteDb = new Database(getDbPath())
    sqliteDb.pragma('foreign_keys = ON')
  } catch (error) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      console.error('Failed to initialize SQLite:', error)
    }
  }
}

/**
 * Execute a query and return single row
 */
export async function dbGet(query: string, ...params: any[]): Promise<any> {
  if (usePostgres) {
    const pgQuery = convertToPostgres(query, params)
    const result = await sql.query(pgQuery, params)
    return result.rows[0] || undefined
  } else {
    if (!sqliteDb) throw new Error('SQLite database not initialized')
    const stmt = sqliteDb.prepare(query)
    return stmt.get(...params) || undefined
  }
}

/**
 * Execute a query and return all rows
 */
export async function dbAll(query: string, ...params: any[]): Promise<any[]> {
  if (usePostgres) {
    const pgQuery = convertToPostgres(query, params)
    const result = await sql.query(pgQuery, params)
    return result.rows
  } else {
    if (!sqliteDb) throw new Error('SQLite database not initialized')
    const stmt = sqliteDb.prepare(query)
    return stmt.all(...params) as any[]
  }
}

/**
 * Execute a query (INSERT/UPDATE/DELETE)
 */
export async function dbRun(query: string, ...params: any[]): Promise<{ changes: number }> {
  if (usePostgres) {
    const pgQuery = convertToPostgres(query, params)
    await sql.query(pgQuery, params)
    return { changes: 1 }
  } else {
    if (!sqliteDb) throw new Error('SQLite database not initialized')
    const stmt = sqliteDb.prepare(query)
    const result = stmt.run(...params)
    return { changes: result.changes }
  }
}

/**
 * Execute raw SQL (multiple statements)
 */
export async function dbExec(sqlStatements: string): Promise<void> {
  if (usePostgres) {
    // Split by semicolons and execute each
    const statements = sqlStatements.split(';').filter(s => s.trim())
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.query(statement.trim())
      }
    }
  } else {
    if (!sqliteDb) throw new Error('SQLite database not initialized')
    sqliteDb.exec(sqlStatements)
  }
}

/**
 * Convert SQLite query to PostgreSQL
 */
function convertToPostgres(query: string, params: any[]): string {
  let pgQuery = query
  let paramIndex = 1

  // Replace ? with $1, $2, etc.
  pgQuery = pgQuery.replace(/\?/g, () => `$${paramIndex++}`)

  // Convert INSERT OR IGNORE to INSERT ... ON CONFLICT
  if (pgQuery.includes('INSERT OR IGNORE INTO')) {
    // Extract table name and columns
    const match = pgQuery.match(/INSERT OR IGNORE INTO\s+(\w+)\s*\(([^)]+)\)/i)
    if (match) {
      const tableName = match[1]
      const columns = match[2].split(',').map(c => c.trim())
      // Find unique constraint columns (simplified - assumes first column is usually unique)
      const uniqueCol = columns[0]
      pgQuery = pgQuery.replace(
        /INSERT OR IGNORE INTO/gi,
        `INSERT INTO`
      )
      // Add ON CONFLICT clause before VALUES
      pgQuery = pgQuery.replace(
        /VALUES\s*\(/i,
        `ON CONFLICT (${uniqueCol}) DO NOTHING VALUES (`
      )
    }
  }

  return pgQuery
}

/**
 * Get database instance (for compatibility with existing code)
 */
export function getDbInstance() {
  if (usePostgres) {
    // Return a proxy that mimics SQLite API but uses async methods
    return {
      prepare: (query: string) => ({
        get: async (...params: any[]) => dbGet(query, ...params),
        all: async (...params: any[]) => dbAll(query, ...params),
        run: async (...params: any[]) => dbRun(query, ...params),
      }),
      exec: async (sql: string) => dbExec(sql),
      pragma: (setting: string) => {
        // No-op for PostgreSQL
      }
    }
  } else {
    return sqliteDb
  }
}

export { sqliteDb }
