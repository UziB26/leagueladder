import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ players: [] })
    }

    const currentPlayer = await db.player.findFirst({
      where: { userId: user.id }
    })
    
    if (!currentPlayer) {
      return NextResponse.json({ players: [] })
    }

    // Get optional leagueId from query params
    const leagueId = request.nextUrl.searchParams.get('leagueId')
    
    let players
    
    if (leagueId) {
      // Get players in the specific league
      const memberships = await db.leagueMembership.findMany({
        where: {
          leagueId,
          isActive: true,
          playerId: { not: currentPlayer.id }
        },
        include: {
          player: {
            include: {
              ratings: {
                where: { leagueId },
                take: 1,
                orderBy: { updatedAt: 'desc' }
              }
            }
          }
        },
        orderBy: {
          player: {
            name: 'asc'
          }
        }
      }) as Array<{
        id: string
        playerId: string
        leagueId: string
        joinedAt: Date
        isActive: boolean
        player: {
          id: string
          name: string
          ratings: Array<{
            id: string
            rating: number
            gamesPlayed: number
            wins: number
            losses: number
            draws: number
          }>
        }
      }>
      
      players = memberships.map(m => ({
        id: m.player.id,
        name: m.player.name,
        rating: m.player.ratings[0]?.rating ?? 1000
      }))
    } else {
      // Get all players who are in at least one league (excluding current player)
      const memberships = await db.leagueMembership.findMany({
        where: {
          isActive: true,
          playerId: { not: currentPlayer.id }
        },
        include: {
          player: {
            include: {
              ratings: {
                take: 1,
                orderBy: { updatedAt: 'desc' }
              }
            }
          }
        },
        distinct: ['playerId']
      }) as Array<{
        id: string
        playerId: string
        leagueId: string
        joinedAt: Date
        isActive: boolean
        player: {
          id: string
          name: string
          ratings: Array<{
            id: string
            rating: number
            gamesPlayed: number
            wins: number
            losses: number
            draws: number
          }>
        }
      }>
      
      // Group by player and get max rating
      const playerMap = new Map()
      memberships.forEach(m => {
        const existing = playerMap.get(m.player.id)
        const rating = m.player.ratings[0]?.rating ?? 1000
        if (!existing || rating > existing.rating) {
          playerMap.set(m.player.id, {
            id: m.player.id,
            name: m.player.name,
            rating
          })
        }
      })
      
      players = Array.from(playerMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    }
    
    return NextResponse.json({ players })
    
  } catch (error) {
    console.error('Error fetching available players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available players' },
      { status: 500 }
    )
  }
}
