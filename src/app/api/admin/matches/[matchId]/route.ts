import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import crypto from "crypto"

export const DELETE = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ matchId: string }> }
) => {
  try {
    const { matchId } = await (context?.params || Promise.resolve({ matchId: '' }))
    const user = request.session?.user as { id?: string }
    
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete match (cascade will handle related records)
    db.prepare('DELETE FROM matches WHERE id = ?').run(matchId)

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      'delete_match',
      matchId,
      JSON.stringify({ match_id: matchId })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    )
  }
})
