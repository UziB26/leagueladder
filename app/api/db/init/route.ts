import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Initialize PostgreSQL database schema
 * Call this ONCE after creating Vercel Postgres database
 * GET /api/db/init
 */
export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET() {
  try {
    // Check if database URL is set
    if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL && !process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database URL not set. Please set DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL environment variable.' },
        { status: 400 }
      )
    }

    // Use Prisma Migrate to sync schema
    // For production, run: npx prisma migrate deploy
    // For development, run: npx prisma db push
    
    // Seed initial leagues using Prisma
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

    const results = []
    for (const league of leagues) {
      try {
        const result = await db.league.upsert({
          where: { id: league.id },
          update: {},
          create: league
        })
        results.push({
          table: 'leagues',
          action: 'created/updated',
          league: result.name,
          status: 'success'
        })
      } catch (error: any) {
        results.push({
          table: 'leagues',
          action: 'create',
          league: league.name,
          status: 'error',
          error: error.message
        })
        console.error('Error seeding league:', error)
      }
    }

    // Note: Database schema is managed by Prisma Migrate
    // To initialize schema, run: npx prisma migrate deploy
    // Or for development: npx prisma db push

    return NextResponse.json({
      success: true,
      message: 'Database initialized and seeded with leagues',
      note: 'Database schema should be initialized using: npx prisma migrate deploy (production) or npx prisma db push (development)',
      results
    })

  } catch (error: any) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize database' },
      { status: 500 }
    )
  }
}
