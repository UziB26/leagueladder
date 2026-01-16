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
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Validate request
    const validator = validateRequest({
      schema: requestSchemas.reportMatch,
      errorMessage: 'Invalid match data',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { player1Id, player2Id, leagueId, player1Score, player2Score, status } = data

    // Sanitize inputs
    const sanitizedPlayer1Id = sanitizeUUID(player1Id)
    const sanitizedPlayer2Id = sanitizeUUID(player2Id)
    // League IDs are strings like 'tt_league', 'fifa_league', not UUIDs
    const sanitizedLeagueId = sanitizeString(leagueId)
    const sanitizedPlayer1Score = sanitizeInteger(player1Score, 0, 1000)
    const sanitizedPlayer2Score = sanitizeInteger(player2Score, 0, 1000)

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

    if (sanitizedPlayer1Score === null || sanitizedPlayer2Score === null) {
      return NextResponse.json(
        { error: 'Invalid score values' },
        { status: 400 }
      )
    }

    // Prevent self-match (player cannot play against themselves)
    if (sanitizedPlayer1Id === sanitizedPlayer2Id) {
      return NextResponse.json(
        { error: 'Cannot report a match where both players are the same' },
        { status: 400 }
      )
    }

    // Validate score format: must be non-negative integers
    if (sanitizedPlayer1Score < 0 || sanitizedPlayer2Score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative integers' },
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

    if (sanitizedPlayer1Id === sanitizedPlayer2Id) {
      return NextResponse.json(
        { error: 'Players cannot play against themselves' },
        { status: 400 }
      )
    }

    // Verify the current player is one of the players
    if (player.id !== sanitizedPlayer1Id && player.id !== sanitizedPlayer2Id) {
      return NextResponse.json(
        { error: 'You can only report matches you participated in' },
        { status: 403 }
      )
    }

    // If challengeId is provided, verify the challenge exists and is accepted
    const challengeId = (data as any).challengeId
    if (challengeId) {
      const sanitizedChallengeId = sanitizeUUID(challengeId)
      if (!sanitizedChallengeId) {
        return NextResponse.json(
          { error: 'Invalid challenge ID format' },
          { status: 400 }
        )
      }

      const challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(sanitizedChallengeId) as any
      
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
        (challenge.challenger_id !== sanitizedPlayer1Id || challenge.challengee_id !== sanitizedPlayer2Id) &&
        (challenge.challenger_id !== sanitizedPlayer2Id || challenge.challengee_id !== sanitizedPlayer1Id)
      ) {
        return NextResponse.json(
          { error: 'Players do not match the challenge' },
          { status: 400 }
        )
      }
    }

    // Check if a match already exists for this challenge
    if (challengeId) {
      const sanitizedChallengeId = sanitizeUUID(challengeId)
      if (sanitizedChallengeId) {
        const existingMatch = db.prepare('SELECT * FROM matches WHERE challenge_id = ?').get(sanitizedChallengeId) as any
        if (existingMatch) {
          return NextResponse.json(
            { error: 'A match already exists for this challenge' },
            { status: 400 }
          )
        }
      }
    }

    // Validate match data before proceeding
    const matchValidation = validateMatchData({
      player1Id: sanitizedPlayer1Id,
      player2Id: sanitizedPlayer2Id,
      leagueId: sanitizedLeagueId,
      player1Score: sanitizedPlayer1Score,
      player2Score: sanitizedPlayer2Score,
      challengeId: challengeId ? (sanitizeUUID(challengeId) ?? undefined) : undefined,
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

    // Create backup of player ratings before making changes
    const backup = createBackup({
      playerIds: [sanitizedPlayer1Id, sanitizedPlayer2Id],
      challengeIds: challengeId ? [sanitizeUUID(challengeId)!] : undefined,
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
          challengeId ? sanitizeUUID(challengeId) : null,
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

    return NextResponse.json({
      success: true,
      match: {
        id: matchResult.matchId,
        challengeId: challengeId ? sanitizeUUID(challengeId) : null,
        player1Id: sanitizedPlayer1Id,
        player2Id: sanitizedPlayer2Id,
        leagueId: sanitizedLeagueId,
        player1Score: sanitizedPlayer1Score,
        player2Score: sanitizedPlayer2Score,
        status: matchResult.matchStatus
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
    `).all(player.id, player.id, limit) as any[]

    // Fetch rating updates for each match
    const matchesWithRatings = matches.map((match) => {
      // Get rating updates for both players
      const ratingUpdate1 = db.prepare(`
        SELECT old_rating, new_rating, change
        FROM rating_updates
        WHERE match_id = ? AND player_id = ?
        LIMIT 1
      `).get(match.id, match.player1_id) as any

      const ratingUpdate2 = db.prepare(`
        SELECT old_rating, new_rating, change
        FROM rating_updates
        WHERE match_id = ? AND player_id = ?
        LIMIT 1
      `).get(match.id, match.player2_id) as any

      return {
        ...match,
        rating_updates: {
          player1: ratingUpdate1 || null,
          player2: ratingUpdate2 || null
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })

  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
