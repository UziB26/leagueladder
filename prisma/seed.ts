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

import { PrismaClient } from '../app/generated-prisma-client'

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Make sure .env file exists with DATABASE_URL set')
  process.exit(1)
}

// PrismaClient will use DATABASE_URL from environment automatically
const prisma = new PrismaClient()

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
