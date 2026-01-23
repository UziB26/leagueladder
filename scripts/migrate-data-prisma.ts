/**
 * Data Migration Script using Prisma
 * 
 * This script migrates data from Vercel Postgres to AWS RDS using Prisma.
 * No pg_dump/psql required!
 * 
 * Usage:
 *   # Step 1: Set both connection strings
 *   $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"
 *   $env:AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"
 *   
 *   # Step 2: Run migration
 *   npm run migrate:data
 */

// Load environment variables
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Force Prisma to use binary engine BEFORE importing PrismaClient
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Import PrismaClient AFTER setting engine type
import { PrismaClient } from '@prisma/client'

async function migrateData() {
  console.log('🔄 Starting data migration from Vercel Postgres to AWS RDS...\n')

  // Get connection strings
  const vercelUrl = 
    process.env.VERCEL_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  const awsUrl = process.env.AWS_DATABASE_URL;

  if (!vercelUrl) {
    console.error('❌ Error: VERCEL_DATABASE_URL not found')
    console.error('\nPlease set your Vercel Postgres connection string:')
    console.error('  $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"')
    process.exit(1)
  }

  if (!awsUrl) {
    console.error('❌ Error: AWS_DATABASE_URL not found')
    console.error('\nPlease set your AWS RDS connection string:')
    console.error('  $env:AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"')
    process.exit(1)
  }

  // Mask passwords in logs
  const maskedVercel = vercelUrl.replace(/:([^:@]+)@/, ':****@')
  const maskedAws = awsUrl.replace(/:([^:@]+)@/, ':****@')
  
  console.log(`📊 Source (Vercel): ${maskedVercel}`)
  console.log(`📊 Target (AWS RDS): ${maskedAws}\n`)

  // Create Prisma clients for both databases
  // We need to use $connect() with custom connection strings
  // Temporarily override the connection via environment variables
  
  const originalDatabaseUrl = process.env.DATABASE_URL
  const originalPostgresUrl = process.env.POSTGRES_URL
  const originalPostgresPrismaUrl = process.env.POSTGRES_PRISMA_URL
  
  // Create Vercel client - override all possible env vars
  process.env.DATABASE_URL = vercelUrl
  process.env.POSTGRES_URL = vercelUrl
  process.env.POSTGRES_PRISMA_URL = vercelUrl
  const vercelDb = new PrismaClient()

  // Create AWS client - override all possible env vars
  process.env.DATABASE_URL = awsUrl
  process.env.POSTGRES_URL = awsUrl
  process.env.POSTGRES_PRISMA_URL = awsUrl
  const awsDb = new PrismaClient()
  
  // Connect both clients
  await vercelDb.$connect()
  await awsDb.$connect()

  try {
    console.log('📥 Step 1: Reading data from Vercel Postgres...\n')

    // Read all data from Vercel (in correct order due to foreign keys)
    const leagues = await vercelDb.league.findMany()
    console.log(`   ✅ Found ${leagues.length} leagues`)

    const users = await vercelDb.user.findMany()
    console.log(`   ✅ Found ${users.length} users`)

    const players = await vercelDb.player.findMany()
    console.log(`   ✅ Found ${players.length} players`)

    const leagueMemberships = await vercelDb.leagueMembership.findMany()
    console.log(`   ✅ Found ${leagueMemberships.length} league memberships`)

    const challenges = await vercelDb.challenge.findMany()
    console.log(`   ✅ Found ${challenges.length} challenges`)

    const matches = await vercelDb.match.findMany()
    console.log(`   ✅ Found ${matches.length} matches`)

    const matchConfirmations = await vercelDb.matchConfirmation.findMany()
    console.log(`   ✅ Found ${matchConfirmations.length} match confirmations`)

    const playerRatings = await vercelDb.playerRating.findMany()
    console.log(`   ✅ Found ${playerRatings.length} player ratings`)

    const ratingUpdates = await vercelDb.ratingUpdate.findMany()
    console.log(`   ✅ Found ${ratingUpdates.length} rating updates`)

    const accounts = await vercelDb.account.findMany()
    console.log(`   ✅ Found ${accounts.length} accounts`)

    const sessions = await vercelDb.session.findMany()
    console.log(`   ✅ Found ${sessions.length} sessions`)

    const adminActions = await vercelDb.adminAction.findMany()
    console.log(`   ✅ Found ${adminActions.length} admin actions`)

    console.log('\n📤 Step 2: Writing data to AWS RDS...\n')

    // Write data to AWS RDS (in correct order due to foreign keys)
    // Note: Using createMany with skipDuplicates to handle existing data

    if (leagues.length > 0) {
      await awsDb.league.createMany({
        data: leagues,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${leagues.length} leagues`)
    }

    if (users.length > 0) {
      await awsDb.user.createMany({
        data: users,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${users.length} users`)
    }

    if (players.length > 0) {
      await awsDb.player.createMany({
        data: players,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${players.length} players`)
    }

    if (leagueMemberships.length > 0) {
      await awsDb.leagueMembership.createMany({
        data: leagueMemberships,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${leagueMemberships.length} league memberships`)
    }

    if (challenges.length > 0) {
      await awsDb.challenge.createMany({
        data: challenges,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${challenges.length} challenges`)
    }

    if (matches.length > 0) {
      await awsDb.match.createMany({
        data: matches,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${matches.length} matches`)
    }

    if (matchConfirmations.length > 0) {
      await awsDb.matchConfirmation.createMany({
        data: matchConfirmations,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${matchConfirmations.length} match confirmations`)
    }

    if (playerRatings.length > 0) {
      await awsDb.playerRating.createMany({
        data: playerRatings,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${playerRatings.length} player ratings`)
    }

    if (ratingUpdates.length > 0) {
      await awsDb.ratingUpdate.createMany({
        data: ratingUpdates,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${ratingUpdates.length} rating updates`)
    }

    if (accounts.length > 0) {
      await awsDb.account.createMany({
        data: accounts,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${accounts.length} accounts`)
    }

    if (sessions.length > 0) {
      await awsDb.session.createMany({
        data: sessions,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${sessions.length} sessions`)
    }

    if (adminActions.length > 0) {
      await awsDb.adminAction.createMany({
        data: adminActions,
        skipDuplicates: true
      })
      console.log(`   ✅ Imported ${adminActions.length} admin actions`)
    }

    console.log('\n' + '='.repeat(50))
    console.log('✅ Data migration completed successfully!')
    console.log('='.repeat(50))
    console.log('\nYour AWS RDS database now contains all data from Vercel Postgres.')
    console.log('You can now proceed with setting up AWS Amplify.')

  } catch (error: any) {
    console.error('\n❌ Error during migration:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Verify both connection strings are correct')
    console.error('2. Check that RDS security group allows connections')
    console.error('3. Ensure schema is already created on AWS RDS')
    throw error
  } finally {
    await vercelDb.$disconnect()
    await awsDb.$disconnect()
    // Restore original environment variables
    if (originalDatabaseUrl) process.env.DATABASE_URL = originalDatabaseUrl
    if (originalPostgresUrl) process.env.POSTGRES_URL = originalPostgresUrl
    if (originalPostgresPrismaUrl) process.env.POSTGRES_PRISMA_URL = originalPostgresPrismaUrl
  }
}

// Run the migration
migrateData().catch((error) => {
  console.error(error)
  process.exit(1)
})
