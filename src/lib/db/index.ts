import Database from 'better-sqlite3'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Initialize database
const dbPath = join(process.cwd(), 'league-ladder.db')
export const db = new Database(dbPath, { verbose: console.log })

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize all tables
export function initializeDatabase() {
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
  
    // Users table (for NextAuth)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        emailVerified DATETIME,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  
    // Accounts table (for NextAuth)
    db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        providerAccountId TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(provider, providerAccountId)
      )
    `)
  
    // Sessions table (for NextAuth)
    db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        sessionToken TEXT UNIQUE NOT NULL,
        expires DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
  
    // Players table (updated to link with users)
    db.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, name)
      )
    `)
  
    // Leagues table
    db.exec(`
      CREATE TABLE IF NOT EXISTS leagues (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        game_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  
    // League memberships
    db.exec(`
      CREATE TABLE IF NOT EXISTS league_memberships (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        UNIQUE(player_id, league_id)
      )
    `)
  
    // Player ratings
    db.exec(`
      CREATE TABLE IF NOT EXISTS player_ratings (
        id TEXT PRIMARY KEY,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        rating INTEGER DEFAULT 1000,
        games_played INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        UNIQUE(player_id, league_id)
      )
    `)
  
    // Challenges
    db.exec(`
      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        challenger_id TEXT NOT NULL,
        challengee_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (challenger_id) REFERENCES players(id),
        FOREIGN KEY (challengee_id) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id)
      )
    `)
  
    // Matches
    db.exec(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        challenge_id TEXT UNIQUE,
        player1_id TEXT NOT NULL,
        player2_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        player1_score INTEGER NOT NULL,
        player2_score INTEGER NOT NULL,
        winner_id TEXT,
        status TEXT DEFAULT 'pending',
        played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        confirmed_at DATETIME,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id),
        FOREIGN KEY (player1_id) REFERENCES players(id),
        FOREIGN KEY (player2_id) REFERENCES players(id),
        FOREIGN KEY (winner_id) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id)
      )
    `)
  
    // Rating updates
    db.exec(`
      CREATE TABLE IF NOT EXISTS rating_updates (
        id TEXT PRIMARY KEY,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        league_id TEXT NOT NULL,
        old_rating INTEGER NOT NULL,
        new_rating INTEGER NOT NULL,
        change INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id)
      )
    `)
  
    // Admin actions
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_actions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT,
        target_id TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  
    // Seed initial leagues
    const leagues = [
      { id: 'tt_league', name: 'Table Tennis', game_type: 'table-tennis' },
      { id: 'fifa_league', name: 'FIFA', game_type: 'fifa' }
    ]
  
    leagues.forEach(league => {
      db.prepare(`
        INSERT OR IGNORE INTO leagues (id, name, game_type) 
        VALUES (?, ?, ?)
      `).run(league.id, league.name, league.game_type)
    })
  
    console.log('✅ Database initialized with all tables')
  }

// Run initialization
initializeDatabase()

// Helper functions
export const dbHelpers = {
  generateId: () => uuidv4(),
  getPlayer: (id: string) => 
    db.prepare('SELECT * FROM players WHERE id = ?').get(id),
  
  getLeague: (id: string) =>
    db.prepare('SELECT * FROM leagues WHERE id = ?').get(id),
  
  getLeaderboard: (leagueId: string, limit: number = 50) => {
    return db.prepare(`
      SELECT 
        p.id, p.name, p.email, p.avatar,
        pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
      FROM players p
      JOIN player_ratings pr ON p.id = pr.player_id
      WHERE pr.league_id = ?
      ORDER BY pr.rating DESC
      LIMIT ?
    `).all(leagueId, limit)
  },
  
  getPlayerWithStats: (playerId: string) => {
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId)
    if (!player) return null
    
    const ratings = db.prepare(`
      SELECT pr.*, l.name as league_name
      FROM player_ratings pr
      JOIN leagues l ON pr.league_id = l.id
      WHERE pr.player_id = ?
    `).all(playerId)
    
    return { player, ratings }
  },
  
  getPlayerMatches: (playerId: string, limit: number = 10) => {
    return db.prepare(`
      SELECT 
        m.*,
        l.name as league_name,
        p1.name as player1_name,
        p2.name as player2_name
      FROM matches m
      JOIN leagues l ON m.league_id = l.id
      JOIN players p1 ON m.player1_id = p1.id
      JOIN players p2 ON m.player2_id = p2.id
      WHERE (m.player1_id = ? OR m.player2_id = ?)
        AND m.status = 'completed'
      ORDER BY m.played_at DESC
      LIMIT ?
    `).all(playerId, playerId, limit)
  }
}