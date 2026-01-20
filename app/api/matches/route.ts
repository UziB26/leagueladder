import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, dbHelpers } from '@/lib/db'
import { pgGet, pgAll, pgRun, isPostgresAvailable } from '@/lib/db/postgres'
import { elo } from '@/lib/elo'
import crypto from 'crypto'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface User {
  id: string
  email: string
}

interface Player {
  id: string
  user_id: string
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const usePostgres = isPostgresAvailable()
    
    let user: User | undefined
    if (usePostgres) {
      user = await pgGet('SELECT * FROM users WHERE email = $1', session.user.email) as User | undefined
    } else {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let player: Player | undefined
    if (usePostgres) {
      player = await pgGet('SELECT * FROM players WHERE user_id = $1', user.id) as Player | undefined
    } else {
      player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    }
    
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
      let challenge: any
      if (usePostgres) {
        challenge = await pgGet('SELECT * FROM challenges WHERE id = $1', challengeId)
      } else {
        challenge = db.prepare('SELECT * FROM challenges WHERE id = ?').get(challengeId) as any
      }
      
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
      let existingMatch: any
      if (usePostgres) {
        existingMatch = await pgGet('SELECT * FROM matches WHERE challenge_id = $1', challengeId)
      } else {
        existingMatch = db.prepare('SELECT * FROM matches WHERE challenge_id = ?').get(challengeId) as any
      }
      
      if (existingMatch) {
        return NextResponse.json(
          { error: 'A match already exists for this challenge' },
          { status: 400 }
        )
      }
    }

    // Create the match
    const matchId = crypto.randomUUID()
    // Matches should be created as 'pending_confirmation' to require opponent confirmation
    // Only set to 'completed' if explicitly requested (e.g., admin override)
    const matchStatus = status || 'pending_confirmation'
    
    // Determine winner_id before inserting
    const winnerId = player1Score > player2Score 
      ? player1Id 
      : player2Score > player1Score 
      ? player2Id 
      : null
    
    // Insert match with winner_id and reported_by set
    // reported_by is the player who reported the match (current player)
    if (usePostgres) {
      await pgRun(`
        INSERT INTO matches (
          id, challenge_id, player1_id, player2_id, league_id,
          player1_score, player2_score, status, winner_id, reported_by, confirmed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CASE WHEN $8 = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END)
      `, matchId, challengeId || null, player1Id, player2Id, leagueId, player1Score, player2Score, matchStatus, winnerId, player.id)
    } else {
      db.prepare(`
        INSERT INTO matches (
          id, challenge_id, player1_id, player2_id, league_id,
          player1_score, player2_score, status, winner_id, reported_by, confirmed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE NULL END)
      `).run(
        matchId,
        challengeId || null,
        player1Id,
        player2Id,
        leagueId,
        player1Score,
        player2Score,
        matchStatus,
        winnerId,
        player.id,
        matchStatus
      )
    }

    // Mark challenge as completed if match is completed and challenge exists
    if (matchStatus === 'completed' && challengeId) {
      if (usePostgres) {
        await pgRun(`
          UPDATE challenges
          SET status = 'completed'
          WHERE id = $1 AND status = 'accepted'
        `, challengeId)
      } else {
        db.prepare(`
          UPDATE challenges
          SET status = 'completed'
          WHERE id = ? AND status = 'accepted'
        `).run(challengeId)
      }
    }
    // Note: Player stats are updated automatically by the update_player_stats_on_match_insert trigger (SQLite only)
    // For PostgreSQL, stats are updated in the confirmation route

    // ELO ratings should only be updated after match confirmation
    // If status is explicitly 'completed' (e.g., admin override), update ELO immediately
    if (matchStatus === 'completed') {
      try {
        if (!usePostgres) {
          dbHelpers.updateEloRatings(matchId, elo)
        }
        // For PostgreSQL, Elo is handled in confirmation route
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

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const usePostgres = isPostgresAvailable()
    
    let user: User | undefined
    if (usePostgres) {
      user = await pgGet('SELECT * FROM users WHERE email = $1', session.user.email) as User | undefined
    } else {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let player: Player | undefined
    if (usePostgres) {
      player = await pgGet('SELECT * FROM players WHERE user_id = $1', user.id) as Player | undefined
    } else {
      player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    }
    
    if (!player) {
      return NextResponse.json({ matches: [] })
    }

    // Get matches for the current player
    let matches: any[]
    if (usePostgres) {
      matches = await pgAll(`
        SELECT 
          m.*,
          l.name as league_name,
          p1.name as player1_name,
          p2.name as player2_name
        FROM matches m
        JOIN leagues l ON m.league_id = l.id
        JOIN players p1 ON m.player1_id = p1.id
        JOIN players p2 ON m.player2_id = p2.id
        WHERE (m.player1_id = $1 OR m.player2_id = $1)
        ORDER BY m.played_at DESC
        LIMIT 50
      `, player.id)
    } else {
      matches = db.prepare(`
        SELECT 
          m.*,
          l.name as league_name,
          p1.name as player1_name,
          p2.name as player2_name
        FROM matches m
        JOIN leagues l ON m.league_id = l.id
        JOIN players p1 ON m.player1_id = p1.id
        JOIN players p2 ON m.player2_id = p2.id
        WHERE (m.player1_id = ? OR m.player2_id = ?)
        ORDER BY m.played_at DESC
        LIMIT 50
      `).all(player.id, player.id) as any[]
    }

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
