import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

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
}
