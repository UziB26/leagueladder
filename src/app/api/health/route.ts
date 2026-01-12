import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const leagues = db
      .prepare('SELECT COUNT(*) as count FROM leagues')
      .get() as { count: number }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      leagues: leagues.count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 500 }
    )
  }
}