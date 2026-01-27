/**
 * Prisma Client Database Access
 * Exports PrismaClient as 'db' for compatibility with existing code
 * 
 * Prisma 7: Connection URL must be passed to PrismaClient constructor
 * instead of being in schema.prisma
 * 
 * IMPORTANT: Force binary engine type BEFORE importing PrismaClient
 * This prevents Accelerate detection which requires accelerateUrl
 */

// CRITICAL: Import environment setup FIRST - before ANY other imports
// This must be the very first import to ensure env vars are set before Prisma reads them
import './setup'
// CRITICAL: Import Prisma-specific env setup before importing PrismaClient
// Prisma reads environment variables at import time, not instantiation time
import './prisma-env'

// Force Prisma to use the binary/query-engine (avoid accelerate/dataproxy expectations)
// This MUST be set before importing PrismaClient
// Set it multiple times to ensure it's set before any module evaluation
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// During build time (Amplify/Vercel), ensure DATABASE_URL is set even if dummy
// This prevents Prisma from detecting "client" engine type
// CRITICAL: Detect AWS Amplify environment
if (!process.env.AWS_AMPLIFY && (process.env.AWS_EXECUTION_ENV || process.env.AWS_REGION)) {
  process.env.AWS_AMPLIFY = 'true'
}

const isBuildTime = process.env.VERCEL === '1' || 
                    process.env.AWS_AMPLIFY === 'true' || 
                    process.env.AWS_EXECUTION_ENV !== undefined ||
                    process.env.CI === 'true'

if (isBuildTime && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 
    process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
}

// CRITICAL: Re-assert binary engine type right before importing PrismaClient
// This is the absolute last chance before Prisma reads the environment
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// CRITICAL for Amplify: Ensure DATABASE_URL is ALWAYS set before PrismaClient import
// Prisma detects "client" engine type if DATABASE_URL is missing or undefined
// This must be set BEFORE the import statement below
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL && !process.env.POSTGRES_URL && !process.env.POSTGRES_PRISMA_URL) {
  // Set a dummy URL to prevent Prisma from detecting "client" engine type
  // This is safe because Prisma won't actually connect during build
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  console.log('[Prisma Debug] Set dummy DATABASE_URL before PrismaClient import to prevent client engine detection')
}

// Re-assert binary engine type one final time
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

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

// DEBUG: Log environment variables during module load
console.log('[Prisma Debug] Module load - Environment check:')
console.log('[Prisma Debug]   NODE_ENV:', process.env.NODE_ENV)
console.log('[Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE:', process.env.PRISMA_CLIENT_ENGINE_TYPE)
console.log('[Prisma Debug]   VERCEL:', process.env.VERCEL)
console.log('[Prisma Debug]   AWS_AMPLIFY:', process.env.AWS_AMPLIFY)
console.log('[Prisma Debug]   AWS_EXECUTION_ENV:', process.env.AWS_EXECUTION_ENV)
console.log('[Prisma Debug]   CI:', process.env.CI)
console.log('[Prisma Debug]   NEXT_PHASE:', process.env.NEXT_PHASE)
console.log('[Prisma Debug]   DATABASE_URL present:', !!process.env.DATABASE_URL)
console.log('[Prisma Debug]   PRISMA_DATABASE_URL present:', !!process.env.PRISMA_DATABASE_URL)
console.log('[Prisma Debug]   POSTGRES_PRISMA_URL present:', !!process.env.POSTGRES_PRISMA_URL)
console.log('[Prisma Debug]   POSTGRES_URL present:', !!process.env.POSTGRES_URL)
console.log('[Prisma Debug]   databaseUrl resolved:', databaseUrl ? `${databaseUrl.substring(0, 20)}...` : 'undefined')
console.log('[Prisma Debug]   accelerateUrl:', accelerateUrl ? `${accelerateUrl.substring(0, 20)}...` : 'undefined')

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
  console.log('[Prisma Debug] createPrismaClient() called')
  
  // CRITICAL: Set environment variables AGAIN right before PrismaClient instantiation
  // This is the last chance to ensure they're set before Prisma reads them
  if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  }
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  console.log('[Prisma Debug]   PRISMA_CLIENT_ENGINE_TYPE set to:', process.env.PRISMA_CLIENT_ENGINE_TYPE)
  
  // CRITICAL: Ensure DATABASE_URL is ALWAYS set before PrismaClient instantiation
  // Prisma will detect "client" engine type if DATABASE_URL is missing
  // This must happen BEFORE new PrismaClient() is called
  const isBuildContext = process.env.AWS_AMPLIFY === 'true' || process.env.AWS_EXECUTION_ENV || process.env.VERCEL === '1' || process.env.CI === 'true'
  console.log('[Prisma Debug]   isBuildContext:', isBuildContext)
  console.log('[Prisma Debug]   DATABASE_URL before check:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : 'undefined')
  
  // ALWAYS ensure DATABASE_URL is set - this is critical to prevent "client" engine detection
  if (!process.env.DATABASE_URL) {
    const fallbackUrl = process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    process.env.DATABASE_URL = fallbackUrl
    console.log('[Prisma Debug]   Set DATABASE_URL to fallback (CRITICAL for binary engine):', fallbackUrl.substring(0, 30) + '...')
  }
  
  // Double-check: If DATABASE_URL is still not set, force it
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    console.log('[Prisma Debug]   FORCED DATABASE_URL to prevent client engine detection')
  }
  
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  // Ensure we're using binary engine (not client/accelerate)
  // This prevents the "requires adapter or accelerateUrl" error
  // Set it again here to be absolutely sure
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  // During build time, if no database URL is available, set a dummy URL in environment
  // Prisma Client reads from environment variables (DATABASE_URL), not constructor
  // This is critical to prevent Prisma from detecting "client" engine type
  const finalDatabaseUrl = databaseUrl || 
    process.env.DATABASE_URL || 
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  
  if (!process.env.DATABASE_URL && (process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true')) {
    // Build time: set dummy URL in environment for Prisma Client
    process.env.DATABASE_URL = finalDatabaseUrl
  }
  
  const clientConfig: any = {
    log: logLevels,
  }
  
  console.log('[Prisma Debug]   logLevels:', logLevels)
  console.log('[Prisma Debug]   accelerateUrl check:', accelerateUrl ? `${accelerateUrl.substring(0, 30)}...` : 'undefined')
  
  // Only use accelerateUrl if explicitly provided (and it's a real Accelerate URL)
  // For AWS RDS, we use direct connection, not Accelerate
  // IMPORTANT: Do NOT set accelerateUrl unless it's a real Prisma Accelerate URL
  // Setting it incorrectly will cause the "requires adapter or accelerateUrl" error
  if (accelerateUrl && accelerateUrl.startsWith('prisma+')) {
    clientConfig.accelerateUrl = accelerateUrl
    console.log('[Prisma Debug]   Added accelerateUrl to clientConfig')
  } else {
    console.log('[Prisma Debug]   No accelerateUrl added (using binary engine)')
  }
  
  console.log('[Prisma Debug]   clientConfig:', JSON.stringify(clientConfig, null, 2))
  console.log('[Prisma Debug]   Final DATABASE_URL in env:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : 'undefined')
  
  // CRITICAL: NEVER set engineType in the constructor
  // The engine type is determined by:
  // 1. PRISMA_CLIENT_ENGINE_TYPE environment variable (set to 'binary' above)
  // 2. schema.prisma generator config (engineType = "binary")
  // Setting engineType: 'client' here would require adapter/accelerateUrl and cause errors
  // Do NOT add: engineType: 'client' or engineType: 'binary' here
  
  // CRITICAL: Verify DATABASE_URL is set one final time before instantiation
  // Prisma will throw "requires adapter or accelerateUrl" if it detects "client" engine
  // This happens when DATABASE_URL is missing or undefined
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    console.log('[Prisma Debug]   LAST CHANCE: Set DATABASE_URL before PrismaClient()')
  }
  
  // Verify PRISMA_CLIENT_ENGINE_TYPE is still set
  if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== 'binary') {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
    console.log('[Prisma Debug]   LAST CHANCE: Re-set PRISMA_CLIENT_ENGINE_TYPE to binary')
  }
  
  // Prisma Client reads DATABASE_URL from environment automatically
  // We don't need to pass it via constructor
  console.log('[Prisma Debug]   Instantiating PrismaClient...')
  console.log('[Prisma Debug]   Final check - DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING')
  console.log('[Prisma Debug]   Final check - PRISMA_CLIENT_ENGINE_TYPE:', process.env.PRISMA_CLIENT_ENGINE_TYPE)
  
  const client = new PrismaClient(clientConfig)
  console.log('[Prisma Debug]   PrismaClient instantiated successfully')
  return client
}

// Create singleton instance (reused in development, new in production)
// CRITICAL: Ensure environment variables are set one final time before instantiation
// This is especially important for AWS Amplify builds during page data collection
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// Ensure DATABASE_URL is set before PrismaClient instantiation (for build-time)
if (!process.env.DATABASE_URL && (process.env.AWS_AMPLIFY === 'true' || process.env.AWS_EXECUTION_ENV || process.env.VERCEL === '1')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 
    process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
}

// Guard Prisma initialization - prevent running without DATABASE_URL in production runtime
// This makes failures explicit instead of cryptic
// Only check at runtime, not during build (isBuildTime is defined earlier in the file)
// During build, we allow dummy DATABASE_URL to prevent Prisma initialization errors
if (!isBuildTime && process.env.NODE_ENV === 'production') {
  const hasDatabaseUrl = process.env.DATABASE_URL || 
                        process.env.POSTGRES_URL || 
                        process.env.POSTGRES_PRISMA_URL || 
                        process.env.PRISMA_DATABASE_URL
  
  // Check if DATABASE_URL is a real URL (not the dummy one)
  const isRealDatabaseUrl = hasDatabaseUrl && 
                           !hasDatabaseUrl.includes('dummy:dummy@localhost') &&
                           !hasDatabaseUrl.includes('postgresql://dummy')
  
  if (!isRealDatabaseUrl) {
    throw new Error('DATABASE_URL not configured')
  }
}

console.log('[Prisma Debug] Creating Prisma singleton instance...')
console.log('[Prisma Debug]   globalForPrisma.prisma exists:', !!globalForPrisma.prisma)
const prisma = globalForPrisma.prisma ?? createPrismaClient()
console.log('[Prisma Debug]   Prisma instance created/reused')

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  console.log('[Prisma Debug]   Cached Prisma instance in global (development)')
}

// Export as 'db' for compatibility with existing code
export const db = prisma

// Also export as 'prisma' for direct access
export { prisma }

// Export database utilities (Note: These use SQLite syntax and may not work with Prisma)
// TODO: Migrate these to use Prisma instead of raw SQL
export { DatabaseTransaction, createBackup, restoreBackup } from './transactions'
export { validateMatchData, validateChallengeData, validatePlayerLeagueMembership } from './validation'