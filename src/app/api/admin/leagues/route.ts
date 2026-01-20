import { NextResponse } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (request) => {
  try {
    const leagues = await db.league.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            memberships: true
          }
        }
      }
    })

    // Transform to match expected format
    const formattedLeagues = leagues.map(l => ({
      id: l.id,
      name: l.name,
      game_type: l.gameType,
      created_at: l.createdAt.toISOString(),
      member_count: l._count.memberships
    }))

    return NextResponse.json({ leagues: formattedLeagues })
  } catch (error: any) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json(
      { error: "Failed to fetch leagues" },
      { status: 500 }
    )
  }
})
