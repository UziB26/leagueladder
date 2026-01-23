/**
 * Database Cleanup Script
 * 
 * This script will delete all user data, players, challenges, matches, and ratings
 * while preserving the league structure.
 * 
 * Usage:
 *   npm run db:cleanup
 * 
 * Or directly:
 *   npx ts-node --compiler-options {"module":"commonjs"} scripts/cleanup-database.ts
 */

// Load environment variables before importing PrismaClient
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files (Prisma CLI should do this, but ensure it's loaded)
dotenv.config({ path: resolve(process.cwd(), '.env') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'

// Force Prisma to use the binary/query-engine locally (avoid accelerate/dataproxy expectations)
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Get database URL from environment
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback

const accelerateUrl = process.env.PRISMA_DATABASE_URL?.startsWith('prisma+')
  ? process.env.PRISMA_DATABASE_URL
  : undefined

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Make sure .env.local file exists with one of these set:')
  console.error('   - DATABASE_URL')
  console.error('   - PRISMA_DATABASE_URL')
  console.error('   - POSTGRES_PRISMA_URL')
  console.error('   - POSTGRES_URL')
  process.exit(1)
}

// Create PrismaClient with same pattern as main db file
const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  ...(accelerateUrl ? { accelerateUrl } : {}),
})

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n')

  try {
    const results: Record<string, { deleted: number; status: string }> = {}

    // 1. Delete Rating Updates
    console.log('Deleting rating updates...')
    try {
      const ratingUpdates = await db.ratingUpdate.deleteMany({})
      results.rating_updates = {
        deleted: ratingUpdates.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${ratingUpdates.count} rating updates`)
    } catch (error: any) {
      results.rating_updates = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 2. Delete Match Confirmations
    console.log('Deleting match confirmations...')
    try {
      const matchConfirmations = await db.matchConfirmation.deleteMany({})
      results.match_confirmations = {
        deleted: matchConfirmations.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${matchConfirmations.count} match confirmations`)
    } catch (error: any) {
      results.match_confirmations = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 3. Delete Matches
    console.log('Deleting matches...')
    try {
      const matches = await db.match.deleteMany({})
      results.matches = {
        deleted: matches.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${matches.count} matches`)
    } catch (error: any) {
      results.matches = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 4. Delete Challenges
    console.log('Deleting challenges...')
    try {
      const challenges = await db.challenge.deleteMany({})
      results.challenges = {
        deleted: challenges.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${challenges.count} challenges`)
    } catch (error: any) {
      results.challenges = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 5. Delete Player Ratings
    console.log('Deleting player ratings...')
    try {
      const playerRatings = await db.playerRating.deleteMany({})
      results.player_ratings = {
        deleted: playerRatings.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${playerRatings.count} player ratings`)
    } catch (error: any) {
      results.player_ratings = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 6. Delete League Memberships
    console.log('Deleting league memberships...')
    try {
      const leagueMemberships = await db.leagueMembership.deleteMany({})
      results.league_memberships = {
        deleted: leagueMemberships.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${leagueMemberships.count} league memberships`)
    } catch (error: any) {
      results.league_memberships = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 7. Delete Players
    console.log('Deleting players...')
    try {
      const players = await db.player.deleteMany({})
      results.players = {
        deleted: players.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${players.count} players`)
    } catch (error: any) {
      results.players = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 8. Delete Admin Actions
    console.log('Deleting admin actions...')
    try {
      const adminActions = await db.adminAction.deleteMany({})
      results.admin_actions = {
        deleted: adminActions.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${adminActions.count} admin actions`)
    } catch (error: any) {
      results.admin_actions = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 9. Delete Sessions
    console.log('Deleting sessions...')
    try {
      const sessions = await db.session.deleteMany({})
      results.sessions = {
        deleted: sessions.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${sessions.count} sessions`)
    } catch (error: any) {
      results.sessions = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 10. Delete Accounts
    console.log('Deleting accounts...')
    try {
      const accounts = await db.account.deleteMany({})
      results.accounts = {
        deleted: accounts.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${accounts.count} accounts`)
    } catch (error: any) {
      results.accounts = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // 11. Delete Users
    console.log('Deleting users...')
    try {
      const users = await db.user.deleteMany({})
      results.users = {
        deleted: users.count,
        status: 'success'
      }
      console.log(`  ✅ Deleted ${users.count} users`)
    } catch (error: any) {
      results.users = {
        deleted: 0,
        status: `error: ${error.message}`
      }
      console.log(`  ❌ Error: ${error.message}`)
    }

    // Verify leagues are still there
    const remainingLeagues = await db.league.findMany({
      select: { id: true, name: true, gameType: true }
    })

    const totalDeleted = Object.values(results).reduce((sum, r) => sum + r.deleted, 0)

    console.log('\n' + '='.repeat(50))
    console.log('✅ Database cleanup completed!')
    console.log('='.repeat(50))
    console.log(`Total records deleted: ${totalDeleted}`)
    console.log(`Leagues preserved: ${remainingLeagues.length}`)
    console.log('\nPreserved leagues:')
    remainingLeagues.forEach(league => {
      console.log(`  - ${league.name} (${league.gameType})`)
    })
    console.log('\n⚠️  Note: You will need to recreate your admin account.')
    console.log('='.repeat(50))

    // Close database connection
    await db.$disconnect()

  } catch (error: any) {
    console.error('\n❌ Error during database cleanup:', error)
    await db.$disconnect()
    process.exit(1)
  }
}

// Run the cleanup
cleanupDatabase()
