import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import crypto from "crypto"

export const DELETE = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await (context?.params || Promise.resolve({ userId: '' }))
    const user = request.session?.user as { id?: string }

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent deleting yourself
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      )
    }

    // Delete user (cascade will handle related records)
    db.prepare('DELETE FROM users WHERE id = ?').run(userId)

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      'delete_user',
      userId,
      JSON.stringify({ user_id: userId })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
})
