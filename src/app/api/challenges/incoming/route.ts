import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Mock user ID for now
    const mockUserId = 'player_mock_123'
    
    const challenges = db.prepare(`
      SELECT 
        c.*,
        p1.name as challenger_name,
        p2.name as challengee_name,
        l.name as league_name
      FROM challenges c
      JOIN players p1 ON c.challenger_id = p1.id
      JOIN players p2 ON c.challengee_id = p2.id
      JOIN leagues l ON c.league_id = l.id
      WHERE c.challengee_id = ?
      ORDER BY c.created_at DESC
    `).all(mockUserId)
    
    return NextResponse.json({ challenges })
    
  } catch (error) {
    console.error('Error fetching incoming challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incoming challenges' },
      { status: 500 }
    )
  }
}
