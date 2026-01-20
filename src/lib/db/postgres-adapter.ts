/**
 * PostgreSQL Database Adapter
 * Provides async database operations using Vercel Postgres
 */

import { sql } from '@vercel/postgres'

export interface DbResult {
  changes?: number
  lastInsertRowid?: string
}

/**
 * Database adapter that mimics SQLite's prepare().get() API but async
 */
export class PostgresAdapter {
  /**
   * Prepare a query (returns an object with get, all, run methods)
   */
  prepare(query: string) {
    return {
      get: async (...params: any[]): Promise<any> => {
        const pgQuery = this.convertQuery(query, params)
        try {
          const result = await sql.query(pgQuery, params)
          return result.rows[0] || undefined
        } catch (error) {
          console.error('PostgreSQL get error:', error, 'Query:', pgQuery, 'Params:', params)
          throw error
        }
      },

      all: async (...params: any[]): Promise<any[]> => {
        const pgQuery = this.convertQuery(query, params)
        try {
          const result = await sql.query(pgQuery, params)
          return result.rows
        } catch (error) {
          console.error('PostgreSQL all error:', error, 'Query:', pgQuery, 'Params:', params)
          throw error
        }
      },

      run: async (...params: any[]): Promise<DbResult> => {
        const pgQuery = this.convertQuery(query, params)
        try {
          await sql.query(pgQuery, params)
          return { changes: 1 }
        } catch (error) {
          console.error('PostgreSQL run error:', error, 'Query:', pgQuery, 'Params:', params)
          throw error
        }
      }
    }
  }

  /**
   * Execute raw SQL (for CREATE TABLE, etc.)
   */
  async exec(sqlStatements: string): Promise<void> {
    // Split by semicolons and execute each statement
    const statements = sqlStatements
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    for (const statement of statements) {
      try {
        // Convert SQLite syntax to PostgreSQL
        const pgStatement = this.convertSchemaStatement(statement)
        await sql.query(pgStatement)
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error?.message?.includes('already exists') || 
            error?.code === '42P07' || // relation already exists
            error?.code === '42710') { // duplicate object
          console.log('Table/column already exists, skipping:', statement.substring(0, 50))
          continue
        }
        console.error('PostgreSQL exec error:', error, 'Statement:', statement.substring(0, 100))
        throw error
      }
    }
  }

  /**
   * Pragma (no-op for PostgreSQL, foreign keys are enabled by default)
   */
  pragma(setting: string): void {
    // PostgreSQL doesn't use PRAGMA
    // Foreign keys are enforced by default
  }

  /**
   * Convert SQLite query to PostgreSQL
   */
  private convertQuery(query: string, params: any[]): string {
    let pgQuery = query
    let paramIndex = 1

    // Replace ? with $1, $2, etc.
    pgQuery = pgQuery.replace(/\?/g, () => `$${paramIndex++}`)

    // Handle INSERT OR IGNORE
    if (pgQuery.includes('INSERT OR IGNORE INTO')) {
      // Extract table and first column (usually the unique one)
      const match = pgQuery.match(/INSERT OR IGNORE INTO\s+(\w+)\s*\(([^)]+)\)/i)
      if (match) {
        const tableName = match[1]
        const firstCol = match[2].split(',')[0].trim()
        pgQuery = pgQuery.replace(/INSERT OR IGNORE INTO/gi, 'INSERT INTO')
        // Add ON CONFLICT before VALUES
        pgQuery = pgQuery.replace(
          /VALUES\s*\(/i,
          `ON CONFLICT (${firstCol}) DO NOTHING VALUES (`
        )
      }
    }

    return pgQuery
  }

  /**
   * Convert SQLite schema statements to PostgreSQL
   */
  private convertSchemaStatement(statement: string): string {
    let pgStatement = statement

    // Convert DATETIME to TIMESTAMP
    pgStatement = pgStatement.replace(/DATETIME/gi, 'TIMESTAMP')

    // Convert CREATE TABLE IF NOT EXISTS (PostgreSQL supports this)
    // No change needed

    // Handle ALTER TABLE ADD COLUMN IF NOT EXISTS
    if (pgStatement.includes('ALTER TABLE') && pgStatement.includes('ADD COLUMN')) {
      // PostgreSQL doesn't support IF NOT EXISTS in ALTER TABLE
      // We'll handle this with DO blocks in the schema file
      // For now, just convert the statement
    }

    return pgStatement
  }
}

// Create singleton instance
let _adapter: PostgresAdapter | null = null

export function getPostgresAdapter(): PostgresAdapter {
  if (!_adapter) {
    _adapter = new PostgresAdapter()
  }
  return _adapter
}

// Export as default for easy import
export default getPostgresAdapter()
