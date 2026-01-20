# Quick Start: Migrate to Vercel Postgres

## Why Migrate?

SQLite on Vercel is **ephemeral** - data resets between deployments. PostgreSQL is **persistent** - your data will survive!

## Step-by-Step Setup (5 minutes)

### 1. Create Vercel Postgres Database

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **league-ladder** project
3. Click **Storage** tab (in the top navigation)
4. Click **Create Database**
5. Select **Postgres**
6. Name it: `league-ladder-db`
7. Choose a region (closest to your users)
8. Click **Create**

**Vercel automatically adds these environment variables:**
- `POSTGRES_URL` ✅
- `POSTGRES_PRISMA_URL` ✅  
- `POSTGRES_URL_NON_POOLING` ✅

### 2. Initialize Database Schema

After creating the database, initialize the schema:

**Option A: Using Vercel Dashboard (Easiest)**
1. In Vercel Dashboard → Your Project → Storage → Your Database
2. Click **Query** tab
3. Copy the entire contents of `src/lib/db/postgres-schema.sql`
4. Paste into the query editor
5. Click **Run** or press Ctrl+Enter
6. Wait for "Success" message

**Option B: Using API Endpoint**
1. Deploy your app (or wait for auto-deploy)
2. Visit: `https://your-app.vercel.app/api/db/init`
3. This will automatically create all tables
4. You should see a success message

### 3. Deploy

That's it! The code automatically detects PostgreSQL when `POSTGRES_URL` is available.

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add PostgreSQL support"
   git push
   ```

2. Vercel will automatically redeploy

3. After deployment, the app will use PostgreSQL instead of SQLite

## Verify It's Working

1. **Check logs**: Vercel Dashboard → Functions → View Logs
   - Look for: `database: PostgreSQL` in join league logs

2. **Test joining a league**:
   - Join a league
   - Check leaderboard - you should appear!
   - Check available players - you should appear!

3. **Check database**:
   - Vercel Dashboard → Storage → Your Database → Query
   - Run: `SELECT * FROM league_memberships;`
   - You should see your membership!

## What Changed?

✅ **Join League Route** - Now uses PostgreSQL  
✅ **Leaderboard Route** - Now uses PostgreSQL  
✅ **Available Players Route** - Now uses PostgreSQL  
✅ **Automatic Detection** - Uses PostgreSQL if available, SQLite for local dev

## Troubleshooting

### "POSTGRES_URL not set"
- Make sure you created the database in Vercel
- Check Environment Variables in Vercel Dashboard
- Redeploy after adding the variable

### "Relation does not exist" errors
- You need to run the schema initialization
- Visit `/api/db/init` or run the SQL manually

### Data still not persisting
- Check Vercel logs to confirm PostgreSQL is being used
- Verify schema was created (check tables in Vercel Dashboard)
- Make sure `POSTGRES_URL` is set in Production environment

## Next Steps

After migration, you can:
- ✅ Join leagues and data will persist
- ✅ See players on leaderboards
- ✅ Challenge other players
- ✅ All data survives deployments

## Local Development

For local development, you can:
1. **Keep using SQLite** (no changes needed)
2. **Or use local PostgreSQL**:
   - Install PostgreSQL locally
   - Set `POSTGRES_URL` in `.env.local`
   - Run the schema SQL locally

The code automatically uses the right database based on environment variables!
