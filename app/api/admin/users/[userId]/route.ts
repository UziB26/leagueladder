import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { strictRateLimit } from '@/lib/rate-limit'
import { sanitizeUUID } from '@/lib/sanitize'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
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
      select: { isAdmin: true }
    })
    
    if (!adminUser || !adminUser.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: sanitizedUserId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        players: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.isAdmin,
      created_at: user.createdAt.toISOString(),
      players: user.players
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
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

    // Prevent self-deletion
    if (adminUser.id === sanitizedUserId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Get user before deletion for logging
    const targetUser = await db.user.findUnique({
      where: { id: sanitizedUserId },
      select: { email: true }
    })

    // Delete user (cascades to players, sessions, etc. via Prisma schema)
    await db.user.delete({
      where: { id: sanitizedUserId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: adminUser.id,
        action: 'delete_user',
        targetId: sanitizedUserId,
        details: JSON.stringify({ 
          deleted_user_email: targetUser?.email
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
