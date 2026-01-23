/**
 * Example: Join League Route using Prisma
 * This shows how the route would look with Prisma instead of raw SQL
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { apiRateLimit } from '@/lib/rate-limit'
import { validateRequest, requestSchemas } from '@/lib/validation'
import { sanitizeString } from '@/lib/sanitize'
import type { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await apiRateLimit(request)
    if (rateLimitResult) {
      // Rate limit exceeded, return the response
      return rateLimitResult
    }

    // Authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validation
    const validator = validateRequest({
      schema: requestSchemas.joinLeague,
      errorMessage: 'Invalid league join request',
    })
    const { data, error } = await validator(request)
    if (error) {
      return error
    }

    const { leagueId } = data
    const sanitizedLeagueId = sanitizeString(leagueId)

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      const userName = session.user.name || session.user.email?.split('@')[0] || 'User'
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: userName,
        }
      })
    }

    // Get or create player
    let player = await prisma.player.findFirst({
      where: { userId: user.id }
    })

    if (!player) {
      player = await prisma.player.create({
        data: {
          userId: user.id,
          name: user.name || session.user.name || 'Player',
          email: user.email,
        }
      })
    }

    // Check if already joined
    const existingMembership = await prisma.leagueMembership.findUnique({
      where: {
        playerId_leagueId: {
          playerId: player.id,
          leagueId: sanitizedLeagueId,
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'Already joined this league' },
        { status: 400 }
      )
    }

    // Join league and create rating in a transaction
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$transaction(async (tx: any) => {
      // Create membership
      const membership = await tx.leagueMembership.create({
        data: {
          playerId: player.id,
          leagueId: sanitizedLeagueId,
          isActive: true,
        }
      })

      // Create rating (or get existing)
      const rating = await tx.playerRating.upsert({
        where: {
          playerId_leagueId: {
            playerId: player.id,
            leagueId: sanitizedLeagueId,
          }
        },
        update: {}, // Don't update if exists
        create: {
          playerId: player.id,
          leagueId: sanitizedLeagueId,
          rating: 1000,
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
        }
      })

      return { membership, rating }
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully joined league',
      data: {
        playerId: player.id,
        leagueId: sanitizedLeagueId,
        membershipId: result.membership.id,
        ratingId: result.rating.id,
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error joining league:', error)
    return NextResponse.json(
      { error: 'Failed to join league' },
      { status: 500 }
    )
  }
}
