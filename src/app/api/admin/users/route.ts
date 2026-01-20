import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (request) => {
  try {
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

    // Transform to match expected format
    const formattedUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      is_admin: u.isAdmin,
      created_at: u.createdAt.toISOString()
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
})
