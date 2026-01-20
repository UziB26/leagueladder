import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pgGet, pgAll, pgRun, isPostgresAvailable } from '@/lib/db/postgres'
import { apiRateLimit } from '@/lib/rate-limit'
import { validateRequest, requestSchemas } from '@/lib/validation'
import { sanitizeString } from '@/lib/sanitize'
import crypto from 'crypto'

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface Player {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Validate request
    const validator = validateRequest({
      schema: requestSchemas.joinLeague,
      errorMessage: 'Invalid league join request',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { leagueId } = data

    // Sanitize league ID (leagues use string IDs like 'tt_league', 'fifa_league', not UUIDs)
    const sanitizedLeagueId = sanitizeString(leagueId)
    if (!sanitizedLeagueId || sanitizedLeagueId.length === 0) {
      return NextResponse.json(
        { error: 'Invalid league ID format' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Use PostgreSQL if available, otherwise SQLite
    const usePostgres = isPostgresAvailable()

    // Get user from database
    let user: User | undefined
    if (usePostgres) {
      user = await pgGet('SELECT * FROM users WHERE email = $1', session.user.email) as User | undefined
    } else {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
    }
    
    // If user doesn't exist in database but has valid session, create them
    // This handles cases where database was reset (e.g., on Vercel with ephemeral storage)
    if (!user) {
      const userId = crypto.randomUUID()
      // Use name from session if available, otherwise fallback to email prefix
      const userName = session.user.name || session.user.email?.split('@')[0] || 'User'
      
      try {
        if (usePostgres) {
          await pgRun(`
            INSERT INTO users (id, email, name, created_at) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            ON CONFLICT (email) DO NOTHING
          `, userId, session.user.email, userName)
          user = await pgGet('SELECT * FROM users WHERE email = $1', session.user.email) as User | undefined
        } else {
          db.prepare(`
            INSERT INTO users (id, email, name, created_at) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `).run(userId, session.user.email, userName)
          user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User
        }
      } catch (error: any) {
        // If insert fails (e.g., race condition), try to get user again
        if (usePostgres) {
          user = await pgGet('SELECT * FROM users WHERE email = $1', session.user.email) as User | undefined
        } else {
          user = db.prepare('SELECT * FROM users WHERE email = ?').get(session.user.email) as User | undefined
        }
        if (!user) {
          console.error('Failed to create user:', error)
          return NextResponse.json(
            { error: 'Failed to create user account' },
            { status: 500 }
          )
        }
      }
    }

    // At this point, user is guaranteed to be defined
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if player exists, create if not
    let player: Player | undefined
    if (usePostgres) {
      player = await pgGet('SELECT * FROM players WHERE user_id = $1', user.id) as Player | undefined
    } else {
      player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player | undefined
    }
    
    if (!player) {
      const playerId = crypto.randomUUID()
      if (usePostgres) {
        await pgRun(`
          INSERT INTO players (id, user_id, name, email) 
          VALUES ($1, $2, $3, $4)
        `, playerId, user.id, user.name || session.user.name || 'Player', user.email)
        player = await pgGet('SELECT * FROM players WHERE user_id = $1', user.id) as Player
      } else {
        db.prepare(`
          INSERT INTO players (id, user_id, name, email) 
          VALUES (?, ?, ?, ?)
        `).run(playerId, user.id, user.name || session.user.name || 'Player', user.email)
        player = db.prepare('SELECT * FROM players WHERE user_id = ?').get(user.id) as Player
      }
    }

    // Check if already joined
    let existingMembership
    if (usePostgres) {
      existingMembership = await pgGet(`
        SELECT * FROM league_memberships 
        WHERE player_id = $1 AND league_id = $2
      `, player.id, sanitizedLeagueId)
    } else {
      existingMembership = db.prepare(`
        SELECT * FROM league_memberships 
        WHERE player_id = ? AND league_id = ?
      `).get(player.id, sanitizedLeagueId)
    }

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already joined this league' },
        { status: 400 }
      )
    }

    // Check if rating already exists (shouldn't happen, but handle gracefully)
    let existingRating
    if (usePostgres) {
      existingRating = await pgGet(`
        SELECT * FROM player_ratings 
        WHERE player_id = $1 AND league_id = $2
      `, player.id, sanitizedLeagueId)
    } else {
      existingRating = db.prepare(`
        SELECT * FROM player_ratings 
        WHERE player_id = ? AND league_id = ?
      `).get(player.id, sanitizedLeagueId)
    }

    // Join league
    const membershipId = crypto.randomUUID()
    try {
      if (usePostgres) {
        await pgRun(`
          INSERT INTO league_memberships (id, player_id, league_id, is_active) 
          VALUES ($1, $2, $3, TRUE)
          ON CONFLICT (player_id, league_id) DO NOTHING
        `, membershipId, player.id, sanitizedLeagueId)
        
        // Verify the membership was created
        const verifyMembership = await pgGet(`
          SELECT * FROM league_memberships 
          WHERE player_id = $1 AND league_id = $2
        `, player.id, sanitizedLeagueId)
        
        if (!verifyMembership) {
          console.error('Membership was not created successfully')
          throw new Error('Failed to create league membership')
        }
      } else {
        db.prepare(`
          INSERT INTO league_memberships (id, player_id, league_id, is_active) 
          VALUES (?, ?, ?, 1)
        `).run(membershipId, player.id, sanitizedLeagueId)
        
        // Verify the membership was created
        const verifyMembership = db.prepare(`
          SELECT * FROM league_memberships 
          WHERE player_id = ? AND league_id = ?
        `).get(player.id, sanitizedLeagueId)
        
        if (!verifyMembership) {
          console.error('Membership was not created successfully')
          throw new Error('Failed to create league membership')
        }
      }
    } catch (error: any) {
      // If membership insert fails due to unique constraint, check if it already exists
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE' || 
          error?.code === '23505' || // PostgreSQL unique violation
          error?.message?.includes('UNIQUE constraint') ||
          error?.message?.includes('duplicate key')) {
        // Membership already exists, return success silently
        return NextResponse.json({ 
          success: true, 
          message: 'Successfully joined league' 
        }, { status: 200 })
      }
      throw error
    }

    // Initialize rating with seed rating of 1000 and zero stats (only if it doesn't exist)
    if (!existingRating) {
      const ratingId = crypto.randomUUID()
      try {
        if (usePostgres) {
          await pgRun(`
            INSERT INTO player_ratings (
              id, player_id, league_id, rating, 
              games_played, wins, losses, draws
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (player_id, league_id) DO NOTHING
          `, ratingId, player.id, sanitizedLeagueId, 1000, 0, 0, 0, 0)
          
          // Verify the rating was created
          const verifyRating = await pgGet(`
            SELECT * FROM player_ratings 
            WHERE player_id = $1 AND league_id = $2
          `, player.id, sanitizedLeagueId)
          
          if (!verifyRating) {
            console.error('Rating was not created successfully')
            throw new Error('Failed to create player rating')
          }
        } else {
          db.prepare(`
            INSERT INTO player_ratings (
              id, player_id, league_id, rating, 
              games_played, wins, losses, draws
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(ratingId, player.id, sanitizedLeagueId, 1000, 0, 0, 0, 0)
          
          // Verify the rating was created
          const verifyRating = db.prepare(`
            SELECT * FROM player_ratings 
            WHERE player_id = ? AND league_id = ?
          `).get(player.id, sanitizedLeagueId)
          
          if (!verifyRating) {
            console.error('Rating was not created successfully')
            throw new Error('Failed to create player rating')
          }
        }
      } catch (error: any) {
        // If rating insert fails due to unique constraint, it's okay - rating already exists
        // This can happen in race conditions or if the rating was created elsewhere
        if (error?.code !== 'SQLITE_CONSTRAINT_UNIQUE' && 
            error?.code !== '23505' &&
            !error?.message?.includes('UNIQUE constraint') &&
            !error?.message?.includes('duplicate key')) {
          throw error
        }
        // Rating already exists, which is fine - continue with success
      }
    }
    
    // Final verification - check that everything was created correctly
    let finalCheck
    if (usePostgres) {
      finalCheck = await pgGet(`
        SELECT 
          lm.id as membership_id,
          pr.id as rating_id
        FROM league_memberships lm
        LEFT JOIN player_ratings pr ON lm.player_id = pr.player_id AND lm.league_id = pr.league_id
        WHERE lm.player_id = $1 AND lm.league_id = $2
      `, player.id, sanitizedLeagueId)
    } else {
      finalCheck = db.prepare(`
        SELECT 
          lm.id as membership_id,
          pr.id as rating_id
        FROM league_memberships lm
        LEFT JOIN player_ratings pr ON lm.player_id = pr.player_id AND lm.league_id = pr.league_id
        WHERE lm.player_id = ? AND lm.league_id = ?
      `).get(player.id, sanitizedLeagueId)
    }
    
    if (!finalCheck || !finalCheck.membership_id) {
      console.error('Final verification failed - membership not found')
      throw new Error('Failed to verify league membership')
    }
    
    if (!finalCheck.rating_id) {
      console.error('Final verification failed - rating not found')
      throw new Error('Failed to verify player rating')
    }
    
    console.log('Successfully joined league:', {
      playerId: player.id,
      playerName: player.name,
      leagueId: sanitizedLeagueId,
      membershipId: finalCheck.membership_id,
      ratingId: finalCheck.rating_id,
      database: usePostgres ? 'PostgreSQL' : 'SQLite'
    })

    // Return detailed success response for debugging
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined league',
      data: {
        playerId: player.id,
        leagueId: sanitizedLeagueId,
        membershipId: finalCheck.membership_id,
        ratingId: finalCheck.rating_id
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error joining league:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to join league' },
      { status: 500 }
    )
  }
}
