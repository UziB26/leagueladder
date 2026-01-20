import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

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

    // Update admin status using Prisma
    await db.user.update({
      where: { id: userId },
      data: { isAdmin: is_admin }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id,
        action: is_admin ? 'grant_admin' : 'revoke_admin',
        targetId: userId,
        details: JSON.stringify({ is_admin })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating admin status:', error)
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    )
  }
})
