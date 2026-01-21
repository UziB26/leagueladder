/**
 * Prisma Client Singleton
 * Provides type-safe database access
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
  
  // Always extend with Accelerate for improved performance
  return client.$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
