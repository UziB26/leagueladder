/**
 * PostgreSQL Database Helper
 * Direct async operations using @vercel/postgres
 */

import { sql } from '@vercel/postgres'

/**
 * Execute a SELECT query and return single row
 */
export async function pgGet(query: string, ...params: any[]): Promise<any> {
  const pgQuery = convertToPostgres(query, params)
  try {
    const result = await sql.query(pgQuery, params)
    return result.rows[0] || undefined
  } catch (error) {
    console.error('PostgreSQL get error:', error)
    throw error
  }
}

/**
 * Execute a SELECT query and return all rows
 */
export async function pgAll(query: string, ...params: any[]): Promise<any[]> {
  const pgQuery = convertToPostgres(query, params)
  try {
    const result = await sql.query(pgQuery, params)
    return result.rows
  } catch (error) {
    console.error('PostgreSQL all error:', error)
    throw error
  }
}

/**
 * Execute INSERT/UPDATE/DELETE query
 */
export async function pgRun(query: string, ...params: any[]): Promise<{ changes: number }> {
  const pgQuery = convertToPostgres(query, params)
  try {
    await sql.query(pgQuery, params)
    return { changes: 1 }
  } catch (error) {
    console.error('PostgreSQL run error:', error)
    throw error
  }
}

/**
 * Convert SQLite query syntax to PostgreSQL
 */
function convertToPostgres(query: string, params: any[]): string {
  let pgQuery = query
  let paramIndex = 1

  // Replace ? with $1, $2, etc.
  pgQuery = pgQuery.replace(/\?/g, () => `$${paramIndex++}`)

  // Handle INSERT OR IGNORE
  if (pgQuery.includes('INSERT OR IGNORE INTO')) {
    const match = pgQuery.match(/INSERT OR IGNORE INTO\s+(\w+)\s*\(([^)]+)\)/i)
    if (match) {
      const firstCol = match[2].split(',')[0].trim()
      pgQuery = pgQuery.replace(/INSERT OR IGNORE INTO/gi, 'INSERT INTO')
      // Add ON CONFLICT - try to detect the unique column
      // For most tables, the first column is the primary key
      pgQuery = pgQuery.replace(
        /VALUES\s*\(/i,
        `ON CONFLICT (${firstCol}) DO NOTHING VALUES (`
      )
    }
  }

  return pgQuery
}

/**
 * Check if PostgreSQL is available
 */
export function isPostgresAvailable(): boolean {
  return !!process.env.POSTGRES_URL
}

/**
 * Execute a transaction with automatic rollback on error
 * Usage:
 * await pgTransaction(async (tx) => {
 *   await tx.run('INSERT INTO ...', ...params)
 *   const result = await tx.get('SELECT ...', ...params)
 * })
 */
export async function pgTransaction<T>(
  callback: (tx: {
    get: (query: string, ...params: any[]) => Promise<any>
    all: (query: string, ...params: any[]) => Promise<any[]>
    run: (query: string, ...params: any[]) => Promise<{ changes: number }>
  }) => Promise<T>
): Promise<T> {
  const { sql } = await import('@vercel/postgres')
  
  try {
    // Begin transaction
    await sql.query('BEGIN')
    
    // Create transaction object with helper methods
    const tx = {
      get: async (query: string, ...params: any[]): Promise<any> => {
        const pgQuery = convertToPostgres(query, params)
        const result = await sql.query(pgQuery, params)
        return result.rows[0] || undefined
      },
      all: async (query: string, ...params: any[]): Promise<any[]> => {
        const pgQuery = convertToPostgres(query, params)
        const result = await sql.query(pgQuery, params)
        return result.rows
      },
      run: async (query: string, ...params: any[]): Promise<{ changes: number }> => {
        const pgQuery = convertToPostgres(query, params)
        const result = await sql.query(pgQuery, params)
        // PostgreSQL returns rowCount for UPDATE/INSERT/DELETE
        return { changes: result.rowCount || 0 }
      }
    }
    
    // Execute callback
    const result = await callback(tx)
    
    // Commit transaction
    await sql.query('COMMIT')
    
    return result
  } catch (error) {
    // Rollback on error
    try {
      await sql.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError)
    }
    throw error
  }
}
