import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const GET = apiHandlers.admin(async (request) => {
  try {

    const matches = db.prepare(`
      SELECT 
        m.id,
        m.player1_id,
        m.player2_id,
        m.league_id,
        m.player1_score,
        m.player2_score,
        m.status,
        m.winner_id,
        m.challenge_id,
        m.played_at,
        m.created_at,
        p1.name as player1_name,
        p2.name as player2_name,
        l.name as league_name
      FROM matches m
      LEFT JOIN players p1 ON m.player1_id = p1.id
      LEFT JOIN players p2 ON m.player2_id = p2.id
      LEFT JOIN leagues l ON m.league_id = l.id
      ORDER BY m.created_at DESC
      LIMIT 100
    `).all()

    return NextResponse.json({ matches })
  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
})
