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

// During build time (Amplify/Vercel), ensure DATABASE_URL is set even if dummy
// This prevents Prisma from detecting "client" engine type
if ((process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true') && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 
    process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
}

import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// CRITICAL: For AWS Amplify, NEVER use Accelerate URLs (they require "client" engine type)
// Only check for Accelerate URLs on Vercel
const isAwsAmplify = process.env.AWS_AMPLIFY === 'true' || process.env.AWS_EXECUTION_ENV !== undefined
const isVercel = process.env.VERCEL === '1'

let accelerateUrl: string | undefined
if (!isAwsAmplify && isVercel) {
  // Only check for Accelerate URLs on Vercel, not AWS
  accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
    ? process.env.PRISMA_DATABASE_URL
    : undefined
}

// Create Prisma Client without Accelerate to avoid build-time type issues
function createPrismaClient() {
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  // Ensure we're using binary engine (not client/accelerate)
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

  const clientConfig: any = {
    log: logLevels,
  }
  
  // CRITICAL: Only use accelerateUrl on Vercel with real Accelerate URLs
  // AWS RDS NEVER uses Accelerate - it's a direct PostgreSQL connection
  // Setting accelerateUrl on AWS will cause Prisma to detect "client" engine type
  if (!isAwsAmplify && accelerateUrl && accelerateUrl.startsWith('prisma+')) {
    // Only set accelerateUrl for Vercel with real Accelerate URLs
    clientConfig.accelerateUrl = accelerateUrl
  }
  // For AWS Amplify: NEVER set accelerateUrl, always use direct connection

  // CRITICAL: NEVER set engineType in the constructor
  // The engine type is determined by:
  // 1. PRISMA_CLIENT_ENGINE_TYPE environment variable (set to 'binary' above)
  // 2. schema.prisma generator config (engineType = "binary")
  // Setting engineType: 'client' here would require adapter/accelerateUrl and cause errors
  // Do NOT add: engineType: 'client' or engineType: 'binary' here

  return new PrismaClient(clientConfig)
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
