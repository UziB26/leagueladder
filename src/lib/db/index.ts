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
  // Players table
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // Player ratings (separate per league)
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
      status TEXT DEFAULT 'pending', -- pending, accepted, declined, completed
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
      status TEXT DEFAULT 'pending', -- pending, completed, voided
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed_at DATETIME,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id),
      FOREIGN KEY (player1_id) REFERENCES players(id),
      FOREIGN KEY (player2_id) REFERENCES players(id),
      FOREIGN KEY (winner_id) REFERENCES players(id),
      FOREIGN KEY (league_id) REFERENCES leagues(id)
    )
  `)

  // Rating updates (history)
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

  console.log('✅ Database initialized with SQLite')
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
  
  getLeaderboard: (leagueId: string, limit = 50) => 
    db.prepare(`
      SELECT 
        p.id, p.name, p.avatar,
        pr.rating, pr.games_played, pr.wins, pr.losses, pr.draws
      FROM players p
      JOIN player_ratings pr ON p.id = pr.player_id
      WHERE pr.league_id = ?
      ORDER BY pr.rating DESC
      LIMIT ?
    `).all(leagueId, limit)
}