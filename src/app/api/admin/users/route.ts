import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const GET = apiHandlers.admin(async (request) => {
  try {
    const users = db.prepare(`
      SELECT id, email, name, is_admin, created_at
      FROM users
      ORDER BY created_at DESC
    `).all()

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
})
