import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { elo } from '@/lib/elo'

export const runtime = 'nodejs' // Required for Prisma on Vercel

/**
 * GET /api/matches/[matchId]
 * Get specific match details including rating updates
 * 
 * Response:
 * {
 *   match: {
 *     id: string,
 *     challenge_id: string | null,
 *     player1_id: string,
 *     player2_id: string,
 *     player1_score: number,
 *     player2_score: number,
 *     winner_id: string | null,
 *     league_id: string,
 *     status: string,
 *     played_at: string,
 *     confirmed_at: string | null,
 *     league_name: string,
 *     player1_name: string,
 *     player2_name: string,
 *     rating_updates: {
 *       player1: { old_rating, new_rating, change } | null,
 *       player2: { old_rating, new_rating, change } | null
 *     }
 *   }
 * }
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get match with player and league information using Prisma
    const match = await db.match.findUnique({
      where: { id: matchId },
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
      }
    }) as {
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
    } | null

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Get rating updates for both players
    const ratingUpdate1 = match.ratingUpdates.find(ru => ru.playerId === match.player1Id)
    const ratingUpdate2 = match.ratingUpdates.find(ru => ru.playerId === match.player2Id)

    return NextResponse.json({
      match: {
        id: match.id,
        challenge_id: match.challengeId,
        player1_id: match.player1Id,
        player2_id: match.player2Id,
        player1_score: match.player1Score,
        player2_score: match.player2Score,
        winner_id: match.winnerId,
        league_id: match.leagueId,
        status: match.status,
        played_at: match.playedAt.toISOString(),
        confirmed_at: match.confirmedAt?.toISOString(),
        league_name: match.league.name,
        player1_name: match.player1.name,
        player2_name: match.player2.name,
        rating_updates: {
          player1: ratingUpdate1 ? {
            old_rating: ratingUpdate1.oldRating,
            new_rating: ratingUpdate1.newRating,
            change: ratingUpdate1.change
          } : null,
          player2: ratingUpdate2 ? {
            old_rating: ratingUpdate2.oldRating,
            new_rating: ratingUpdate2.newRating,
            change: ratingUpdate2.change
          } : null
        }
      }
    })

  } catch (error: any) {
    console.error('Error fetching match:', error)
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/matches/[matchId]
 * Update match details (admin only - use admin routes instead)
 * 
 * Note: This endpoint is deprecated in favor of admin routes.
 * Keeping for backwards compatibility but should be restricted to admins.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Add admin check here
    // For now, allow any authenticated user (should be admin-only)
    
    const body = await request.json()
    const { player1Score, player2Score, status, winnerId } = body

    // Get existing match using Prisma
    const existingMatch = await db.match.findUnique({
      where: { id: matchId }
    })

    if (!existingMatch) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    const wasCompleted = existingMatch.status === 'completed'
    const willBeCompleted = status === 'completed' || (status === undefined && wasCompleted)

    // Build update data
    const updateData: {
      player1Score?: number
      player2Score?: number
      status?: string
      winnerId?: string | null
      confirmedAt?: Date | null
    } = {}

    if (player1Score !== undefined) {
      if (player1Score < 0) {
        return NextResponse.json(
          { error: 'Player 1 score must be non-negative' },
          { status: 400 }
        )
      }
      updateData.player1Score = player1Score
    }

    if (player2Score !== undefined) {
      if (player2Score < 0) {
        return NextResponse.json(
          { error: 'Player 2 score must be non-negative' },
          { status: 400 }
        )
      }
      updateData.player2Score = player2Score
    }

    if (status !== undefined) {
      updateData.status = status
      if (status === 'completed') {
        updateData.confirmedAt = new Date()
      }
    }

    if (winnerId !== undefined) {
      // Validate winnerId is one of the players or null
      if (winnerId !== null && winnerId !== existingMatch.player1Id && winnerId !== existingMatch.player2Id) {
        return NextResponse.json(
          { error: 'Winner ID must be one of the players or null' },
          { status: 400 }
        )
      }
      updateData.winnerId = winnerId || undefined
    } else if ((player1Score !== undefined || player2Score !== undefined) && willBeCompleted) {
      // Auto-calculate winner if scores changed and match is completed
      const finalPlayer1Score = player1Score !== undefined ? player1Score : existingMatch.player1Score
      const finalPlayer2Score = player2Score !== undefined ? player2Score : existingMatch.player2Score
      
      if (finalPlayer1Score > finalPlayer2Score) {
        updateData.winnerId = existingMatch.player1Id
      } else if (finalPlayer2Score > finalPlayer1Score) {
        updateData.winnerId = existingMatch.player2Id
      } else {
        updateData.winnerId = undefined
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // If match was completed and we're changing scores, revert then recalculate ratings
    if (wasCompleted && (player1Score !== undefined || player2Score !== undefined || status !== undefined)) {
      // Rating recalculation is handled by admin route
      // For this route, we'll just update the match
      // Admin should use the proper admin route for complex operations
    }

    // Update match using Prisma
    const updatedMatch = await db.match.update({
      where: { id: matchId },
      data: updateData,
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
    }) as {
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
    }

    // If match is now completed, calculate new ratings
    if (willBeCompleted && !wasCompleted) {
      try {
        // Use same logic as confirmation route
        const rating1 = await db.playerRating.upsert({
          where: {
            playerId_leagueId: {
              playerId: updatedMatch.player1Id,
              leagueId: updatedMatch.leagueId
            }
          },
          update: {},
          create: {
            playerId: updatedMatch.player1Id,
            leagueId: updatedMatch.leagueId,
            rating: 1000,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0
          }
        })

        const rating2 = await db.playerRating.upsert({
          where: {
            playerId_leagueId: {
              playerId: updatedMatch.player2Id,
              leagueId: updatedMatch.leagueId
            }
          },
          update: {},
          create: {
            playerId: updatedMatch.player2Id,
            leagueId: updatedMatch.leagueId,
            rating: 1000,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0
          }
        })

        const eloResult = elo.calculateForMatch(
          rating1.rating,
          rating2.rating,
          updatedMatch.player1Score,
          updatedMatch.player2Score
        )

        const isDraw = updatedMatch.player1Score === updatedMatch.player2Score
        const player1Won = updatedMatch.player1Score > updatedMatch.player2Score
        const player2Won = updatedMatch.player2Score > updatedMatch.player1Score

        await db.$transaction(async (tx) => {
          await tx.playerRating.update({
            where: { id: rating1.id },
            data: {
              rating: Math.round(eloResult.newRatingA),
              gamesPlayed: { increment: 1 },
              wins: player1Won ? { increment: 1 } : undefined,
              losses: player2Won ? { increment: 1 } : undefined,
              draws: isDraw ? { increment: 1 } : undefined,
              updatedAt: new Date()
            }
          })

          await tx.playerRating.update({
            where: { id: rating2.id },
            data: {
              rating: Math.round(eloResult.newRatingB),
              gamesPlayed: { increment: 1 },
              wins: player2Won ? { increment: 1 } : undefined,
              losses: player1Won ? { increment: 1 } : undefined,
              draws: isDraw ? { increment: 1 } : undefined,
              updatedAt: new Date()
            }
          })

          // Record rating updates - delete existing ones first to prevent duplicates
          await tx.ratingUpdate.deleteMany({
            where: { matchId: updatedMatch.id }
          })

          await tx.ratingUpdate.createMany({
            data: [
              {
                matchId: updatedMatch.id,
                playerId: updatedMatch.player1Id,
                leagueId: updatedMatch.leagueId,
                oldRating: rating1.rating,
                newRating: Math.round(eloResult.newRatingA),
                change: eloResult.changeA
              },
              {
                matchId: updatedMatch.id,
                playerId: updatedMatch.player2Id,
                leagueId: updatedMatch.leagueId,
                oldRating: rating2.rating,
                newRating: Math.round(eloResult.newRatingB),
                change: eloResult.changeB
              }
            ]
          })
        })

        // Mark challenge as completed if match is now completed and challenge exists
        if (updatedMatch.challengeId) {
          await db.challenge.updateMany({
            where: {
              id: updatedMatch.challengeId,
              status: 'accepted'
            },
            data: {
              status: 'completed'
            }
          })
        }
      } catch (error: any) {
        console.error('Error updating Elo ratings:', error)
        // Continue even if rating update fails
      }
    }

    return NextResponse.json({
      success: true,
      match: {
        id: updatedMatch.id,
        challenge_id: updatedMatch.challengeId,
        player1_id: updatedMatch.player1Id,
        player2_id: updatedMatch.player2Id,
        player1_score: updatedMatch.player1Score,
        player2_score: updatedMatch.player2Score,
        winner_id: updatedMatch.winnerId,
        league_id: updatedMatch.leagueId,
        status: updatedMatch.status,
        played_at: updatedMatch.playedAt.toISOString(),
        confirmed_at: updatedMatch.confirmedAt?.toISOString(),
        league_name: updatedMatch.league.name,
        player1_name: updatedMatch.player1.name,
        player2_name: updatedMatch.player2.name
      }
    })

  } catch (error: any) {
    console.error('Error updating match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update match' },
      { status: 500 }
    )
  }
}
