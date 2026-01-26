import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { elo } from '@/lib/elo'

export const runtime = 'nodejs' // Required for Prisma on Vercel

/**
 * POST /api/matches/from-challenge/[challengeId]
 * Report match scores for a specific accepted challenge
 * 
 * This is a convenience endpoint that creates a match from an accepted challenge.
 * It automatically determines player1 and player2 based on the challenge.
 * 
 * Request Body:
 * {
 *   player1Score: number,      // Required: Score for the challenger
 *   player2Score: number,       // Required: Score for the challengee
 *   status?: string            // Optional: Match status (defaults to 'pending_confirmation')
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   match: { id, challengeId, player1Id, player2Id, leagueId, player1Score, player2Score, status }
 * }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) {
  try {
    const { challengeId } = await params
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user using Prisma
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get player using Prisma
    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { player1Score, player2Score, status } = body

    // Validation
    if (player1Score === undefined || player2Score === undefined) {
      return NextResponse.json(
        { error: 'Both scores are required' },
        { status: 400 }
      )
    }

    if (player1Score < 0 || player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative' },
        { status: 400 }
      )
    }

    // Get the challenge using Prisma
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId },
      include: {
        league: {
          select: {
            id: true
          }
        }
      }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      )
    }

    // Verify challenge is accepted
    if (challenge.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Challenge must be accepted before reporting a match' },
        { status: 400 }
      )
    }

    // Verify the current player is part of this challenge
    if (player.id !== challenge.challengerId && player.id !== challenge.challengeeId) {
      return NextResponse.json(
        { error: 'You can only report matches for challenges you are involved in' },
        { status: 403 }
      )
    }

    // Check if a match already exists for this challenge
    const existingMatch = await db.match.findUnique({
      where: { challengeId }
    })
    
    if (existingMatch) {
      return NextResponse.json(
        { error: 'A match already exists for this challenge' },
        { status: 400 }
      )
    }

    // Determine player1 and player2 based on challenge
    // player1Score corresponds to challenger, player2Score corresponds to challengee
    const player1Id = challenge.challengerId
    const player2Id = challenge.challengeeId

    // Matches should be created as 'pending_confirmation' to require opponent confirmation
    // Only set to 'completed' if explicitly requested (e.g., admin override)
    const matchStatus = status || 'pending_confirmation'
    
    // Determine winner_id before inserting
    const winnerId = player1Score > player2Score 
      ? player1Id 
      : player2Score > player1Score 
      ? player2Id 
      : null
    
    // Create match using Prisma
    const match = await db.match.create({
      data: {
        challengeId,
        player1Id,
        player2Id,
        leagueId: challenge.leagueId,
        player1Score,
        player2Score,
        status: matchStatus,
        winnerId: winnerId || undefined,
        reportedBy: player.id,
        confirmedAt: matchStatus === 'completed' ? new Date() : undefined
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

    // Only mark challenge as completed if match is actually completed
    // If match is pending_confirmation, challenge should stay as accepted
    if (matchStatus === 'completed') {
      await db.challenge.updateMany({
        where: {
          id: challengeId,
          status: 'accepted'
        },
        data: {
          status: 'completed'
        }
      })
    }

    // If match is completed (admin override), update Elo ratings immediately
    if (matchStatus === 'completed') {

      // Update Elo ratings immediately if match is completed directly (admin override)
      try {
        const rating1 = await db.playerRating.upsert({
          where: {
            playerId_leagueId: {
              playerId: match.player1Id,
              leagueId: match.leagueId
            }
          },
          update: {},
          create: {
            playerId: match.player1Id,
            leagueId: match.leagueId,
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
              playerId: match.player2Id,
              leagueId: match.leagueId
            }
          },
          update: {},
          create: {
            playerId: match.player2Id,
            leagueId: match.leagueId,
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
          player1Score,
          player2Score
        )

        const isDraw = player1Score === player2Score
        const player1Won = player1Score > player2Score
        const player2Won = player2Score > player1Score

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

          await tx.ratingUpdate.createMany({
            data: [
              {
                matchId: match.id,
                playerId: match.player1Id,
                leagueId: match.leagueId,
                oldRating: rating1.rating,
                newRating: Math.round(eloResult.newRatingA),
                change: eloResult.changeA
              },
              {
                matchId: match.id,
                playerId: match.player2Id,
                leagueId: match.leagueId,
                oldRating: rating2.rating,
                newRating: Math.round(eloResult.newRatingB),
                change: eloResult.changeB
              }
            ]
          })
        })
      } catch (error: any) {
        console.error('Error updating Elo ratings:', error)
        // Don't fail the request if rating update fails, but log it
      }
    }

    return NextResponse.json({
      success: true,
      match: {
        id: match.id,
        challengeId,
        player1Id,
        player2Id,
        leagueId: challenge.leagueId,
        player1Score,
        player2Score,
        status: matchStatus,
        player1_name: match.player1.name,
        player2_name: match.player2.name,
        league_name: match.league.name
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating match from challenge:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create match from challenge' },
      { status: 500 }
    )
  }
}
