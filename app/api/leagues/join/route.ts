import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { validateRequest, requestSchemas } from '@/lib/validation'
import { sanitizeString } from '@/lib/sanitize'

export const runtime = 'nodejs' // Required for Prisma on Vercel
export const dynamic = 'force-dynamic' // Prevent build-time execution on Amplify

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await apiRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    // Validate request
    const validator = validateRequest({
      schema: requestSchemas.joinLeague,
      errorMessage: 'Invalid league join request',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { leagueId } = data

    // Sanitize league ID (leagues use string IDs like 'tt_league', 'fifa_league', not UUIDs)
    const sanitizedLeagueId = sanitizeString(leagueId)
    if (!sanitizedLeagueId || sanitizedLeagueId.length === 0) {
      return NextResponse.json(
        { error: 'Invalid league ID format' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create user using Prisma
    let user = await db.user.findUnique({
      where: { email: session.user.email }
    })
    
    // If user doesn't exist in database but has valid session, create them
    if (!user) {
      const userName = session.user.name || session.user.email?.split('@')[0] || 'User'
      
      try {
        user = await db.user.create({
          data: {
            email: session.user.email,
            name: userName
          }
        })
      } catch (error: any) {
        // If insert fails (e.g., race condition), try to get user again
        user = await db.user.findUnique({
          where: { email: session.user.email }
        })
        
        if (!user) {
          console.error('Failed to create user:', error)
          return NextResponse.json(
            { error: 'Failed to create user account' },
            { status: 500 }
          )
        }
      }
    }

    // Check if player exists, create if not
    let player = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    const playerDisplayName =
      user.name ||
      session.user.name ||
      (user.email ? user.email.split('@')[0] : 'Player')

    if (!player) {
      try {
        player = await db.player.create({
          data: {
            userId: user.id,
            name: playerDisplayName,
            email: user.email
          }
        })
      } catch (error: any) {
        // If insert fails, try to get player again
        player = await db.player.findFirst({
          where: { userId: user.id }
        })
        
        if (!player) {
          console.error('Failed to create player:', error)
          return NextResponse.json(
            { error: 'Failed to create player profile' },
            { status: 500 }
          )
        }
      }
    } else if (player.name?.includes('@') && user.name) {
      // If existing player name is an email and we now have a display name, update it
      await db.player.update({
        where: { id: player.id },
        data: { name: playerDisplayName }
      })
      player.name = playerDisplayName
    }

    // Check if already joined using Prisma
    const existingMembership = await db.leagueMembership.findUnique({
      where: {
        playerId_leagueId: {
          playerId: player.id,
          leagueId: sanitizedLeagueId
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already joined this league' },
        { status: 400 }
      )
    }

    // Join league and initialize rating in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create league membership
      const membership = await tx.leagueMembership.upsert({
        where: {
          playerId_leagueId: {
            playerId: player.id,
            leagueId: sanitizedLeagueId
          }
        },
        update: {
          isActive: true // Reactivate if it was deactivated
        },
        create: {
          playerId: player.id,
          leagueId: sanitizedLeagueId,
          isActive: true
        }
      })

      // Initialize rating (only if it doesn't exist)
      const rating = await tx.playerRating.upsert({
        where: {
          playerId_leagueId: {
            playerId: player.id,
            leagueId: sanitizedLeagueId
          }
        },
        update: {}, // Don't update if it exists
        create: {
          playerId: player.id,
          leagueId: sanitizedLeagueId,
          rating: 1000,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0
        }
      })

      return { membership, rating }
    })

    console.log('Successfully joined league:', {
      playerId: player.id,
      playerName: player.name,
      leagueId: sanitizedLeagueId,
      membershipId: result.membership.id,
      ratingId: result.rating.id
    })

    // Return detailed success response
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined league',
      data: {
        playerId: player.id,
        leagueId: sanitizedLeagueId,
        membershipId: result.membership.id,
        ratingId: result.rating.id
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error joining league:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to join league' },
      { status: 500 }
    )
  }
}
