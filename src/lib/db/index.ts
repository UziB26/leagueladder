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

// Create Prisma Client with Accelerate extension
function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prisma 7: Pass connection URL directly (URL removed from schema.prisma)
    datasourceUrl: databaseUrl || undefined,
  })
  
  // Always extend with Accelerate for improved performance
  return client.$extends(withAccelerate())
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
