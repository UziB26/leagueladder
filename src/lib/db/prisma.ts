/**
 * Prisma Client Singleton
 * Provides type-safe database access
 */

import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

// Force Prisma to use the binary/query-engine locally (avoid accelerate/dataproxy expectations)
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
  ? process.env.PRISMA_DATABASE_URL
  : undefined

// Create Prisma Client without Accelerate to avoid build-time type issues
function createPrismaClient() {
  const logLevels: Prisma.LogLevel[] =
    process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']

  return new PrismaClient({
    log: logLevels,
    ...(accelerateUrl ? { accelerateUrl } : {}),
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
