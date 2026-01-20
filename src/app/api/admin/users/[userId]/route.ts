import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

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

    // Delete user using Prisma (cascade will handle related records)
    await db.user.delete({
      where: { id: userId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id,
        action: 'delete_user',
        targetId: userId,
        details: JSON.stringify({ user_id: userId })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
})
