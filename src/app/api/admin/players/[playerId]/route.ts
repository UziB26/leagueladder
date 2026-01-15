import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, DatabaseTransaction } from "@/lib/db"
import { sanitizeUUID, sanitizeString } from "@/lib/sanitize"
import crypto from "crypto"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { playerId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    const player = db.prepare(`
      SELECT 
        p.*,
        u.email as user_email,
        u.is_admin,
        COUNT(DISTINCT lm.league_id) as league_count,
        COUNT(DISTINCT m.id) as match_count
      FROM players p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN league_memberships lm ON p.id = lm.player_id AND lm.is_active = 1
      LEFT JOIN matches m ON (m.player1_id = p.id OR m.player2_id = p.id)
      WHERE p.id = ?
      GROUP BY p.id
    `).get(sanitizedPlayerId)

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Get player ratings
    const ratings = db.prepare(`
      SELECT 
        pr.*,
        l.name as league_name,
        l.game_type
      FROM player_ratings pr
      JOIN leagues l ON pr.league_id = l.id
      WHERE pr.player_id = ?
    `).all(sanitizedPlayerId)

    // Get recent matches
    const matches = db.prepare(`
      SELECT 
        m.*,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
      ORDER BY m.played_at DESC
      LIMIT 10
    `).all(sanitizedPlayerId, sanitizedPlayerId)

    return NextResponse.json({
      player,
      ratings,
      matches
    })
  } catch (error: any) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { playerId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    const body = await request.json()
    const { name, email } = body

    // Validate player exists
    const existingPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(sanitizedPlayerId)
    if (!existingPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Update player
    DatabaseTransaction.execute((tx) => {
      const updates: string[] = []
      const values: any[] = []

      if (name !== undefined) {
        const sanitizedName = sanitizeString(name)
        if (sanitizedName && sanitizedName.length > 0) {
          updates.push('name = ?')
          values.push(sanitizedName)
        }
      }

      if (email !== undefined) {
        // Email validation would go here
        updates.push('email = ?')
        values.push(email)
      }

      if (updates.length === 0) {
        throw new Error('No fields to update')
      }

      values.push(sanitizedPlayerId)
      tx.run(
        db.prepare(`UPDATE players SET ${updates.join(', ')} WHERE id = ?`),
        ...values
      )
    })

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      'update_player',
      sanitizedPlayerId,
      JSON.stringify({ name, email })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: error.message || "Failed to update player" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = session.user as { id?: string; is_admin?: boolean }
    if (!user.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { playerId } = await params
    const sanitizedPlayerId = sanitizeUUID(playerId)
    if (!sanitizedPlayerId) {
      return NextResponse.json({ error: "Invalid player ID" }, { status: 400 })
    }

    // Get player info before deletion
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(sanitizedPlayerId)
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Delete player (cascade will handle related records)
    db.prepare('DELETE FROM players WHERE id = ?').run(sanitizedPlayerId)

    // Log admin action
    const actionId = crypto.randomUUID()
    db.prepare(`
      INSERT INTO admin_actions (id, user_id, action, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      actionId,
      user.id,
      'delete_player',
      sanitizedPlayerId,
      JSON.stringify({ player_id: sanitizedPlayerId })
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    )
  }
}
