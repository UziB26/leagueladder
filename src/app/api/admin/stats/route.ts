import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (request) => {
  try {
    // Get all counts in parallel
    const [
      totalUsers,
      totalPlayers,
      totalLeagues,
      totalMatches,
      totalChallenges,
      completedMatches,
      pendingMatches,
      voidedMatches,
      pendingChallenges,
      acceptedChallenges,
      completedChallenges,
      activePlayersCount,
      totalRatings,
      avgRatingResult,
    ] = await Promise.all([
      db.user.count(),
      db.player.count(),
      db.league.count(),
      db.match.count(),
      db.challenge.count(),
      db.match.count({ where: { status: 'completed' } }),
      db.match.count({ where: { status: 'pending' } }),
      db.match.count({ where: { status: 'voided' } }),
      db.challenge.count({ where: { status: 'pending' } }),
      db.challenge.count({ where: { status: 'accepted' } }),
      db.challenge.count({ where: { status: 'completed' } }),
      db.leagueMembership.count({ where: { isActive: true } }),
      db.playerRating.count(),
      db.playerRating.aggregate({
        _avg: { rating: true }
      })
    ])

    // Get league stats with member and match counts
    const leagues = await db.league.findMany({
      include: {
        memberships: {
          where: { isActive: true },
          select: { playerId: true }
        },
        _count: {
          select: { matches: true }
        }
      }
    })

    const leagueStats = leagues.map(l => ({
      id: l.id,
      name: l.name,
      game_type: l.gameType,
      member_count: l.memberships.length,
      match_count: l._count.matches
    }))

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [recentMatches, recentChallenges, recentUsers] = await Promise.all([
      db.match.count({
        where: {
          playedAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      db.challenge.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      db.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      })
    ])

    // Get top players by rating
    const topPlayersData = await db.playerRating.findMany({
      take: 10,
      orderBy: { rating: 'desc' },
      include: {
        player: {
          select: {
            name: true
          }
        },
        league: {
          select: {
            name: true
          }
        }
      }
    })

    const topPlayers = topPlayersData.map(pr => ({
      name: pr.player.name,
      rating: pr.rating,
      league_name: pr.league.name,
      games_played: pr.gamesPlayed,
      wins: pr.wins,
      losses: pr.losses
    }))

    return NextResponse.json({
      // Basic counts
      totalUsers,
      totalPlayers,
      totalLeagues,
      totalMatches,
      totalChallenges,
      
      // Match statistics
      matches: {
        total: totalMatches,
        completed: completedMatches,
        pending: pendingMatches,
        voided: voidedMatches,
      },
      
      // Challenge statistics
      challenges: {
        total: totalChallenges,
        pending: pendingChallenges,
        accepted: acceptedChallenges,
        completed: completedChallenges,
      },
      
      // League statistics
      leagues: leagueStats,
      
      // Player statistics
      players: {
        total: totalPlayers,
        active: activePlayersCount,
        totalRatings,
        averageRating: Math.round(avgRatingResult._avg.rating || 1000),
      },
      
      // Recent activity
      recentActivity: {
        matches: recentMatches,
        challenges: recentChallenges,
        users: recentUsers,
      },
      
      // Top players
      topPlayers,
    })
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
})
