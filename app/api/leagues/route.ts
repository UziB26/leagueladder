import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs' // Required for Prisma on Vercel

export async function GET() {
  try {
    const leagues = db.prepare('SELECT * FROM leagues').all()
    return NextResponse.json({ leagues })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leagues' },
      { status: 500 }
    )
  }
}
