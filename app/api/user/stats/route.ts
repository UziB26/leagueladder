import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

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
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get player
    const player = await db.player.findFirst({
      where: { userId: user.id },
      select: { id: true }
    })
    
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

    // Count all stats in parallel
    const [leaguesJoined, challengesCreated, matchesPlayed, matchesWon, bestRating] = await Promise.all([
      // Count leagues joined
      db.leagueMembership.count({
        where: {
          playerId: player.id,
          isActive: true
        }
      }),
      // Count challenges created
      db.challenge.count({
        where: {
          challengerId: player.id
        }
      }),
      // Count matches played
      db.match.count({
        where: {
          OR: [
            { player1Id: player.id },
            { player2Id: player.id }
          ],
          status: 'completed'
        }
      }),
      // Count matches won
      db.match.count({
        where: {
          winnerId: player.id,
          status: 'completed'
        }
      }),
      // Get best rating across all leagues
      db.playerRating.findFirst({
        where: {
          playerId: player.id
        },
        orderBy: {
          rating: 'desc'
        },
        select: {
          rating: true,
          leagueId: true
        }
      })
    ])

    let currentRank: number | null = null
    let totalPlayers = 0

    if (bestRating) {
      // Count players with higher rating in the same league
      const playersWithHigherRating = await db.playerRating.count({
        where: {
          leagueId: bestRating.leagueId,
          rating: {
            gt: bestRating.rating
          }
        }
      })

      currentRank = playersWithHigherRating + 1

      // Get total players in that league
      totalPlayers = await db.playerRating.count({
        where: {
          leagueId: bestRating.leagueId
        }
      })
    }

    return NextResponse.json({
      stats: {
        leaguesJoined,
        challengesCreated,
        matchesPlayed,
        matchesWon,
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
