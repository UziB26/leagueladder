import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

/**
 * Initialize PostgreSQL database schema
 * Call this ONCE after creating Vercel Postgres database
 * GET /api/db/init
 */
export async function GET() {
  try {
    // Check if POSTGRES_URL is set
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'POSTGRES_URL not set. Please create a Vercel Postgres database first.' },
        { status: 400 }
      )
    }

    // Schema statements (converted from SQLite to PostgreSQL)
    const statements = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMP,
        image TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Accounts table
      `CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(provider, "providerAccountId")
      )`,
      
      // Sessions table
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "sessionToken" TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      // Players table
      `CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, name)
      )`,
      
      // Leagues table
      `CREATE TABLE IF NOT EXISTS leagues (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        game_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // League memberships
      `CREATE TABLE IF NOT EXISTS league_memberships (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        UNIQUE(player_id, league_id)
      )`,
      
      // Player ratings
      `CREATE TABLE IF NOT EXISTS player_ratings (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        rating INTEGER DEFAULT 1000,
        games_played INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        UNIQUE(player_id, league_id)
      )`,
      
      // Challenges table
      `CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        challenger_id TEXT NOT NULL,
        challengee_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY (challenger_id) REFERENCES players(id),
        FOREIGN KEY (challengee_id) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        CHECK (challenger_id != challengee_id)
      )`,
      
      // Matches table
      `CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        challenge_id TEXT UNIQUE,
        player1_id TEXT NOT NULL,
        player2_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        player1_score INTEGER NOT NULL,
        player2_score INTEGER NOT NULL,
        winner_id TEXT,
        status TEXT DEFAULT 'pending',
        reported_by TEXT,
        played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmed_at TIMESTAMP,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id),
        FOREIGN KEY (player1_id) REFERENCES players(id),
        FOREIGN KEY (player2_id) REFERENCES players(id),
        FOREIGN KEY (winner_id) REFERENCES players(id),
        FOREIGN KEY (reported_by) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        CHECK (player1_id != player2_id),
        CHECK (player1_score >= 0),
        CHECK (player2_score >= 0)
      )`,
      
      // Match confirmations
      `CREATE TABLE IF NOT EXISTS match_confirmations (
        id TEXT PRIMARY KEY,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        action TEXT NOT NULL,
        confirmed_score1 INTEGER,
        confirmed_score2 INTEGER,
        dispute_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        CHECK (action IN ('confirmed', 'disputed')),
        UNIQUE(match_id, player_id)
      )`,
      
      // Rating updates
      `CREATE TABLE IF NOT EXISTS rating_updates (
        id TEXT PRIMARY KEY,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        old_rating INTEGER NOT NULL,
        new_rating INTEGER NOT NULL,
        change INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id)
      )`,
      
      // Admin actions
      `CREATE TABLE IF NOT EXISTS admin_actions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT,
        target_id TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Seed leagues
      `INSERT INTO leagues (id, name, game_type) 
       VALUES ('tt_league', 'Table Tennis', 'table-tennis')
       ON CONFLICT (id) DO NOTHING`,
      
      `INSERT INTO leagues (id, name, game_type) 
       VALUES ('fifa_league', 'Fifa', 'fifa')
       ON CONFLICT (id) DO NOTHING`
    ]

    const results = []
    for (const statement of statements) {
      try {
        await sql.query(statement)
        results.push({ 
          table: statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] || 'unknown',
          status: 'success' 
        })
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error?.code === '42P07' || error?.code === '42710' || 
            error?.message?.includes('already exists') ||
            error?.code === '23505') { // unique violation (for INSERT)
          results.push({ 
            table: statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] || 'unknown',
            status: 'skipped (already exists)' 
          })
        } else {
          results.push({ 
            table: statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)?.[1] || 'unknown',
            status: 'error', 
            error: error.message 
          })
          console.error('Schema initialization error:', error, 'Statement:', statement.substring(0, 100))
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema initialized',
      results
    })

  } catch (error: any) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize database' },
      { status: 500 }
    )
  }
}
