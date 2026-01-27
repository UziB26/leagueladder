import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await strictRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { userId } = await params
    const sanitizedUserId = sanitizeUUID(userId)
    if (!sanitizedUserId) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const adminUser = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true }
    })
    
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { is_admin } = body

    // Get current user status
    const targetUser = await db.user.findUnique({
      where: { id: sanitizedUserId },
      select: { isAdmin: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update admin status
    const updatedUser = await db.user.update({
      where: { id: sanitizedUserId },
      data: { isAdmin: is_admin ?? !targetUser.isAdmin },
      select: {
        id: true,
        email: true,
        isAdmin: true
      }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'toggle_admin',
        targetId: sanitizedUserId,
        details: JSON.stringify({ 
          previous_status: targetUser.isAdmin,
          new_status: updatedUser.isAdmin,
          target_email: updatedUser.email
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: `Admin status ${updatedUser.isAdmin ? 'granted' : 'revoked'}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        is_admin: updatedUser.isAdmin
      }
    })
    
  } catch (error) {
    console.error('Error toggling admin status:', error)
    return NextResponse.json(
      { error: 'Failed to update admin status' },
      { status: 500 }
    )
  }
}
