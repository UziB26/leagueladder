# How to Initialize Database Schema - Complete Guide

After creating your Vercel Postgres database, you need to create all the tables. Here are **two methods** - choose the one that's easiest for you.

---

## Method 1: Using the API Endpoint (Easiest) ⭐ Recommended

This is the **easiest method** - just visit a URL after deployment.

### Step-by-Step:

1. **Deploy your app to Vercel first**
   - Push your code to GitHub
   - Vercel will automatically deploy
   - Wait for deployment to complete

2. **Get your Vercel app URL**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project
   - Copy the deployment URL (e.g., `https://league-ladder.vercel.app`)

3. **Visit the initialization endpoint**
   - Open your browser
   - Go to: `https://YOUR-APP-URL.vercel.app/api/db/init`
   - Replace `YOUR-APP-URL` with your actual Vercel URL
   
   **Example:**
   ```
   https://league-ladder.vercel.app/api/db/init
   ```

4. **Check the response**
   - You should see a JSON response like:
   ```json
   {
     "success": true,
     "message": "Database schema initialized",
     "results": [
       { "table": "users", "status": "success" },
       { "table": "players", "status": "success" },
       { "table": "leagues", "status": "success" },
       ...
     ]
   }
   ```

5. **Verify it worked**
   - If you see `"success": true`, you're done! ✅
   - If some tables show `"skipped (already exists)"`, that's fine - they were already created
   - If you see errors, check the error messages

### Troubleshooting Method 1:

**Error: "POSTGRES_URL not set"**
- Make sure you created the Vercel Postgres database
- Check that `POSTGRES_URL` is in your Vercel environment variables
- Redeploy after adding the database

**Error: "Failed to initialize database"**
- Check Vercel function logs for detailed error messages
- Make sure the database was created successfully
- Try Method 2 instead

---

## Method 2: Using Vercel Dashboard (Manual SQL)

This method lets you run the SQL directly in Vercel's database interface.

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project

2. **Open your database**
   - Click on the **Storage** tab (top navigation)
   - You should see your Postgres database listed
   - Click on it to open

3. **Open the Query tab**
   - In the database view, click on the **Query** tab
   - This opens a SQL query editor

4. **Get the schema SQL**
   - Open the file: `src/lib/db/postgres-schema.sql` in your project
   - Copy the **entire contents** of this file
   - Or use the schema from the initialization endpoint code

5. **Paste and execute**
   - Paste the SQL into the query editor
   - Click **Run** (or press Ctrl+Enter / Cmd+Enter)
   - Wait for execution to complete

6. **Check for errors**
   - If successful, you'll see a success message
   - If there are errors, they'll be shown in red
   - Some "already exists" errors are normal if you run it multiple times

### Alternative: Run SQL in chunks

If the full schema is too large, you can run it in smaller pieces:

1. **First, create the tables:**
   ```sql
   -- Users table
   CREATE TABLE IF NOT EXISTS users (
     id TEXT PRIMARY KEY,
     name TEXT,
     email TEXT UNIQUE NOT NULL,
     "emailVerified" TIMESTAMP,
     image TEXT,
     is_admin BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Then run each table creation one by one**
   - Copy each `CREATE TABLE` statement
   - Run it separately
   - Continue until all tables are created

3. **Finally, seed the leagues:**
   ```sql
   INSERT INTO leagues (id, name, game_type) 
   VALUES ('tt_league', 'Table Tennis', 'table-tennis')
   ON CONFLICT (id) DO NOTHING;

   INSERT INTO leagues (id, name, game_type) 
   VALUES ('fifa_league', 'Fifa', 'fifa')
   ON CONFLICT (id) DO NOTHING;
   ```

---

## Method 3: Using Prisma (If you want to use Prisma)

If you prefer to use Prisma migrations:

1. **Install Prisma CLI** (if not already installed):
   ```bash
   npm install -g prisma
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Push schema to database:**
   ```bash
   npx prisma db push
   ```
   
   This will create all tables from your `prisma/schema.prisma` file.

4. **Seed initial data** (optional):
   ```bash
   npx prisma db seed
   ```

---

## Verification: How to Check if Schema is Initialized

After initializing, verify the tables were created:

### Using Vercel Dashboard:

1. Go to your database in Vercel Dashboard
2. Click **Query** tab
3. Run this query:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

4. You should see these tables:
   - `users`
   - `accounts`
   - `sessions`
   - `players`
   - `leagues`
   - `league_memberships`
   - `player_ratings`
   - `challenges`
   - `matches`
   - `match_confirmations`
   - `rating_updates`
   - `admin_actions`

### Using the API:

Visit: `https://YOUR-APP-URL.vercel.app/api/db/init`

If tables already exist, you'll see `"skipped (already exists)"` for each table - this means they're already created! ✅

---

## Quick Reference: Complete SQL Schema

If you need the complete SQL, here's what the initialization endpoint runs:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  image TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for NextAuth)
CREATE TABLE IF NOT EXISTS accounts (
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
);

-- Sessions table (for NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "sessionToken" TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, name)
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  game_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- League memberships
CREATE TABLE IF NOT EXISTS league_memberships (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  league_id TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
  UNIQUE(player_id, league_id)
);

-- Player ratings
CREATE TABLE IF NOT EXISTS player_ratings (
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
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
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
);

-- Matches table
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
);

-- Match confirmations
CREATE TABLE IF NOT EXISTS match_confirmations (
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
);

-- Rating updates
CREATE TABLE IF NOT EXISTS rating_updates (
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
);

-- Admin actions
CREATE TABLE IF NOT EXISTS admin_actions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT,
  target_id TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial leagues
INSERT INTO leagues (id, name, game_type) 
VALUES ('tt_league', 'Table Tennis', 'table-tennis')
ON CONFLICT (id) DO NOTHING;

INSERT INTO leagues (id, name, game_type) 
VALUES ('fifa_league', 'Fifa', 'fifa')
ON CONFLICT (id) DO NOTHING;
```

---

## Common Issues and Solutions

### Issue: "Relation already exists"
**Solution:** This is normal! It means the table was already created. You can ignore these errors or use `CREATE TABLE IF NOT EXISTS` (which the schema already does).

### Issue: "Permission denied"
**Solution:** Make sure you're using the correct database connection. Check that `POSTGRES_URL` is set correctly in Vercel.

### Issue: "Column does not exist"
**Solution:** The schema might have been partially created. Drop all tables and re-run the schema, or manually add missing columns.

### Issue: API endpoint returns 500 error
**Solution:** 
1. Check Vercel function logs for detailed error messages
2. Verify `POSTGRES_URL` is set in environment variables
3. Try Method 2 (manual SQL) instead

---

## Summary

**Recommended approach:**
1. Deploy your app to Vercel
2. Visit `https://YOUR-APP-URL.vercel.app/api/db/init`
3. Check for success message
4. Done! ✅

**Alternative approach:**
1. Go to Vercel Dashboard → Storage → Your Database → Query
2. Copy and paste the SQL schema
3. Run it
4. Done! ✅

Both methods work - choose whichever is easier for you!
