/**
 * Prisma Seed Script
 * Initializes the database with default leagues
 * Run with: npx prisma db seed
 */

// Load environment variables before importing PrismaClient
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files (Prisma CLI should do this, but ensure it's loaded)
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

// Force Prisma to use the binary/query-engine locally (avoid accelerate/dataproxy expectations)
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { PrismaClient } from '@prisma/client'

// Get database URL from environment
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback

const accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
  ? process.env.PRISMA_DATABASE_URL
  : undefined

// DEBUG: Log environment variables during seed script
console.log('[Seed Debug] Environment check:')
console.log('[Seed Debug]   NODE_ENV:', process.env.NODE_ENV)
console.log('[Seed Debug]   PRISMA_CLIENT_ENGINE_TYPE:', process.env.PRISMA_CLIENT_ENGINE_TYPE)
console.log('[Seed Debug]   DATABASE_URL present:', !!process.env.DATABASE_URL)
console.log('[Seed Debug]   PRISMA_DATABASE_URL present:', !!process.env.PRISMA_DATABASE_URL)
console.log('[Seed Debug]   POSTGRES_PRISMA_URL present:', !!process.env.POSTGRES_PRISMA_URL)
console.log('[Seed Debug]   POSTGRES_URL present:', !!process.env.POSTGRES_URL)
console.log('[Seed Debug]   databaseUrl resolved:', databaseUrl ? `${databaseUrl.substring(0, 30)}...` : 'undefined')
console.log('[Seed Debug]   accelerateUrl:', accelerateUrl ? `${accelerateUrl.substring(0, 30)}...` : 'undefined')

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Make sure .env file exists with DATABASE_URL set')
  process.exit(1)
}

// Create PrismaClient with same pattern as main db file
console.log('[Seed Debug] Creating PrismaClient...')
const clientConfig: any = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  ...(accelerateUrl ? { accelerateUrl } : {}),
}
console.log('[Seed Debug]   clientConfig:', JSON.stringify(clientConfig, null, 2))
const prisma = new PrismaClient(clientConfig)
console.log('[Seed Debug]   PrismaClient instantiated successfully')

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed initial leagues
  const leagues = [
    {
      id: 'tt_league',
      name: 'Table Tennis',
      gameType: 'table-tennis'
    },
    {
      id: 'fifa_league',
      name: 'Fifa',
      gameType: 'fifa'
    }
  ]

  for (const league of leagues) {
    const result = await prisma.league.upsert({
      where: { id: league.id },
      update: {},
      create: league
    })
    console.log(`✅ League "${result.name}" ready`)
  }

  console.log('✅ Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
