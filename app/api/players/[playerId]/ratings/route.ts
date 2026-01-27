import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/players/[playerId]/ratings
 * Fetch ratings for a specific player across all leagues
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params

    // Verify player exists
    const player = await db.player.findUnique({
      where: { id: playerId }
    })
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // Fetch ratings with league info
    const playerRatings = await db.playerRating.findMany({
      where: { playerId },
      include: {
        league: {
          select: {
            name: true,
            gameType: true
          }
        }
      }
    })

    // Transform to match expected format
    const ratings = playerRatings.map(pr => ({
      id: pr.id,
      player_id: pr.playerId,
      league_id: pr.leagueId,
      rating: pr.rating,
      games_played: pr.gamesPlayed,
      wins: pr.wins,
      losses: pr.losses,
      draws: pr.draws,
      updated_at: pr.updatedAt.toISOString(),
      league_name: pr.league.name,
      game_type: pr.league.gameType
    }))

    return NextResponse.json({ ratings })
  } catch (error: any) {
    console.error('Error fetching player ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player ratings' },
      { status: 500 }
    )
  }
}
