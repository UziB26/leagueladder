/**
 * Prisma Client Database Access
 * Exports PrismaClient as 'db' for compatibility with existing code
 * 
 * Prisma 7: Connection URL must be passed to PrismaClient constructor
 * instead of being in schema.prisma
 * 
 * Includes Prisma Accelerate for improved performance and query caching
 */

import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Force Prisma to use the binary/query-engine (avoid accelerate/dataproxy expectations)
// This MUST be set before importing PrismaClient
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Get database URL from environment variables (Prisma 7 requirement)
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback
const accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
  ? process.env.PRISMA_DATABASE_URL
  : undefined

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

// Create Prisma Client (without Accelerate to avoid type issues in build)
function createPrismaClient() {
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  // During build time, if no database URL is available, set a dummy URL in environment
  // Prisma Client reads from environment variables (DATABASE_URL), not constructor
  if (!databaseUrl && (process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true')) {
    // Build time: set dummy URL in environment for Prisma Client
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  }
  
  // Ensure we're using binary engine (not client/accelerate)
  // This prevents the "requires adapter or accelerateUrl" error
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  const clientConfig: any = {
    log: logLevels,
  }
  
  // Only use accelerateUrl if explicitly provided (and it's a real Accelerate URL)
  // For AWS RDS, we use direct connection, not Accelerate
  if (accelerateUrl && accelerateUrl.startsWith('prisma+')) {
    clientConfig.accelerateUrl = accelerateUrl
  }
  
  // Prisma Client reads DATABASE_URL from environment automatically
  // We don't need to pass it via constructor
  return new PrismaClient(clientConfig)
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