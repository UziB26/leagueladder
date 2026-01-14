import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RatingHistoryEntry {
  id: string
  match_id: string
  league_id: string
  league_name: string
  old_rating: number
  new_rating: number
  change: number
  created_at: string
  opponent_name?: string
  match_score?: string
  match_date?: string
}

/**
 * GET /api/players/[playerId]/rating-history
 * Fetch rating change history for a specific player
 * 
 * Query Parameters:
 *   leagueId: string (optional) - Filter by league
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   history: RatingHistoryEntry[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get('leagueId')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Verify player exists
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId)
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Build query with optional league filter
    let query = `
      SELECT 
        ru.id,
        ru.match_id,
        ru.league_id,
        l.name as league_name,
        ru.old_rating,
        ru.new_rating,
        ru.change,
        ru.created_at,
        m.player1_id,
        m.player2_id,
        m.player1_score,
        m.player2_score,
        m.played_at
      FROM rating_updates ru
      JOIN leagues l ON ru.league_id = l.id
      JOIN matches m ON ru.match_id = m.id
      WHERE ru.player_id = ?
    `
    
    const queryParams: any[] = [playerId]
    
    if (leagueId) {
      query += ' AND ru.league_id = ?'
      queryParams.push(leagueId)
    }
    
    query += ' ORDER BY ru.created_at DESC LIMIT ?'
    queryParams.push(limit)

    const history = db.prepare(query).all(...queryParams) as any[]

    // Enrich with opponent information
    const enrichedHistory: RatingHistoryEntry[] = history.map((entry) => {
      // Determine opponent
      const isPlayer1 = entry.player1_id === playerId
      const opponentId = isPlayer1 ? entry.player2_id : entry.player1_id
      
      // Get opponent name
      const opponent = db.prepare('SELECT name FROM players WHERE id = ?').get(opponentId) as any
      const opponentName = opponent?.name || 'Unknown'
      
      // Format match score
      const playerScore = isPlayer1 ? entry.player1_score : entry.player2_score
      const opponentScore = isPlayer1 ? entry.player2_score : entry.player1_score
      const matchScore = `${playerScore}-${opponentScore}`
      
      return {
        id: entry.id,
        match_id: entry.match_id,
        league_id: entry.league_id,
        league_name: entry.league_name,
        old_rating: entry.old_rating,
        new_rating: entry.new_rating,
        change: entry.change,
        created_at: entry.created_at,
        opponent_name: opponentName,
        match_score: matchScore,
        match_date: entry.played_at
      }
    })

    return NextResponse.json({ history: enrichedHistory })
  } catch (error: any) {
    console.error('Error fetching rating history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating history' },
      { status: 500 }
    )
  }
}
