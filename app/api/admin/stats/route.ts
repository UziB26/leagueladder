import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

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

    // Get system statistics
    const [
      totalUsers,
      totalPlayers,
      totalLeagues,
      totalMatches,
      totalChallenges,
      matches,
      challenges,
      leagues,
      players,
      recentMatches,
      recentChallenges,
      recentUsers
    ] = await Promise.all([
      db.user.count(),
      db.player.count(),
      db.league.count(),
      db.match.count(),
      db.challenge.count(),
      db.match.groupBy({
        by: ['status'],
        _count: true
      }),
      db.challenge.groupBy({
        by: ['status'],
        _count: true
      }),
      db.league.findMany({
        include: {
          memberships: {
            where: { isActive: true }
          }
        }
      }),
      db.playerRating.findMany({
        include: {
          player: true,
          league: true
        },
        orderBy: { rating: 'desc' },
        take: 10
      }),
      db.match.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      db.challenge.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    // Format match statistics
    const matchStats = {
      total: totalMatches,
      completed: matches.find(m => m.status === 'completed')?._count || 0,
      pending: matches.find(m => m.status === 'pending_confirmation')?._count || 0,
      voided: matches.find(m => m.status === 'voided')?._count || 0
    }

    // Format challenge statistics
    const challengeStats = {
      total: totalChallenges,
      pending: challenges.find(c => c.status === 'pending')?._count || 0,
      accepted: challenges.find(c => c.status === 'accepted')?._count || 0,
      completed: challenges.find(c => c.status === 'completed')?._count || 0
    }

    // Format top players
    const topPlayers = players.map(pr => ({
      name: pr.player.name,
      league_name: pr.league.name,
      rating: pr.rating,
      wins: pr.wins,
      losses: pr.losses,
      games_played: pr.gamesPlayed
    }))

    // Format league data
    const leagueData = leagues.map(league => ({
      id: league.id,
      name: league.name,
      game_type: league.gameType,
      member_count: league.memberships.length
    }))

    return NextResponse.json({
      totalUsers,
      totalPlayers,
      totalLeagues,
      totalMatches,
      totalChallenges,
      matches: matchStats,
      challenges: challengeStats,
      leagues: leagueData,
      players: {
        total: totalPlayers,
        active: players.length,
        totalRatings: players.reduce((sum, p) => sum + p.rating, 0),
        averageRating: players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length) : 0
      },
      recentActivity: {
        matches: recentMatches,
        challenges: recentChallenges,
        users: recentUsers
      },
      topPlayers
    })
    
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
