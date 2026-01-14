import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, dbHelpers } from '@/lib/db'
import { elo } from '@/lib/elo'
import crypto from 'crypto'

interface User {
  id: string
  email: string
}

interface Player {
  id: string
  user_id: string
}

/**
 * POST /api/matches
 * Create a new match from an accepted challenge
 * 
 * Request Body:
 * {
 *   challengeId?: string,      // Optional: ID of the accepted challenge
 *   player1Id: string,         // Required: ID of player 1
 *   player2Id: string,         // Required: ID of player 2
 *   leagueId: string,          // Required: ID of the league
 *   player1Score: number,      // Required: Score for player 1
 *   player2Score: number,       // Required: Score for player 2
 *   status?: string            // Optional: Match status (defaults to 'completed')
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   match: { id, challengeId, player1Id, player2Id, leagueId, player1Score, player2Score, status }
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { challengeId, player1Id, player2Id, leagueId, player1Score, player2Score, status } = body

    // Validation
    if (!player1Id || !player2Id || !leagueId) {
      return NextResponse.json(
        { error: 'Player IDs and league ID are required' },
        { status: 400 }
      )
    }

    if (player1Score === undefined || player2Score === undefined) {
      return NextResponse.json(
        { error: 'Scores are required' },
        { status: 400 }
      )
    }

    if (player1Score < 0 || player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative' },
        { status: 400 }
      )
    }

    if (player1Id === player2Id) {
      return NextResponse.json(
        { error: 'Players cannot play against themselves' },
        { status: 400 }
      )
    }

    // Verify the current player is one of the players
    if (player.id !== player1Id && player.id !== player2Id) {
      return NextResponse.json(
        { error: 'You can only report matches you participated in' },
        { status: 403 }
      )
    }

    // If challengeId is provided, verify the challenge exists and is accepted
    if (challengeId) {
      const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(challengeId) as any
      
      if (!challenge) {
        return NextResponse.json(
          { error: 'Challenge not found' },
          { status: 404 }
        )
      }

      if (challenge.status !== 'accepted') {
        return NextResponse.json(
          { error: 'Challenge must be accepted before reporting a match' },
          { status: 400 }
        )
      }

      // Verify players match the challenge
      if (
        (challenge.challenger_id !== player1Id || challenge.challengee_id !== player2Id) &&
        (challenge.challenger_id !== player2Id || challenge.challengee_id !== player1Id)
      ) {
        return NextResponse.json(
          { error: 'Players do not match the challenge' },
          { status: 400 }
        )
      }
    }

    // Check if a match already exists for this challenge
    if (challengeId) {
      const existingMatch = db.prepare('SELECT * FROM matches WHERE challenge_id = ?').get(challengeId) as any
      if (existingMatch) {
        return NextResponse.json(
          { error: 'A match already exists for this challenge' },
          { status: 400 }
        )
      }
    }

    // Create the match
    const matchId = crypto.randomUUID()
    const matchStatus = status || 'completed'
    
    db.prepare(`
      INSERT INTO matches (
        id, challenge_id, player1_id, player2_id, league_id,
        player1_score, player2_score, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      matchId,
      challengeId || null,
      player1Id,
      player2Id,
      leagueId,
      player1Score,
      player2Score,
      matchStatus
    )

    // Mark challenge as completed if match is completed and challenge exists
    if (matchStatus === 'completed' && challengeId) {
      db.prepare(`
        UPDATE challenges
        SET status = 'completed'
        WHERE id = ? AND status = 'accepted'
      `).run(challengeId)
    }

    // If status is 'completed', update Elo ratings
    if (matchStatus === 'completed') {
      try {
        dbHelpers.updateEloRatings(matchId, elo)
      } catch (error: any) {
        console.error('Error updating Elo ratings:', error)
        // Don't fail the request if rating update fails, but log it
      }
    }

    return NextResponse.json({
      success: true,
      match: {
        id: matchId,
        challengeId,
        player1Id,
        player2Id,
        leagueId,
        player1Score,
        player2Score,
        status: matchStatus
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create match' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/matches
 * List recent matches for the authenticated player
 * 
 * Query Parameters:
 * - limit?: number (default: 50) - Maximum number of matches to return
 * 
 * Response:
 * {
 *   matches: [
 *     {
 *       id: string,
 *       player1_id: string,
 *       player2_id: string,
 *       player1_score: number,
 *       player2_score: number,
 *       winner_id: string | null,
 *       league_name: string,
 *       player1_name: string,
 *       player2_name: string,
 *       status: string,
 *       played_at: string,
 *       confirmed_at: string | null
 *     }
 *   ]
 * }
 */
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    
    if (!player) {
      return NextResponse.json({ matches: [] })
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get matches for the current player
    const matches = db.prepare(`
      SELECT 
        m.id,
        m.player1_id,
        m.player2_id,
        m.player1_score,
        m.player2_score,
        m.winner_id,
        m.league_id,
        m.status,
        m.played_at,
        m.confirmed_at,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
      ORDER BY m.played_at DESC
      LIMIT ?
    `).all(player.id, player.id, limit)

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
