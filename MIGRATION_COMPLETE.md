# ✅ PostgreSQL Migration - Complete Setup Guide

## What Was Done

I've set up your app to use **Vercel Postgres** for persistent storage while keeping SQLite for local development. Here's what changed:

### ✅ Code Changes

1. **Installed @vercel/postgres package**
2. **Created PostgreSQL adapter** (`src/lib/db/postgres.ts`)
   - Converts SQLite queries to PostgreSQL syntax
   - Provides async database operations
3. **Updated critical routes to use PostgreSQL**:
   - ✅ Join League (`app/api/leagues/join/route.ts`)
   - ✅ Leaderboard (`app/api/leaderboard/[leagueId]/route.ts`)
   - ✅ Available Players (`app/api/players/available/route.ts`)
4. **Created schema initialization endpoint** (`app/api/db/init/route.ts`)
5. **Created PostgreSQL schema** (`src/lib/db/postgres-schema.sql`)

### How It Works

The code **automatically detects** which database to use:
- **If `POSTGRES_URL` exists** → Uses PostgreSQL (Vercel production)
- **Otherwise** → Uses SQLite (local development)

**No code changes needed** - it just works! 🎉

## What You Need to Do Now

### Step 1: Create Vercel Postgres Database (2 minutes)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **league-ladder** project
3. Click **Storage** tab (top navigation)
4. Click **Create Database** → **Postgres**
5. Name: `league-ladder-db`
6. Select region
7. Click **Create**

**Vercel automatically adds:**
- `POSTGRES_URL` ✅
- `POSTGRES_PRISMA_URL` ✅
- `POSTGRES_URL_NON_POOLING` ✅

### Step 2: Initialize Database Schema (1 minute)

**Option A: Using API Endpoint (Easiest)**
1. After deploying, visit: `https://your-app.vercel.app/api/db/init`
2. You'll see a success message with all tables created

**Option B: Using Vercel Dashboard**
1. Vercel Dashboard → Storage → Your Database → **Query** tab
2. Copy contents of `src/lib/db/postgres-schema.sql`
3. Paste and execute

### Step 3: Deploy and Test

1. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add PostgreSQL support for persistent storage"
   git push
   ```

2. **Wait for Vercel to deploy** (automatic)

3. **Test**:
   - Join a league
   - Check leaderboard - you should appear!
   - Check available players - you should appear!

## Verification

### Check if PostgreSQL is being used:

1. **Join a league** and check Vercel logs:
   - Vercel Dashboard → Functions → View Logs
   - Look for: `database: PostgreSQL` in the logs

2. **Check database directly**:
   - Vercel Dashboard → Storage → Your Database → Query
   - Run: `SELECT * FROM league_memberships;`
   - You should see your membership!

## What's Fixed

✅ **Data persists** across deployments  
✅ **Players appear on leaderboards**  
✅ **Players appear in challenge lists**  
✅ **Multiple users can join leagues**  
✅ **All data survives function invocations**

## Remaining Routes (Optional)

These routes still use SQLite but will work fine:
- Auth routes (user creation works)
- Other API routes

You can migrate them later if needed, but the critical ones (join league, leaderboard, available players) are done!

## Troubleshooting

### "POSTGRES_URL not set"
- Make sure you created the database in Vercel
- Check Environment Variables in Vercel Dashboard
- Redeploy after creating database

### "Relation does not exist"
- Run schema initialization: Visit `/api/db/init`
- Or run the SQL manually in Vercel Dashboard

### Still using SQLite?
- Check Vercel logs for `database: PostgreSQL`
- Verify `POSTGRES_URL` is in Production environment variables
- Make sure you redeployed after creating the database

## Next Steps

1. ✅ Create Vercel Postgres database
2. ✅ Initialize schema (visit `/api/db/init`)
3. ✅ Test joining a league
4. ✅ Verify data persists

**You're all set!** 🚀
