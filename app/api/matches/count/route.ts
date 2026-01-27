import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/matches/count
 * Get total count of completed matches across all leagues
 */
export async function GET() {
  try {
    const count = await db.match.count({
      where: {
        status: 'completed'
      }
    })

    return NextResponse.json({ 
      count 
    })
  } catch (error) {
    console.error('Error fetching matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
