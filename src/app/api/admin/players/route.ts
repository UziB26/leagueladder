import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const GET = apiHandlers.admin(async (request) => {
  try {

    const players = db.prepare(`
      SELECT 
        p.id,
        p.user_id,
        p.name,
        p.email,
        p.avatar,
        p.created_at,
        u.email as user_email,
        u.is_admin,
        COUNT(DISTINCT lm.league_id) as league_count,
        COUNT(DISTINCT m.id) as match_count
      FROM players p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN league_memberships lm ON p.id = lm.player_id AND lm.is_active = 1
      LEFT JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all()

    return NextResponse.json({ players })
  } catch (error: any) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    )
  }
})
