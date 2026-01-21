import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin status
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true }
    })
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get all users
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true
      }
    })

    // Format users to match expected format
    const formattedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      is_admin: u.isAdmin,
      created_at: u.createdAt.toISOString()
    }))
    
    return NextResponse.json({ users: formattedUsers })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
