import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(session.user.email) as { id: string } | undefined
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get player
    const player = db.prepare('SELECT id FROM players WHERE user_id = ?').get(user.id) as { id: string } | undefined
    
    if (!player) {
      return NextResponse.json({
        stats: {
          leaguesJoined: 0,
          challengesCreated: 0,
          matchesPlayed: 0,
          matchesWon: 0,
          currentRank: null,
          totalPlayers: 0
        }
      })
    }

    // Count leagues joined
    const leaguesJoined = db.prepare(`
      SELECT COUNT(*) as count
      FROM league_memberships
      WHERE player_id = ? AND is_active = 1
    `).get(player.id) as { count: number }

    // Count challenges created
    const challengesCreated = db.prepare(`
      SELECT COUNT(*) as count
      FROM challenges
      WHERE challenger_id = ?
    `).get(player.id) as { count: number }

    // Count matches played
    const matchesPlayed = db.prepare(`
      SELECT COUNT(*) as count
      FROM matches
      WHERE (player1_id = ? OR player2_id = ?) AND status = 'completed'
    `).get(player.id, player.id) as { count: number }

    // Count matches won
    const matchesWon = db.prepare(`
      SELECT COUNT(*) as count
      FROM matches
      WHERE winner_id = ? AND status = 'completed'
    `).get(player.id) as { count: number }

    // Get current rank (best rank across all leagues)
    const ratings = db.prepare(`
      SELECT pr.rating, pr.league_id
      FROM player_ratings pr
      WHERE pr.player_id = ?
      ORDER BY pr.rating DESC
      LIMIT 1
    `).get(player.id) as { rating: number; league_id: string } | undefined

    let currentRank: number | null = null
    let totalPlayers = 0

    if (ratings) {
      // Count players with higher rating in the same league
      const rankResult = db.prepare(`
        SELECT COUNT(*) + 1 as rank
        FROM player_ratings
        WHERE league_id = ? AND rating > ?
      `).get(ratings.league_id, ratings.rating) as { rank: number }

      currentRank = rankResult.rank

      // Get total players in that league
      const totalResult = db.prepare(`
        SELECT COUNT(*) as count
        FROM player_ratings
        WHERE league_id = ?
      `).get(ratings.league_id) as { count: number }

      totalPlayers = totalResult.count
    }

    return NextResponse.json({
      stats: {
        leaguesJoined: leaguesJoined.count,
        challengesCreated: challengesCreated.count,
        matchesPlayed: matchesPlayed.count,
        matchesWon: matchesWon.count,
        currentRank,
        totalPlayers
      }
    })
  } catch (error: any) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch user stats" },
      { status: 500 }
    )
  }
}
