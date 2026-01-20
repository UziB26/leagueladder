import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (request) => {
  try {
    const matches = await db.match.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        player1: {
          select: {
            name: true
          }
        },
        player2: {
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

    // Transform to match expected format
    const formattedMatches = matches.map(m => ({
      id: m.id,
      player1_id: m.player1Id,
      player2_id: m.player2Id,
      league_id: m.leagueId,
      player1_score: m.player1Score,
      player2_score: m.player2Score,
      status: m.status,
      winner_id: m.winnerId,
      challenge_id: m.challengeId,
      played_at: m.playedAt.toISOString(),
      created_at: m.createdAt.toISOString(),
      player1_name: m.player1.name,
      player2_name: m.player2.name,
      league_name: m.league.name
    }))

    return NextResponse.json({ matches: formattedMatches })
  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
})
