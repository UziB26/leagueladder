import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET() {
  try {
    const leagues = await db.league.findMany({
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json({ leagues })
  } catch (error) {
    console.error('Error fetching leagues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leagues' },
      { status: 500 }
    )
  }
}
