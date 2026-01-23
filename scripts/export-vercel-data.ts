/**
 * Export Data from Vercel Postgres
 * 
 * This script exports all data from your Vercel Postgres database.
 * 
 * Usage:
 *   # Set your Vercel Postgres connection string
 *   $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"
 *   npm run export:vercel
 * 
 * This will create a SQL dump file that can be imported to AWS RDS.
 */

// Load environment variables
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { execSync } from 'child_process'
import * as fs from 'fs'

// Load .env files (but don't override existing env vars)
dotenv.config({ path: resolve(process.cwd(), '.env'), override: false })
dotenv.config({ path: resolve(process.cwd(), '.env.local'), override: false })

async function exportData() {
  console.log('📤 Starting data export from Vercel Postgres...\n')

  // Get Vercel database URL from environment
  const vercelDatabaseUrl = 
    process.env.VERCEL_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL;

  if (!vercelDatabaseUrl) {
    console.error('❌ Error: VERCEL_DATABASE_URL not found in environment variables')
    console.error('\nPlease set your Vercel Postgres connection string:')
    console.error('  Windows PowerShell:')
    console.error('    $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"')
    console.error('  Linux/Mac:')
    console.error('    export VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"')
    console.error('\nThen run: npm run export:vercel')
    console.error('\nYou can find your Vercel Postgres connection string in:')
    console.error('  Vercel Dashboard → Storage → Your Database → Connection String')
    process.exit(1)
  }

  // Mask password in logs
  const maskedUrl = vercelDatabaseUrl.replace(/:([^:@]+)@/, ':****@')
  console.log(`📊 Source Database: ${maskedUrl}\n`)

  const outputFile = 'vercel-data-export.sql'
  
  try {
    console.log('🔄 Exporting data from Vercel Postgres...')
    console.log('   This may take a few minutes depending on data size.\n')

    // Use pg_dump to export data
    // Note: This requires pg_dump to be installed
    // Windows: Download from postgresql.org or use WSL
    // Mac: brew install postgresql
    // Linux: sudo apt-get install postgresql-client
    
    const pgDumpCommand = `pg_dump "${vercelDatabaseUrl}" --no-owner --no-acl --data-only --inserts > "${outputFile}"`
    
    try {
      execSync(pgDumpCommand, { 
        stdio: 'inherit',
        shell: true as any
      })
      
      // Check if file was created and has content
      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile)
        if (stats.size > 0) {
          console.log(`\n✅ Data exported successfully!`)
          console.log(`📁 File: ${outputFile}`)
          console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`)
          console.log(`\nNext step: Import this file to AWS RDS using:`)
          console.log(`  npm run import:aws`)
        } else {
          console.error(`\n⚠️  Warning: Export file is empty`)
          console.error(`This might mean there's no data to export, or pg_dump failed silently.`)
        }
      } else {
        throw new Error('Export file was not created')
      }
    } catch (error: any) {
      console.error('\n❌ Error: pg_dump command failed')
      console.error('\nThis usually means:')
      console.error('1. pg_dump is not installed on your system')
      console.error('2. The connection string is incorrect')
      console.error('3. Network/firewall issues')
      console.error('\nAlternative: Use Vercel Dashboard to export data')
      console.error('  Vercel Dashboard → Storage → Your Database → Query tab')
      console.error('  Or use the manual export method in AWS_AMPLIFY_MIGRATION.md')
      throw error
    }

  } catch (error: any) {
    console.error('\n❌ Error during export:', error.message)
    process.exit(1)
  }
}

// Run the export
exportData()
