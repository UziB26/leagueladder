/**
 * Prisma Client Singleton
 * Provides type-safe database access
 */

// CRITICAL: Import setup FIRST to ensure environment variables are set
// This must be the very first import
import './setup'

// Force Prisma to use the binary/query-engine (avoid accelerate/dataproxy expectations)
// This MUST be set before importing PrismaClient
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// CRITICAL: Always ensure DATABASE_URL is set BEFORE importing PrismaClient
// Prisma detects "client" engine type if DATABASE_URL is missing
// This must be set BEFORE the import statement below
if (!process.env.DATABASE_URL) {
  const fallbackUrl = process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  process.env.DATABASE_URL = fallbackUrl
}

// Re-assert binary engine type one final time before import
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
  ? process.env.PRISMA_DATABASE_URL
  : undefined

// Create Prisma Client without Accelerate to avoid build-time type issues
function createPrismaClient() {
  // CRITICAL: Ensure DATABASE_URL is set before PrismaClient instantiation
  // Prisma will detect "client" engine type if DATABASE_URL is missing
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  }
  
  // Ensure we're using binary engine (not client/accelerate)
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  const clientConfig: any = {
    log: logLevels,
  }
  
  // Only use accelerateUrl if explicitly provided (and it's a real Accelerate URL)
  // For AWS RDS, we use direct connection, not Accelerate
  if (accelerateUrl && accelerateUrl.startsWith('prisma+')) {
    clientConfig.accelerateUrl = accelerateUrl
  }

  // CRITICAL: NEVER set engineType in the constructor
  // The engine type is determined by:
  // 1. PRISMA_CLIENT_ENGINE_TYPE environment variable (set to 'binary' above)
  // 2. schema.prisma generator config (engineType = "binary")
  // Setting engineType: 'client' here would require adapter/accelerateUrl and cause errors
  // Do NOT add: engineType: 'client' or engineType: 'binary' here
  
  // Final verification before instantiation
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set before PrismaClient instantiation to prevent client engine detection')
  }
  
  if (process.env.PRISMA_CLIENT_ENGINE_TYPE !== 'binary') {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  }

  return new PrismaClient(clientConfig)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
