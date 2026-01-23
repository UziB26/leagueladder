/**
 * Import Data to AWS RDS
 * 
 * This script imports data from the exported SQL file to your AWS RDS database.
 * 
 * Usage:
 *   # Set your AWS RDS connection string
 *   $env:AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"
 *   npm run import:aws
 * 
 * This will import the data exported from Vercel Postgres.
 */

// Load environment variables
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { execSync } from 'child_process'
import * as fs from 'fs'

// Load .env files (but don't override existing env vars)
dotenv.config({ path: resolve(process.cwd(), '.env'), override: false })
dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: false })

async function importData() {
  console.log('📥 Starting data import to AWS RDS...\n')

  // Get AWS RDS database URL from environment
  const awsDatabaseUrl = 
    process.env.AWS_DATABASE_URL ||
    process.env.DATABASE_URL;

  if (!awsDatabaseUrl) {
    console.error('❌ Error: AWS_DATABASE_URL not found in environment variables')
    console.error('\nPlease set your AWS RDS connection string:')
    console.error('  Windows PowerShell:')
    console.error('    $env:AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"')
    console.error('  Linux/Mac:')
    console.error('    export AWS_DATABASE_URL="postgresql://username:password@endpoint:5432/league_ladder?sslmode=require"')
    console.error('\nThen run: npm run import:aws')
    process.exit(1)
  }

  // Mask password in logs
  const maskedUrl = awsDatabaseUrl.replace(/:([^:@]+)@/, ':****@')
  console.log(`📊 Target Database: ${maskedUrl}\n`)

  const inputFile = 'vercel-data-export.sql'
  
  // Check if export file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: Export file not found: ${inputFile}`)
    console.error('\nPlease export data from Vercel first:')
    console.error('  npm run export:vercel')
    process.exit(1)
  }

  const stats = fs.statSync(inputFile)
  if (stats.size === 0) {
    console.error(`❌ Error: Export file is empty: ${inputFile}`)
    console.error('\nPlease export data from Vercel first:')
    console.error('  npm run export:vercel')
    process.exit(1)
  }

  console.log(`📁 Import file: ${inputFile}`)
  console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB\n`)

  try {
    console.log('🔄 Importing data to AWS RDS...')
    console.log('   This may take a few minutes depending on data size.\n')

    // Use psql to import data
    // Note: This requires psql to be installed
    // Windows: Download from postgresql.org or use WSL
    // Mac: brew install postgresql
    // Linux: sudo apt-get install postgresql-client
    
    const psqlCommand = `psql "${awsDatabaseUrl}" < "${inputFile}"`
    
    try {
      execSync(psqlCommand, { 
        stdio: 'inherit',
        shell: true as any
      })
      
      console.log(`\n✅ Data imported successfully!`)
      console.log(`\nYour AWS RDS database now contains all data from Vercel Postgres.`)
      console.log(`You can now proceed with setting up AWS Amplify.`)

    } catch (error: any) {
      console.error('\n❌ Error: psql import command failed')
      console.error('\nThis usually means:')
      console.error('1. psql is not installed on your system')
      console.error('2. The connection string is incorrect')
      console.error('3. Network/firewall issues (check RDS security group)')
      console.error('4. Data conflicts (tables already have data)')
      console.error('\nAlternative: Use pgAdmin or manual import method')
      throw error
    }

  } catch (error: any) {
    console.error('\n❌ Error during import:', error.message)
    process.exit(1)
  }
}

// Run the import
importData()
