import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

/**
 * GET /api/leaderboard/[leagueId]
 * Fetch leaderboard for a specific league
 * 
 * Response:
 * {
 *   players: LeaderboardEntry[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  try {
    const { leagueId } = await params
    
    // Check if league exists
    const league = await db.league.findUnique({
      where: { id: leagueId }
    })
    
    if (!league) {
      console.error('League not found:', leagueId)
      return NextResponse.json({ players: [] })
    }
    
    // Fetch leaderboard using Prisma
    const playerRatings = await db.playerRating.findMany({
      where: { leagueId },
      include: {
        player: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { rating: 'desc' },
      take: 100
    }) as Array<{
      id: string
      updatedAt: Date
      leagueId: string
      playerId: string
      rating: number
      gamesPlayed: number
      wins: number
      losses: number
      draws: number
      player: {
        id: string
        name: string
        email: string | null
        avatar: string | null
      }
    }>
    
    // Transform to match expected format
    const players = playerRatings.map(pr => ({
      id: pr.player.id,
      name: pr.player.name,
      email: pr.player.email,
      avatar: pr.player.avatar,
      rating: pr.rating,
      games_played: pr.gamesPlayed,
      wins: pr.wins,
      losses: pr.losses,
      draws: pr.draws
    }))
    
    console.log(`Leaderboard query returned ${players.length} players for league ${leagueId}`)

    return NextResponse.json({ players })
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
