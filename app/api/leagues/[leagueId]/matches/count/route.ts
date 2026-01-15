import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM matches
      WHERE league_id = ? AND status = 'completed'
    `).get(leagueId) as { count: number } | undefined

    return NextResponse.json({ 
      count: result?.count || 0 
    })
  } catch (error) {
    console.error('Error fetching league matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
