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
 * POST /api/matches/from-challenge/[challengeId]
 * Report match scores for a specific accepted challenge
 * 
 * This is a convenience endpoint that creates a match from an accepted challenge.
 * It automatically determines player1 and player2 based on the challenge.
 * 
 * Request Body:
 * {
 *   player1Score: number,      // Required: Score for the challenger
 *   player2Score: number,       // Required: Score for the challengee
 *   status?: string            // Optional: Match status (defaults to 'completed')
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   match: { id, challengeId, player1Id, player2Id, leagueId, player1Score, player2Score, status }
 * }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { challengeId } = await params
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
    const { player1Score, player2Score, status } = body

    // Validation
    if (player1Score === undefined || player2Score === undefined) {
      return NextResponse.json(
        { error: 'Both scores are required' },
        { status: 400 }
      )
    }

    if (player1Score < 0 || player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative' },
        { status: 400 }
      )
    }

    // Get the challenge
    const challenge = db.prepare(`
      SELECT 
        c.*,
        l.id as league_id
      FROM challenges c
      JOIN leagues l ON c.league_id = l.id
      WHERE c.id = ?
    `).get(challengeId) as any

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Verify challenge is accepted
    if (challenge.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Challenge must be accepted before reporting a match' },
        { status: 400 }
      )
    }

    // Verify the current player is part of this challenge
    if (player.id !== challenge.challenger_id && player.id !== challenge.challengee_id) {
      return NextResponse.json(
        { error: 'You can only report matches for challenges you are involved in' },
        { status: 403 }
      )
    }

    // Check if a match already exists for this challenge
    const existingMatch = db.prepare('SELECT * FROM matches WHERE challenge_id = ?').get(challengeId) as any
    if (existingMatch) {
      return NextResponse.json(
        { error: 'A match already exists for this challenge' },
        { status: 400 }
      )
    }

    // Determine player1 and player2 based on challenge
    // player1Score corresponds to challenger, player2Score corresponds to challengee
    const player1Id = challenge.challenger_id
    const player2Id = challenge.challengee_id

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
      challengeId,
      player1Id,
      player2Id,
      challenge.league_id,
      player1Score,
      player2Score,
      matchStatus
    )

    // Mark challenge as completed (trigger should also handle this, but explicit update ensures it)
    if (matchStatus === 'completed') {
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

    // Get the created match with player names
    const createdMatch = db.prepare(`
      SELECT 
        m.*,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE m.id = ?
    `).get(matchId) as any

    return NextResponse.json({
      success: true,
      match: {
        id: matchId,
        challengeId,
        player1Id,
        player2Id,
        leagueId: challenge.league_id,
        player1Score,
        player2Score,
        status: matchStatus,
        player1_name: createdMatch.player1_name,
        player2_name: createdMatch.player2_name,
        league_name: createdMatch.league_name
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating match from challenge:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create match from challenge' },
      { status: 500 }
    )
  }
}
