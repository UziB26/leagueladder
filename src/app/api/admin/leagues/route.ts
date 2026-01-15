import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

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
}
