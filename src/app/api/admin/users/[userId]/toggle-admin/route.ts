import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import crypto from "crypto"

export const POST = apiHandlers.admin(async (
  request: NextRequest & { session?: any; validatedData?: any },
  context?: { params?: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await (context?.params || Promise.resolve({ userId: '' }))
    const { is_admin } = request.validatedData || await request.json()
    const user = request.session?.user as { id?: string }

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
})
