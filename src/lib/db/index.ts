import Database from 'better-sqlite3'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Initialize database
const dbPath = join(process.cwd(), 'league-ladder.db')

// Type alias for the Database instance
type DatabaseInstance = InstanceType<typeof Database>

// Lazy database initialization - only create when first accessed
let _db: DatabaseInstance | null = null

function getDatabase(): DatabaseInstance {
  if (!_db) {
    try {
      _db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : undefined })
      _db.pragma('foreign_keys = ON')
      // Initialize tables on first access
      initializeDatabase()
    } catch (error) {
      // During build, database might not be accessible - this is okay
      if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.VERCEL === '1') {
        console.warn('Database initialization skipped during build')
        // Create a minimal database instance that won't be used
        // This is just to prevent build errors
        // For build time, create an in-memory database
        _db = new Database(':memory:')
      } else {
        throw error
      }
    }
  }
  // At this point, _db is guaranteed to be non-null
  if (!_db) {
    throw new Error('Failed to initialize database')
  }
  return _db
}

// Export db as a proxy that lazily initializes
export const db = new Proxy({} as DatabaseInstance, {
  get(_target, prop) {
    const dbInstance = getDatabase()
    const value = dbInstance[prop as keyof DatabaseInstance]
    if (typeof value === 'function') {
      return value.bind(dbInstance)
    }
    return value
  }
}) as DatabaseInstance

// Initialize all tables
export function initializeDatabase() {
    // Ensure database is initialized
    const db = getDatabase()
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
        is_admin BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Add is_admin column if it doesn't exist (for existing databases)
    try {
      db.exec(`ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE`)
    } catch (e) {
      // Column already exists, ignore
    }
  
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
  
    // Challenges table
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
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        CHECK (challenger_id != challengee_id)
      )
    `)
  
    // Matches table
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
        reported_by TEXT,
        played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        confirmed_at DATETIME,
        FOREIGN KEY (challenge_id) REFERENCES challenges(id),
        FOREIGN KEY (player1_id) REFERENCES players(id),
        FOREIGN KEY (player2_id) REFERENCES players(id),
        FOREIGN KEY (winner_id) REFERENCES players(id),
        FOREIGN KEY (reported_by) REFERENCES players(id),
        FOREIGN KEY (league_id) REFERENCES leagues(id),
        CHECK (player1_id != player2_id),
        CHECK (player1_score >= 0),
        CHECK (player2_score >= 0)
      )
    `)
    
    // Add reported_by column if it doesn't exist (for existing databases)
    try {
      db.exec(`ALTER TABLE matches ADD COLUMN reported_by TEXT`)
    } catch (e) {
      // Column already exists, ignore
    }
    
    // Match confirmations table - tracks who confirmed/disputed matches
    db.exec(`
      CREATE TABLE IF NOT EXISTS match_confirmations (
        id TEXT PRIMARY KEY,
        match_id TEXT NOT NULL,
        player_id TEXT NOT NULL,
        action TEXT NOT NULL,
        confirmed_score1 INTEGER,
        confirmed_score2 INTEGER,
        dispute_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id),
        CHECK (action IN ('confirmed', 'disputed')),
        UNIQUE(match_id, player_id)
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
    
    // ============================================
    // TRIGGERS FOR AUTOMATIC RATING UPDATES
    // ============================================
    
    // Trigger 1: Update challenge status to 'completed' when a match is created from a challenge
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_challenge_on_match_creation
      AFTER INSERT ON matches
      WHEN NEW.challenge_id IS NOT NULL
      BEGIN
        UPDATE challenges
        SET status = 'completed'
        WHERE id = NEW.challenge_id AND status = 'accepted';
      END
    `)
    
    // Trigger 2a: Set winner_id automatically when match is INSERTED (for any status)
    // This trigger runs FIRST to set winner_id before stats are updated
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS set_match_winner_on_insert
      AFTER INSERT ON matches
      WHEN NEW.winner_id IS NULL
      BEGIN
        UPDATE matches
        SET winner_id = CASE
          WHEN NEW.player1_score > NEW.player2_score THEN NEW.player1_id
          WHEN NEW.player2_score > NEW.player1_score THEN NEW.player2_id
          ELSE NULL
        END
        WHERE id = NEW.id;
        
        UPDATE matches
        SET confirmed_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id AND confirmed_at IS NULL;
      END
    `)
    
    // Trigger 2b: Set winner_id and confirmed_at automatically when match status changes to 'completed'
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS set_match_winner
      AFTER UPDATE OF status ON matches
      WHEN NEW.status = 'completed' AND OLD.status != 'completed'
      BEGIN
        UPDATE matches
        SET winner_id = CASE
          WHEN NEW.player1_score > NEW.player2_score THEN NEW.player1_id
          WHEN NEW.player2_score > NEW.player1_score THEN NEW.player2_id
          ELSE NULL
        END
        WHERE id = NEW.id AND winner_id IS NULL;
        
        UPDATE matches
        SET confirmed_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id AND confirmed_at IS NULL;
      END
    `)
    
    // Trigger 3a: Update player_ratings stats when match is INSERTED with 'completed' status
    // Note: Only update stats when match is completed (not pending_confirmation)
    // Note: winner_id should be set in the INSERT statement or by set_match_winner_on_insert trigger
    // This trigger uses a subquery to get the current winner_id (which may have been set by another trigger)
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_player_stats_on_match_insert
      AFTER INSERT ON matches
      WHEN NEW.status = 'completed'
      BEGIN
        -- Get the current winner_id from the matches table (may have been set by set_match_winner_on_insert trigger)
        -- Use COALESCE to fallback to score-based determination if winner_id is still NULL
        -- Update Player 1 stats
        UPDATE player_ratings
        SET 
          games_played = games_played + 1,
          wins = wins + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) = NEW.player1_id THEN 1 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player1_score > NEW.player2_score THEN 1 
            ELSE 0 
          END,
          losses = losses + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) = NEW.player2_id THEN 1 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player2_score > NEW.player1_score THEN 1 
            ELSE 0 
          END,
          draws = draws + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player1_score = NEW.player2_score THEN 1 
            ELSE 0 
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = NEW.player1_id 
          AND league_id = NEW.league_id;
        
        -- Update Player 2 stats
        UPDATE player_ratings
        SET 
          games_played = games_played + 1,
          wins = wins + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) = NEW.player2_id THEN 1 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player2_score > NEW.player1_score THEN 1 
            ELSE 0 
          END,
          losses = losses + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) = NEW.player1_id THEN 1 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player1_score > NEW.player2_score THEN 1 
            ELSE 0 
          END,
          draws = draws + CASE 
            WHEN (SELECT winner_id FROM matches WHERE id = NEW.id) IS NULL AND NEW.player1_score = NEW.player2_score THEN 1 
            ELSE 0 
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = NEW.player2_id 
          AND league_id = NEW.league_id;
      END
    `)
    
    // Trigger 3b: Update player_ratings stats (wins, losses, draws, games_played) when match status changes to 'completed'
    // Note: This updates basic stats. Elo rating calculation must be done in application code.
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_player_stats_on_match_completion
      AFTER UPDATE OF status ON matches
      WHEN NEW.status = 'completed' AND OLD.status != 'completed'
      BEGIN
        -- Update Player 1 stats
        UPDATE player_ratings
        SET 
          games_played = games_played + 1,
          wins = wins + CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END,
          losses = losses + CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END,
          draws = draws + CASE WHEN NEW.winner_id IS NULL THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = NEW.player1_id 
          AND league_id = NEW.league_id;
        
        -- Update Player 2 stats
        UPDATE player_ratings
        SET 
          games_played = games_played + 1,
          wins = wins + CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END,
          losses = losses + CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END,
          draws = draws + CASE WHEN NEW.winner_id IS NULL THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = NEW.player2_id 
          AND league_id = NEW.league_id;
      END
    `)
    
    // Trigger 4: Revert player_ratings stats if match status changes from 'completed' to something else
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS revert_player_stats_on_match_uncompletion
      AFTER UPDATE OF status ON matches
      WHEN OLD.status = 'completed' AND NEW.status != 'completed'
      BEGIN
        -- Revert Player 1 stats
        UPDATE player_ratings
        SET 
          games_played = games_played - 1,
          wins = wins - CASE WHEN OLD.winner_id = OLD.player1_id THEN 1 ELSE 0 END,
          losses = losses - CASE WHEN OLD.winner_id = OLD.player2_id THEN 1 ELSE 0 END,
          draws = draws - CASE WHEN OLD.winner_id IS NULL THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = OLD.player1_id 
          AND league_id = OLD.league_id
          AND games_played > 0;
        
        -- Revert Player 2 stats
        UPDATE player_ratings
        SET 
          games_played = games_played - 1,
          wins = wins - CASE WHEN OLD.winner_id = OLD.player2_id THEN 1 ELSE 0 END,
          losses = losses - CASE WHEN OLD.winner_id = OLD.player1_id THEN 1 ELSE 0 END,
          draws = draws - CASE WHEN OLD.winner_id IS NULL THEN 1 ELSE 0 END,
          updated_at = CURRENT_TIMESTAMP
        WHERE player_id = OLD.player2_id 
          AND league_id = OLD.league_id
          AND games_played > 0;
      END
    `)
    
    // Trigger 5: Ensure player_ratings exist when a player joins a league
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS create_player_rating_on_league_join
      AFTER INSERT ON league_memberships
      BEGIN
        INSERT OR IGNORE INTO player_ratings (id, player_id, league_id, rating, games_played, wins, losses, draws)
        VALUES (
          lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || 
          substr(lower(hex(randomblob(2))), 2) || '-' || 
          substr('89ab', abs(random()) % 4 + 1, 1) || 
          substr(lower(hex(randomblob(2))), 2) || '-' || 
          lower(hex(randomblob(6))),
          NEW.player_id,
          NEW.league_id,
          1000,
          0,
          0,
          0,
          0
        );
      END
    `)
    
    console.log('✅ Database initialized with all tables and triggers')
  }

// Database initialization is now lazy - it happens on first access via getDatabase()
// This prevents build-time errors on Vercel

// Export transaction utilities
export { DatabaseTransaction, createBackup, restoreBackup } from './transactions'
export { validateMatchData, validateChallengeData, validatePlayerLeagueMembership } from './validation'

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
  },
  
  /**
   * Update Elo ratings for both players after a match is completed.
   * This function should be called from API routes when a match status changes to 'completed'.
   * The triggers handle basic stats (wins/losses/draws), but Elo calculation requires JavaScript.
   * Now uses transactions for atomicity.
   * 
   * @param matchId - The ID of the completed match
   * @param eloCalculator - Instance of EloCalculator (import from '@/lib/elo')
   */
  updateEloRatings: (matchId: string, eloCalculator: any) => {
    return DatabaseTransaction.execute((tx) => {
      const match = tx.get(
        db.prepare(`
          SELECT player1_id, player2_id, player1_score, player2_score, league_id, winner_id
          FROM matches
          WHERE id = ? AND status = 'completed'
        `),
        matchId
      ) as any
      
      if (!match) {
        throw new Error(`Match ${matchId} not found or not completed`)
      }
      
      // Get current ratings for both players
      const rating1 = tx.get(
        db.prepare(`
          SELECT rating FROM player_ratings
          WHERE player_id = ? AND league_id = ?
        `),
        match.player1_id,
        match.league_id
      ) as any
      
      const rating2 = tx.get(
        db.prepare(`
          SELECT rating FROM player_ratings
          WHERE player_id = ? AND league_id = ?
        `),
        match.player2_id,
        match.league_id
      ) as any
      
      if (!rating1 || !rating2) {
        throw new Error('Player ratings not found')
      }
      
      // Calculate new ratings using Elo system
      const result = eloCalculator.calculateForMatch(
        rating1.rating,
        rating2.rating,
        match.player1_score,
        match.player2_score
      )
      
      // Update player 1 rating
      const updateRating1 = db.prepare(`
        UPDATE player_ratings
        SET rating = ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ? AND league_id = ?
      `)
      tx.run(updateRating1, result.newRatingA, match.player1_id, match.league_id)
      
      // Update player 2 rating
      const updateRating2 = db.prepare(`
        UPDATE player_ratings
        SET rating = ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ? AND league_id = ?
      `)
      tx.run(updateRating2, result.newRatingB, match.player2_id, match.league_id)
      
      // Record rating updates for history
      const insertUpdate1 = db.prepare(`
        INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      tx.run(
        insertUpdate1,
        uuidv4(),
        matchId,
        match.player1_id,
        match.league_id,
        rating1.rating,
        result.newRatingA,
        result.changeA
      )
      
      const insertUpdate2 = db.prepare(`
        INSERT INTO rating_updates (id, match_id, player_id, league_id, old_rating, new_rating, change)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      tx.run(
        insertUpdate2,
        uuidv4(),
        matchId,
        match.player2_id,
        match.league_id,
        rating2.rating,
        result.newRatingB,
        result.changeB
      )
      
      return {
        player1: {
          oldRating: rating1.rating,
          newRating: result.newRatingA,
          change: result.changeA
        },
        player2: {
          oldRating: rating2.rating,
          newRating: result.newRatingB,
          change: result.changeB
        }
      }
    })
  },
  
  /**
   * Revert Elo ratings when a match is voided/cancelled.
   * This should be called when a match status changes from 'completed' to another status.
   * Now uses transactions for atomicity.
   */
  revertEloRatings: (matchId: string) => {
    return DatabaseTransaction.execute((tx) => {
      // Get the most recent rating updates for this match
      const updates = tx.all(
        db.prepare(`
          SELECT player_id, league_id, old_rating
          FROM rating_updates
          WHERE match_id = ?
          ORDER BY created_at DESC
          LIMIT 2
        `),
        matchId
      ) as any[]
      
      if (updates.length !== 2) {
        // No rating updates to revert
        return
      }
      
      // Revert ratings to old values
      const revertRating = db.prepare(`
        UPDATE player_ratings
        SET rating = ?, updated_at = CURRENT_TIMESTAMP
        WHERE player_id = ? AND league_id = ?
      `)
      updates.forEach((update) => {
        tx.run(revertRating, update.old_rating, update.player_id, update.league_id)
      })
      
      // Delete rating update records
      const deleteUpdates = db.prepare(`
        DELETE FROM rating_updates WHERE match_id = ?
      `)
      tx.run(deleteUpdates, matchId)
    })
  }
}