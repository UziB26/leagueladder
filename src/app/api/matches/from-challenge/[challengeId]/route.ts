import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, dbHelpers, DatabaseTransaction, validateMatchData, validatePlayerLeagueMembership, createBackup, restoreBackup } from '@/lib/db'
import { elo } from '@/lib/elo'
import { apiRateLimit } from '@/lib/rate-limit'
import { validateRequest, requestSchemas } from '@/lib/validation'
import { sanitizeUUID, sanitizeInteger, sanitizeString } from '@/lib/sanitize'
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
  request: NextRequest,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { challengeId } = await params

    // Sanitize challenge ID
    const sanitizedChallengeId = sanitizeUUID(challengeId)
    if (!sanitizedChallengeId) {
      return NextResponse.json(
        { error: 'Invalid challenge ID format' },
        { status: 400 }
      )
    }

    // Validate request body
    const validator = validateRequest({
      schema: requestSchemas.reportMatchFromChallenge,
      errorMessage: 'Invalid match score data',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { player1Score, player2Score, status } = data

    // Sanitize scores
    const sanitizedPlayer1Score = sanitizeInteger(player1Score, 0, 1000)
    const sanitizedPlayer2Score = sanitizeInteger(player2Score, 0, 1000)

    if (sanitizedPlayer1Score === null || sanitizedPlayer2Score === null) {
      return NextResponse.json(
        { error: 'Invalid score values' },
        { status: 400 }
      )
    }

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

    // Get the challenge
    const challenge = db.prepare(`
      SELECT 
        c.*,
        l.id as league_id
      FROM challenges c
      JOIN leagues l ON c.league_id = l.id
      WHERE c.id = ?
    `).get(sanitizedChallengeId) as any

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
    const existingMatch = db.prepare('SELECT * FROM matches WHERE challenge_id = ?').get(sanitizedChallengeId) as any
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

    // Sanitize player IDs
    const sanitizedPlayer1Id = sanitizeUUID(player1Id)
    const sanitizedPlayer2Id = sanitizeUUID(player2Id)
    // League IDs are strings like 'tt_league', 'fifa_league', not UUIDs
    const sanitizedLeagueId = sanitizeString(challenge.league_id)

    if (!sanitizedPlayer1Id || !sanitizedPlayer2Id) {
      return NextResponse.json(
        { error: 'Invalid player ID format' },
        { status: 400 }
      )
    }
    
    if (!sanitizedLeagueId || sanitizedLeagueId.length === 0) {
      return NextResponse.json(
        { error: 'Invalid league ID format' },
        { status: 400 }
      )
    }

    // Validate reasonable score limits
    const MAX_REASONABLE_SCORE = 1000
    if (sanitizedPlayer1Score > MAX_REASONABLE_SCORE || sanitizedPlayer2Score > MAX_REASONABLE_SCORE) {
      return NextResponse.json(
        { error: `Scores must be reasonable numbers (max ${MAX_REASONABLE_SCORE})` },
        { status: 400 }
      )
    }

    // Ensure at least one score is greater than 0 (can't both be 0)
    if (sanitizedPlayer1Score === 0 && sanitizedPlayer2Score === 0) {
      return NextResponse.json(
        { error: 'At least one player must have a score greater than 0' },
        { status: 400 }
      )
    }

    // Validate match data before proceeding
    const matchValidation = validateMatchData({
      player1Id: sanitizedPlayer1Id,
      player2Id: sanitizedPlayer2Id,
      leagueId: sanitizedLeagueId,
      player1Score: sanitizedPlayer1Score,
      player2Score: sanitizedPlayer2Score,
      challengeId: sanitizedChallengeId,
      status: status || 'completed',
    })

    if (!matchValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid match data', details: matchValidation.errors },
        { status: 400 }
      )
    }

    // Validate player league memberships
    const player1Validation = validatePlayerLeagueMembership(
      sanitizedPlayer1Id,
      sanitizedLeagueId,
      db
    )
    if (!player1Validation.valid) {
      return NextResponse.json(
        { error: `Player 1: ${player1Validation.error}` },
        { status: 400 }
      )
    }

    const player2Validation = validatePlayerLeagueMembership(
      sanitizedPlayer2Id,
      sanitizedLeagueId,
      db
    )
    if (!player2Validation.valid) {
      return NextResponse.json(
        { error: `Player 2: ${player2Validation.error}` },
        { status: 400 }
      )
    }

    // Create backup of player ratings and challenge before making changes
    const backup = createBackup({
      playerIds: [sanitizedPlayer1Id, sanitizedPlayer2Id],
      challengeIds: [sanitizedChallengeId],
    })

    // Use transaction for atomic match creation with backup/rollback support
    let matchResult: { matchId: string; matchStatus: string }
    try {
      matchResult = DatabaseTransaction.execute((tx) => {
        const matchId = crypto.randomUUID()
        // Set status to pending_confirmation to require opponent confirmation
        const matchStatus = 'pending_confirmation'
        
        // Determine winner_id before inserting
        const winnerId = sanitizedPlayer1Score > sanitizedPlayer2Score 
          ? sanitizedPlayer1Id 
          : sanitizedPlayer2Score > sanitizedPlayer1Score 
          ? sanitizedPlayer2Id 
          : null
        
        // Insert match with pending_confirmation status and track who reported it
        const insertMatch = db.prepare(`
          INSERT INTO matches (
            id, challenge_id, player1_id, player2_id, league_id,
            player1_score, player2_score, status, winner_id, reported_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        tx.run(
          insertMatch,
          matchId,
          sanitizedChallengeId,
          sanitizedPlayer1Id,
          sanitizedPlayer2Id,
          sanitizedLeagueId,
          sanitizedPlayer1Score,
          sanitizedPlayer2Score,
          matchStatus,
          winnerId,
          player.id // Track who reported the match
        )

        // Note: Ratings will be updated only after opponent confirms
        // Challenge status will be updated after confirmation

        return { matchId, matchStatus }
      })
    } catch (error: any) {
      // Rollback using backup if transaction fails
      console.error('Error in match creation transaction:', error)
      try {
        restoreBackup(backup)
      } catch (restoreError) {
        console.error('Error restoring backup:', restoreError)
      }
      throw error
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
    `).get(matchResult.matchId) as any

    return NextResponse.json({
      success: true,
      match: {
        id: matchResult.matchId,
        challengeId: sanitizedChallengeId,
        player1Id: sanitizedPlayer1Id,
        player2Id: sanitizedPlayer2Id,
        leagueId: sanitizedLeagueId,
        player1Score: sanitizedPlayer1Score,
        player2Score: sanitizedPlayer2Score,
        status: matchResult.matchStatus,
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
