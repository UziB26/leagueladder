import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    // Get player count for this league
    const playerCount = await db.leagueMembership.count({
      where: {
        leagueId,
        isActive: true
      }
    })

    return NextResponse.json({ 
      playerCount 
    })

  } catch (error) {
    console.error('Error fetching league stats:', error)
    return NextResponse.json({ playerCount: 0 })
  }
}
