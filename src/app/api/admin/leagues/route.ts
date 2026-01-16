import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const GET = apiHandlers.admin(async (request) => {
  try {

    const leagues = db.prepare(`
      SELECT 
        l.id,
        l.name,
        l.game_type,
        l.created_at,
        COUNT(DISTINCT lm.player_id) as member_count
      FROM leagues l
      LEFT JOIN league_memberships lm ON l.id = lm.league_id
      GROUP BY l.id, l.name, l.game_type, l.created_at
      ORDER BY l.created_at DESC
    `).all()

    return NextResponse.json({ leagues })
  } catch (error: any) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json(
      { error: "Failed to fetch leagues" },
      { status: 500 }
    )
  }
})
