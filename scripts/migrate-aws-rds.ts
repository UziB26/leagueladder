/**
 * Prisma Migration Script for AWS RDS
 * 
 * This script runs Prisma migrations against your AWS RDS database.
 * 
 * Usage:
 *   # Set your AWS RDS connection string
 *   $env:DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"
 *   npm run migrate:aws
 * 
 * Or on Linux/Mac:
 *   export DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"
 *   npm run migrate:aws
 */

// Load environment variables
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env files (but don't override existing env vars)
// This allows DATABASE_URL set in the shell to take precedence
dotenv.config({ path: resolve(process.cwd(), '.env'), override: false })
dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: false })

// Force Prisma to use binary engine (not Accelerate) for migrations
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}

// Allow self-signed certs during local builds (Prisma fetch)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { execSync } from 'child_process'

async function runMigration() {
  console.log('🚀 Starting Prisma migration for AWS RDS...\n')

  // Get database URL from environment
  const databaseUrl = 
    process.env.DATABASE_URL ||      // Direct PostgreSQL connection
    process.env.POSTGRES_PRISMA_URL || // Alternative
    process.env.POSTGRES_URL;         // Another alternative

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL not found in environment variables')
    console.error('\nPlease set your AWS RDS connection string:')
    console.error('  Windows PowerShell:')
    console.error('    $env:DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"')
    console.error('  Linux/Mac:')
    console.error('    export DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"')
    console.error('\nThen run: npm run migrate:aws')
    process.exit(1)
  }

  // Mask password in logs
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@')
  console.log(`📊 Database: ${maskedUrl}\n`)

  try {
    // Step 1: Generate Prisma Client
    console.log('📦 Step 1: Generating Prisma Client...')
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    })
    console.log('✅ Prisma Client generated\n')

    // Step 2: Push schema to database (creates all tables)
    console.log('🚀 Step 2: Pushing schema to AWS RDS database...')
    console.log('   This will create all tables, indexes, and relationships.\n')
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    })
    console.log('')

    // Step 3: Verify schema
    console.log('✅ Step 3: Verifying database schema...')
    execSync('npx prisma db pull --print', { 
      stdio: 'pipe',
      env: { ...process.env, DATABASE_URL: databaseUrl }
    })

    console.log('\n' + '='.repeat(50))
    console.log('✅ Migration completed successfully!')
    console.log('='.repeat(50))
    console.log('\nYour AWS RDS database is now ready to use.')
    console.log('You can now set up your Amplify environment variables with the same connection string.')

  } catch (error: any) {
    console.error('\n❌ Error during migration:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Verify your DATABASE_URL is correct')
    console.error('2. Check that your RDS security group allows connections from your IP')
    console.error('3. Verify the database name, username, and password are correct')
    console.error('4. Ensure the RDS instance is running')
    process.exit(1)
  }
}

// Run the migration
runMigration()
