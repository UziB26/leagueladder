import { NextResponse, NextRequest } from "next/server"
import { apiHandlers } from "@/lib/api-helpers"
import { db } from "@/lib/db"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"

export const runtime = 'nodejs' // Required for Prisma on Vercel

export const GET = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ playerId: string }> }
) => {
  try {
    const { playerId } = await (context?.params || Promise.resolve({ playerId: '' }))
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    const player = await db.player.findUnique({
      where: { id: sanitizedPlayerId },
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
        },
        playerRatings: {
          include: {
            league: {
              select: {
                name: true,
                gameType: true
              }
            }
          }
        }
      }
    })

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get recent matches
    const matches = await db.match.findMany({
      where: {
        OR: [
          { player1Id: sanitizedPlayerId },
          { player2Id: sanitizedPlayerId }
        ]
      },
      take: 10,
      orderBy: { playedAt: 'desc' },
      include: {
        league: {
          select: {
            name: true
          }
        },
        player1: {
          select: {
            name: true
          }
        },
        player2: {
          select: {
            name: true
          }
        }
      }
    })

    // Transform to match expected format
    const formattedPlayer = {
      ...player,
      user_email: player.user.email,
      is_admin: player.user.isAdmin,
      league_count: player.memberships.length,
      match_count: player._count.matchesAsPlayer1 + player._count.matchesAsPlayer2
    }

    const formattedRatings = player.playerRatings.map(pr => ({
      ...pr,
      league_name: pr.league.name,
      game_type: pr.league.gameType
    }))

    const formattedMatches = matches.map(m => ({
      ...m,
      league_name: m.league.name,
      player1_name: m.player1.name,
      player2_name: m.player2.name
    }))

    return NextResponse.json({
      player: formattedPlayer,
      ratings: formattedRatings,
      matches: formattedMatches
    })
  } catch (error: any) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    )
  }
})

export const PUT = apiHandlers.admin(async (
  request: NextRequest & { session?: any; validatedData?: any },
  context?: { params?: Promise<{ playerId: string }> }
) => {
  try {
    const { playerId } = await (context?.params || Promise.resolve({ playerId: '' }))
    const user = request.session?.user as { id?: string }
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    const { name, email } = request.validatedData || await request.json()

    // Validate player exists
    const existingPlayer = await db.player.findUnique({
      where: { id: sanitizedPlayerId }
    })
    
    if (!existingPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Build update data
    const updateData: { name?: string; email?: string } = {}
    if (name !== undefined) {
      const sanitizedName = sanitizeString(name)
      if (sanitizedName && sanitizedName.length > 0) {
        updateData.name = sanitizedName
      }
    }

    if (email !== undefined) {
      updateData.email = email
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Update player using Prisma
    await db.player.update({
      where: { id: sanitizedPlayerId },
      data: updateData
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id!,
        action: 'update_player',
        targetId: sanitizedPlayerId,
        details: JSON.stringify({ name, email })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: error.message || "Failed to update player" },
      { status: 500 }
    )
  }
})

export const DELETE = apiHandlers.admin(async (
  request: NextRequest & { session?: any },
  context?: { params?: Promise<{ playerId: string }> }
) => {
  try {
    const { playerId } = await (context?.params || Promise.resolve({ playerId: '' }))
    const user = request.session?.user as { id?: string }
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    // Get player info before deletion
    const player = await db.player.findUnique({
      where: { id: sanitizedPlayerId }
    })
    
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Delete player using Prisma (cascade will handle related records)
    await db.player.delete({
      where: { id: sanitizedPlayerId }
    })

    // Log admin action
    await db.adminAction.create({
      data: {
        userId: user.id!,
        action: 'delete_player',
        targetId: sanitizedPlayerId,
        details: JSON.stringify({ player_id: sanitizedPlayerId })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    )
  }
})
