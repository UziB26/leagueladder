import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/leagues/[leagueId]/matches/count
 * Get count of completed matches for a specific league
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    const count = await db.match.count({
      where: {
        leagueId,
        status: 'completed'
      }
    })

    return NextResponse.json({ 
      count 
    })
  } catch (error) {
    console.error('Error fetching league matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
