/**
 * Prisma Client Database Access
 * Exports PrismaClient as 'db' for compatibility with existing code
 * 
 * Prisma 7: Connection URL must be passed to PrismaClient constructor
 * instead of being in schema.prisma
 * 
 * Includes Prisma Accelerate for improved performance and query caching
 */

import { PrismaClient } from 'app/generated-prisma-client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Get database URL from environment variables (Prisma 7 requirement)
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback

// Warn if no database URL is configured
if (!databaseUrl) {
  console.error('')
  console.error('⚠️  WARNING: Database URL not configured!')
  console.error('⚠️  Please set one of these environment variables in .env.local:')
  console.error('   - DATABASE_URL (recommended for local development)')
  console.error('   - PRISMA_DATABASE_URL (for Vercel Postgres)')
  console.error('   - POSTGRES_URL (alternative)')
  console.error('')
  console.error('   Example for local PostgreSQL:')
  console.error('   DATABASE_URL="postgresql://user:password@localhost:5432/league_ladder"')
  console.error('')
}

// Create Prisma Client with Accelerate extension
function createPrismaClient() {
  const clientOptions: {
    log: ('query' | 'error' | 'warn')[]
    datasourceUrl?: string
  } = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }
  
  // Prisma 7: Pass connection URL directly (URL removed from schema.prisma)
  if (databaseUrl) {
    clientOptions.datasourceUrl = databaseUrl
  }
  
  const client = new PrismaClient(clientOptions)
  
  // Only extend with Accelerate if database URL is available
  // Accelerate requires a valid connection URL
  if (databaseUrl) {
    return client.$extends(withAccelerate())
  }
  
  // Return client without Accelerate if no URL is configured
  // This allows the app to start even without a database (for static pages)
  return client
}

// Create singleton instance (reused in development, new in production)
const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export as 'db' for compatibility with existing code
export const db = prisma

// Also export as 'prisma' for direct access
export { prisma }

// Export database utilities (Note: These use SQLite syntax and may not work with Prisma)
// TODO: Migrate these to use Prisma instead of raw SQL
export { DatabaseTransaction, createBackup, restoreBackup } from './transactions'
export { validateMatchData, validateChallengeData, validatePlayerLeagueMembership } from './validation'