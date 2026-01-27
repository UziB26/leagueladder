import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { elo } from '@/lib/elo'

export const runtime = 'nodejs' // Required for Prisma on Vercel

// Helper function to update Elo ratings after match completion
async function updateEloRatings(matchId: string) {
  const match = await db.match.findUnique({
    where: { id: matchId },
    include: {
      player1: true,
      player2: true,
      league: true
    }
  })

  if (!match || match.status !== 'completed') {
    return
  }

  // Get or create player ratings
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

  // Calculate new Elo ratings
  const result = elo.calculateForMatch(
    rating1.rating,
    rating2.rating,
    match.player1Score,
    match.player2Score
  )

  // Update ratings in a transaction
  await db.$transaction(async (tx) => {
    // Update player ratings
    await tx.playerRating.update({
      where: { id: rating1.id },
      data: {
        rating: Math.round(result.newRatingA),
        updatedAt: new Date()
      }
    })

    await tx.playerRating.update({
      where: { id: rating2.id },
      data: {
        rating: Math.round(result.newRatingB),
        updatedAt: new Date()
      }
    })

    // Record rating updates - check if they already exist first to prevent duplicates
    const existingUpdate1 = await tx.ratingUpdate.findFirst({
      where: {
        matchId: match.id,
        playerId: match.player1Id
      }
    })
    
    const existingUpdate2 = await tx.ratingUpdate.findFirst({
      where: {
        matchId: match.id,
        playerId: match.player2Id
      }
    })

    if (!existingUpdate1) {
      await tx.ratingUpdate.create({
        data: {
          matchId: match.id,
          playerId: match.player1Id,
          leagueId: match.leagueId,
          oldRating: rating1.rating,
          newRating: Math.round(result.newRatingA),
          change: result.changeA
        }
      })
    }

    if (!existingUpdate2) {
      await tx.ratingUpdate.create({
        data: {
          matchId: match.id,
          playerId: match.player2Id,
          leagueId: match.leagueId,
          oldRating: rating2.rating,
          newRating: Math.round(result.newRatingB),
          change: result.changeB
        }
      })
    }

    // Update player stats (wins/losses/draws)
    if (match.winnerId === match.player1Id) {
      await tx.playerRating.update({
        where: { id: rating1.id },
        data: {
          wins: { increment: 1 },
          gamesPlayed: { increment: 1 }
        }
      })
      await tx.playerRating.update({
        where: { id: rating2.id },
        data: {
          losses: { increment: 1 },
          gamesPlayed: { increment: 1 }
        }
      })
    } else if (match.winnerId === match.player2Id) {
      await tx.playerRating.update({
        where: { id: rating2.id },
        data: {
          wins: { increment: 1 },
          gamesPlayed: { increment: 1 }
        }
      })
      await tx.playerRating.update({
        where: { id: rating1.id },
        data: {
          losses: { increment: 1 },
          gamesPlayed: { increment: 1 }
        }
      })
    } else {
      // Draw
      await tx.playerRating.updateMany({
        where: {
          id: { in: [rating1.id, rating2.id] }
        },
        data: {
          draws: { increment: 1 },
          gamesPlayed: { increment: 1 }
        }
      })
    }
  })
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

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
    const { challengeId, player1Id, player2Id, leagueId, player1Score, player2Score, status } = body

    // Validation
    if (!player1Id || !player2Id || !leagueId) {
      return NextResponse.json(
        { error: 'Player IDs and league ID are required' },
        { status: 400 }
      )
    }

    if (player1Score === undefined || player2Score === undefined) {
      return NextResponse.json(
        { error: 'Scores are required' },
        { status: 400 }
      )
    }

    if (player1Score < 0 || player2Score < 0) {
      return NextResponse.json(
        { error: 'Scores must be non-negative' },
        { status: 400 }
      )
    }

    if (player1Id === player2Id) {
      return NextResponse.json(
        { error: 'Players cannot play against themselves' },
        { status: 400 }
      )
    }

    // Verify the current player is one of the players
    if (player.id !== player1Id && player.id !== player2Id) {
      return NextResponse.json(
        { error: 'You can only report matches you participated in' },
        { status: 403 }
      )
    }

    // If challengeId is provided, verify the challenge exists and is accepted
    if (challengeId) {
      const challenge = await db.challenge.findUnique({
        where: { id: challengeId }
      })
      
      if (!challenge) {
        return NextResponse.json(
          { error: 'Challenge not found' },
          { status: 404 }
        )
      }

      if (challenge.status !== 'accepted') {
        return NextResponse.json(
          { error: 'Challenge must be accepted before reporting a match' },
          { status: 400 }
        )
      }

      // Verify players match the challenge
      if (
        (challenge.challengerId !== player1Id || challenge.challengeeId !== player2Id) &&
        (challenge.challengerId !== player2Id || challenge.challengeeId !== player1Id)
      ) {
        return NextResponse.json(
          { error: 'Players do not match the challenge' },
          { status: 400 }
        )
      }
    }

    // Check if a match already exists for this challenge
    if (challengeId) {
      const existingMatch = await db.match.findUnique({
        where: { challengeId }
      })
      
      if (existingMatch) {
        return NextResponse.json(
          { error: 'A match already exists for this challenge' },
          { status: 400 }
        )
      }
    }

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
        challengeId: challengeId || undefined,
        player1Id,
        player2Id,
        leagueId,
        player1Score,
        player2Score,
        status: matchStatus,
        winnerId: winnerId || undefined,
        reportedBy: player.id,
        confirmedAt: matchStatus === 'completed' ? new Date() : undefined
      }
    })

    // Mark challenge as completed if match is completed and challenge exists
    if (matchStatus === 'completed' && challengeId) {
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

    // ELO ratings should only be updated after match confirmation
    // If status is explicitly 'completed' (e.g., admin override), update ELO immediately
    if (matchStatus === 'completed') {
      try {
        // Update Elo ratings when match is completed directly
        await updateEloRatings(match.id)
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
        leagueId,
        player1Score,
        player2Score,
        status: matchStatus
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create match' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!player) {
      return NextResponse.json({ matches: [] })
    }

    // Check if filtering by challengeId
    const { searchParams } = new URL(request.url)
    const challengeId = searchParams.get('challengeId')

    // Build where clause
    let whereClause: any
    
    // If challengeId is provided, just check if ANY match exists for that challenge
    // (regardless of which player - needed to hide report button for both players)
    if (challengeId) {
      whereClause = { challengeId }
    } else {
      // Otherwise, get matches for the current player
      whereClause = {
        OR: [
          { player1Id: player.id },
          { player2Id: player.id }
        ]
      }
    }

    // Get matches using Prisma
    const matches = await db.match.findMany({
      where: whereClause,
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
      },
      orderBy: {
        playedAt: 'desc'
      },
      take: 50
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
    }>

    // Transform to match expected format
    const formattedMatches = matches.map(m => ({
      ...m,
      league_name: m.league.name,
      player1_name: m.player1.name,
      player2_name: m.player2.name
    }))

    return NextResponse.json({ matches: formattedMatches })

  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
