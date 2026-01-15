import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { matchId } = await params

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
}
