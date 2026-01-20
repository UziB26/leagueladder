import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (request) => {
  try {
    const players = await db.player.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            isAdmin: true
          }
        },
        memberships: {
          where: { isActive: true },
          select: { leagueId: true }
        },
        _count: {
          select: {
            matchesAsPlayer1: true,
            matchesAsPlayer2: true
          }
        }
      }
    })

    // Transform to match expected format
    const formattedPlayers = players.map(p => ({
      id: p.id,
      user_id: p.userId,
      name: p.name,
      email: p.email,
      avatar: p.avatar,
      created_at: p.createdAt.toISOString(),
      user_email: p.user.email,
      is_admin: p.user.isAdmin,
      league_count: p.memberships.length,
      match_count: p._count.matchesAsPlayer1 + p._count.matchesAsPlayer2
    }))

    return NextResponse.json({ players: formattedPlayers })
  } catch (error: any) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    )
  }
})
