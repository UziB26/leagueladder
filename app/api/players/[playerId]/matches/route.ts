import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

interface MatchWithRatings {
  id: string
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  winner_id: string | null
  league_name: string
  played_at: string
  status: string
  rating_updates?: {
    player1?: {
      old_rating: number
      new_rating: number
      change: number
    }
    player2?: {
      old_rating: number
      new_rating: number
      change: number
    }
  }
  admin_adjustments?: {
    rating_adjusted?: boolean
    stats_adjusted?: boolean
    match_score_edited?: boolean
  }
}

/**
 * GET /api/players/[playerId]/matches
 * Fetch match history for a specific player
 * 
 * Query Parameters:
 *   limit: number (optional, default: 50)
 * 
 * Response:
 * {
 *   matches: MatchWithRatings[]
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)

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

    // Fetch completed matches for this player (excluding voided matches)
    const matches = await db.match.findMany({
      where: {
        OR: [
          { player1Id: playerId },
          { player2Id: playerId }
        ],
        status: {
          not: 'voided'
        }
      },
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
        },
        ratingUpdates: {
          select: {
            playerId: true,
            oldRating: true,
            newRating: true,
            change: true
          }
        }
      },
      orderBy: {
        playedAt: 'desc'
      },
      take: limit
    }) as Array<{
      id: string
      challengeId: string | null
      player1Id: string
      player2Id: string
      leagueId: string
      player1Score: number
      player2Score: number
      winnerId: string | null
      status: string
      reportedBy: string | null
      playedAt: Date
      confirmedAt: Date | null
      league: { name: string }
      player1: { name: string }
      player2: { name: string }
      ratingUpdates: Array<{
        playerId: string
        oldRating: number
        newRating: number
        change: number
      }>
    }>

    // Get all admin actions for this player and their matches
    const matchIds = matches.map(m => m.id)
    const matchIdsSet = new Set(matchIds)
    
    // Fetch all relevant admin actions
    const allAdminActions = await db.adminAction.findMany({
      where: {
        OR: [
          // Rating adjustments for this player
          {
            action: 'adjust_rating',
            targetId: playerId
          },
          // Stats adjustments for this player
          {
            action: 'adjust_stats',
            targetId: playerId
          },
          // Match score edits (we'll filter by matchIds in memory)
          {
            action: 'edit_match_score'
          }
        ]
      }
    })
    
    // Filter match score edits to only those for this player's matches
    const adminActions = allAdminActions.filter(action => {
      if (action.action === 'edit_match_score') {
        return action.targetId && matchIdsSet.has(action.targetId)
      }
      return true // adjust_rating and adjust_stats are already filtered by playerId
    })

    // Create maps for quick lookup
    const ratingAdjustmentsByPlayer = new Map<string, boolean>()
    const statsAdjustmentsByPlayer = new Map<string, boolean>()
    const scoreEditsByMatch = new Map<string, boolean>()

    adminActions.forEach(action => {
      if (action.action === 'adjust_rating' && action.targetId === playerId) {
        ratingAdjustmentsByPlayer.set(playerId, true)
      } else if (action.action === 'adjust_stats' && action.targetId === playerId) {
        statsAdjustmentsByPlayer.set(playerId, true)
      } else if (action.action === 'edit_match_score' && action.targetId) {
        scoreEditsByMatch.set(action.targetId, true)
      }
    })

    // Transform matches with rating updates and admin adjustments
    const matchesWithRatings: MatchWithRatings[] = matches.map((match) => {
      const player1Update = match.ratingUpdates.find(ru => ru.playerId === match.player1Id)
      const player2Update = match.ratingUpdates.find(ru => ru.playerId === match.player2Id)

      // Check if this player had rating/stats adjusted (for any league, not just this match's league)
      const hasRatingAdjustment = ratingAdjustmentsByPlayer.has(playerId)
      const hasStatsAdjustment = statsAdjustmentsByPlayer.has(playerId)
      const hasScoreEdit = scoreEditsByMatch.has(match.id)

      return {
        id: match.id,
        player1_id: match.player1Id,
        player2_id: match.player2Id,
        player1_name: match.player1.name,
        player2_name: match.player2.name,
        player1_score: match.player1Score,
        player2_score: match.player2Score,
        winner_id: match.winnerId,
        league_name: match.league.name,
        played_at: match.playedAt?.toISOString() || '',
        status: match.status,
        rating_updates: {
          player1: player1Update ? {
            old_rating: player1Update.oldRating,
            new_rating: player1Update.newRating,
            change: player1Update.change
          } : undefined,
          player2: player2Update ? {
            old_rating: player2Update.oldRating,
            new_rating: player2Update.newRating,
            change: player2Update.change
          } : undefined
        },
        admin_adjustments: {
          rating_adjusted: hasRatingAdjustment,
          stats_adjusted: hasStatsAdjustment,
          match_score_edited: hasScoreEdit
        }
      }
    })

    return NextResponse.json({ matches: matchesWithRatings })
  } catch (error: any) {
    console.error('Error fetching player match history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match history' },
      { status: 500 }
    )
  }
}
