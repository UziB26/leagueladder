import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { apiRateLimit } from '@/lib/rate-limit'

/**
 * Database Cleanup Endpoint
 * Clears all user data, challenges, matches, and ratings
 * Keeps only the league structure
 * 
 * GET /api/admin/db/cleanup - Preview what will be deleted (dry run)
 * POST /api/admin/db/cleanup - Actually perform the cleanup
 * 
 * ⚠️ WARNING: POST will delete ALL user data, players, challenges, matches, and ratings!
 * Only leagues will be preserved.
 */
export const runtime = 'nodejs' // Required for Prisma on Vercel

/**
 * GET - Preview what will be deleted (dry run)
 */
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Count records that will be deleted (dry run)
    const counts = {
      rating_updates: await db.ratingUpdate.count(),
      match_confirmations: await db.matchConfirmation.count(),
      matches: await db.match.count(),
      challenges: await db.challenge.count(),
      player_ratings: await db.playerRating.count(),
      league_memberships: await db.leagueMembership.count(),
      players: await db.player.count(),
      admin_actions: await db.adminAction.count(),
      sessions: await db.session.count(),
      accounts: await db.account.count(),
      users: await db.user.count()
    }

    const leagues = await db.league.findMany({
      select: { id: true, name: true, gameType: true }
    })

    const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0)

    return NextResponse.json({
      dry_run: true,
      message: 'This is a preview. Use POST to actually delete the data.',
      summary: {
        total_records_to_delete: totalRecords,
        leagues_to_preserve: leagues.length
      },
      counts,
      leagues_to_preserve: leagues.map(l => ({
        id: l.id,
        name: l.name,
        game_type: l.gameType
      })),
      warning: '⚠️ This will delete ALL user data, players, challenges, matches, and ratings. Only leagues will be preserved.'
    })

  } catch (error: any) {
    console.error('Error during database cleanup preview:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to preview cleanup',
        details: error?.stack
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Actually perform the cleanup
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Check authentication
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const results: Record<string, { deleted: number; status: string }> = {}

    // Delete in order to respect foreign key constraints
    // Start with dependent data, then work up to users

    // 1. Delete Rating Updates (depends on matches, players, leagues)
    try {
      const ratingUpdates = await db.ratingUpdate.deleteMany({})
      results.rating_updates = {
        deleted: ratingUpdates.count,
        status: 'success'
      }
    } catch (error: any) {
      results.rating_updates = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 2. Delete Match Confirmations (depends on matches, players)
    try {
      const matchConfirmations = await db.matchConfirmation.deleteMany({})
      results.match_confirmations = {
        deleted: matchConfirmations.count,
        status: 'success'
      }
    } catch (error: any) {
      results.match_confirmations = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 3. Delete Matches (depends on players, leagues, challenges)
    try {
      const matches = await db.match.deleteMany({})
      results.matches = {
        deleted: matches.count,
        status: 'success'
      }
    } catch (error: any) {
      results.matches = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 4. Delete Challenges (depends on players, leagues)
    try {
      const challenges = await db.challenge.deleteMany({})
      results.challenges = {
        deleted: challenges.count,
        status: 'success'
      }
    } catch (error: any) {
      results.challenges = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 5. Delete Player Ratings (depends on players, leagues)
    try {
      const playerRatings = await db.playerRating.deleteMany({})
      results.player_ratings = {
        deleted: playerRatings.count,
        status: 'success'
      }
    } catch (error: any) {
      results.player_ratings = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 6. Delete League Memberships (depends on players, leagues)
    try {
      const leagueMemberships = await db.leagueMembership.deleteMany({})
      results.league_memberships = {
        deleted: leagueMemberships.count,
        status: 'success'
      }
    } catch (error: any) {
      results.league_memberships = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 7. Delete Players (depends on users)
    // This will cascade delete related data via Prisma relations
    try {
      const players = await db.player.deleteMany({})
      results.players = {
        deleted: players.count,
        status: 'success'
      }
    } catch (error: any) {
      results.players = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 8. Delete Admin Actions (depends on users)
    try {
      const adminActions = await db.adminAction.deleteMany({})
      results.admin_actions = {
        deleted: adminActions.count,
        status: 'success'
      }
    } catch (error: any) {
      results.admin_actions = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 9. Delete Sessions (depends on users)
    try {
      const sessions = await db.session.deleteMany({})
      results.sessions = {
        deleted: sessions.count,
        status: 'success'
      }
    } catch (error: any) {
      results.sessions = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 10. Delete Accounts (depends on users)
    try {
      const accounts = await db.account.deleteMany({})
      results.accounts = {
        deleted: accounts.count,
        status: 'success'
      }
    } catch (error: any) {
      results.accounts = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // 11. Delete Users (this will cascade delete players, but we already deleted them)
    // We'll keep admin users if you want, or delete all
    // For now, delete all users - you can recreate admin account
    try {
      const users = await db.user.deleteMany({})
      results.users = {
        deleted: users.count,
        status: 'success'
      }
    } catch (error: any) {
      results.users = {
        deleted: 0,
        status: `error: ${error.message}`
      }
    }

    // Verify leagues are still there
    const remainingLeagues = await db.league.findMany({
      select: { id: true, name: true, gameType: true }
    })

    const totalDeleted = Object.values(results).reduce((sum, r) => sum + r.deleted, 0)

    return NextResponse.json({
      success: true,
      message: 'Database cleanup completed successfully',
      summary: {
        total_records_deleted: totalDeleted,
        leagues_preserved: remainingLeagues.length
      },
      results,
      leagues_preserved: remainingLeagues.map(l => ({
        id: l.id,
        name: l.name,
        game_type: l.gameType
      })),
      note: 'All user data, players, challenges, matches, and ratings have been deleted. Leagues have been preserved.'
    })

  } catch (error: any) {
    console.error('Error during database cleanup:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to cleanup database',
        details: error?.stack
      },
      { status: 500 }
    )
  }
}
