import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const GET = apiHandlers.admin(async (request) => {
  try {

    // Basic counts
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
    const totalPlayers = db.prepare('SELECT COUNT(*) as count FROM players').get() as { count: number }
    const totalLeagues = db.prepare('SELECT COUNT(*) as count FROM leagues').get() as { count: number }
    const totalMatches = db.prepare('SELECT COUNT(*) as count FROM matches').get() as { count: number }
    const totalChallenges = db.prepare('SELECT COUNT(*) as count FROM challenges').get() as { count: number }

    // Match statistics
    const completedMatches = db.prepare("SELECT COUNT(*) as count FROM matches WHERE status = 'completed'").get() as { count: number }
    const pendingMatches = db.prepare("SELECT COUNT(*) as count FROM matches WHERE status = 'pending'").get() as { count: number }
    const voidedMatches = db.prepare("SELECT COUNT(*) as count FROM matches WHERE status = 'voided'").get() as { count: number }

    // Challenge statistics
    const pendingChallenges = db.prepare("SELECT COUNT(*) as count FROM challenges WHERE status = 'pending'").get() as { count: number }
    const acceptedChallenges = db.prepare("SELECT COUNT(*) as count FROM challenges WHERE status = 'accepted'").get() as { count: number }
    const completedChallenges = db.prepare("SELECT COUNT(*) as count FROM challenges WHERE status = 'completed'").get() as { count: number }

    // League statistics
    const leagueStats = db.prepare(`
      SELECT 
        l.id,
        l.name,
        l.game_type,
        COUNT(DISTINCT lm.player_id) as member_count,
        COUNT(DISTINCT m.id) as match_count
      FROM leagues l
      LEFT JOIN league_memberships lm ON l.id = lm.league_id AND lm.is_active = 1
      LEFT JOIN matches m ON l.id = m.league_id
      GROUP BY l.id
    `).all() as any[]

    // Player statistics
    const activePlayers = db.prepare(`
      SELECT COUNT(DISTINCT player_id) as count 
      FROM league_memberships 
      WHERE is_active = 1
    `).get() as { count: number }

    const totalRatings = db.prepare('SELECT COUNT(*) as count FROM player_ratings').get() as { count: number }
    const avgRating = db.prepare('SELECT AVG(rating) as avg FROM player_ratings').get() as { avg: number }

    // Recent activity (last 7 days)
    const recentMatches = db.prepare(`
      SELECT COUNT(*) as count 
      FROM matches 
      WHERE played_at >= datetime('now', '-7 days')
    `).get() as { count: number }

    const recentChallenges = db.prepare(`
      SELECT COUNT(*) as count 
      FROM challenges 
      WHERE created_at >= datetime('now', '-7 days')
    `).get() as { count: number }

    const recentUsers = db.prepare(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= datetime('now', '-7 days')
    `).get() as { count: number }

    // Top players by rating
    const topPlayers = db.prepare(`
      SELECT 
        p.name,
        pr.rating,
        l.name as league_name,
        pr.games_played,
        pr.wins,
        pr.losses
      FROM player_ratings pr
      JOIN players p ON pr.player_id = p.id
      JOIN leagues l ON pr.league_id = l.id
      ORDER BY pr.rating DESC
      LIMIT 10
    `).all() as any[]

    return NextResponse.json({
      // Basic counts
      totalUsers: totalUsers.count,
      totalPlayers: totalPlayers.count,
      totalLeagues: totalLeagues.count,
      totalMatches: totalMatches.count,
      totalChallenges: totalChallenges.count,
      
      // Match statistics
      matches: {
        total: totalMatches.count,
        completed: completedMatches.count,
        pending: pendingMatches.count,
        voided: voidedMatches.count,
      },
      
      // Challenge statistics
      challenges: {
        total: totalChallenges.count,
        pending: pendingChallenges.count,
        accepted: acceptedChallenges.count,
        completed: completedChallenges.count,
      },
      
      // League statistics
      leagues: leagueStats,
      
      // Player statistics
      players: {
        total: totalPlayers.count,
        active: activePlayers.count,
        totalRatings: totalRatings.count,
        averageRating: Math.round(avgRating.avg || 1000),
      },
      
      // Recent activity
      recentActivity: {
        matches: recentMatches.count,
        challenges: recentChallenges.count,
        users: recentUsers.count,
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
