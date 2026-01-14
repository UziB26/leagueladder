import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    // Get player count for this league
    const result = db.prepare(`
      SELECT COUNT(DISTINCT player_id) as count
      FROM league_memberships
      WHERE league_id = ? AND is_active = 1
    `).get(leagueId) as { count: number } | undefined

    const playerCount = result?.count || 0

    return NextResponse.json({ 
      playerCount 
    })

  } catch (error) {
    console.error('Error fetching league stats:', error)
    return NextResponse.json({ playerCount: 0 })
  }
}
