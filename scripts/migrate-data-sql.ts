/**
 * Data Migration Script using Raw SQL
 * 
 * This script migrates data from Vercel Postgres to AWS RDS using raw SQL queries.
 * More reliable than Prisma Client for dual-database operations.
 * 
 * Usage:
 *   # Step 1: Set both connection strings
 *   $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"
 *   $env:AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"
 *   
 *   # Step 2: Run migration
 *   npm run migrate:data
 */

import * as pg from 'pg'
const { Client } = pg

async function migrateData() {
  console.log('🔄 Starting data migration from Vercel Postgres to AWS RDS...\n')

  // Get connection strings
  const vercelUrl = process.env.VERCEL_DATABASE_URL
  const awsUrl = process.env.AWS_DATABASE_URL

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

  // Create database connections
  const vercelClient = new Client({ connectionString: vercelUrl })
  const awsClient = new Client({ connectionString: awsUrl })

  try {
    // Connect to both databases
    console.log('🔌 Connecting to databases...')
    await vercelClient.connect()
    console.log('   ✅ Connected to Vercel Postgres')
    await awsClient.connect()
    console.log('   ✅ Connected to AWS RDS\n')

    // Tables to migrate (in order due to foreign keys)
    const tables = [
      'leagues',
      'users',
      'players',
      'league_memberships',
      'challenges',
      'matches',
      'match_confirmations',
      'player_ratings',
      'rating_updates',
      'accounts',
      'sessions',
      'admin_actions'
    ]

    for (const table of tables) {
      console.log(`📥 Migrating ${table}...`)
      
      // Read all data from Vercel
      const result = await vercelClient.query(`SELECT * FROM ${table}`)
      const rows = result.rows
      
      if (rows.length === 0) {
        console.log(`   ⏭️  No data in ${table}`)
        continue
      }

      console.log(`   📊 Found ${rows.length} rows`)

      // Get column names
      const columns = Object.keys(rows[0])
      const columnList = columns.join(', ')
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      
      // Build INSERT query with ON CONFLICT DO NOTHING
      const insertQuery = `
        INSERT INTO ${table} (${columnList})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING
      `

      // Insert data in batches of 100
      const batchSize = 100
      let inserted = 0
      
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize)
        
        for (const row of batch) {
          const values = columns.map(col => row[col])
          try {
            await awsClient.query(insertQuery, values)
            inserted++
          } catch (error: any) {
            // Skip duplicate key errors (already exists)
            if (error.code === '23505') {
              // Unique constraint violation - record already exists
              continue
            }
            throw error
          }
        }
      }

      console.log(`   ✅ Imported ${inserted} rows\n`)
    }

    console.log('='.repeat(50))
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
    await vercelClient.end()
    await awsClient.end()
  }
}

// Run the migration
migrateData().catch((error) => {
  console.error(error)
  process.exit(1)
})
