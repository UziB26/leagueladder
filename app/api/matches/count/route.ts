import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/matches/count
 * Get total count of completed matches across all leagues
 */
export async function GET() {
  try {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM matches
      WHERE status = 'completed'
    `).get() as { count: number } | undefined

    return NextResponse.json({ 
      count: result?.count || 0 
    })
  } catch (error) {
    console.error('Error fetching matches count:', error)
    return NextResponse.json({ count: 0 })
  }
}
