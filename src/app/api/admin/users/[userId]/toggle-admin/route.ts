import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
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

    const { userId } = await params
    const { is_admin } = await request.json()

    // Prevent revoking your own admin status
    if (userId === user.id && !is_admin) {
      return NextResponse.json(
        { error: "Cannot revoke your own admin status" },
        { status: 400 }
      )
    }

    // Update admin status
    db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(is_admin ? 1 : 0, userId)

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      is_admin ? 'grant_admin' : 'revoke_admin',
      userId,
      JSON.stringify({ is_admin })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating admin status:', error)
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    )
  }
}
