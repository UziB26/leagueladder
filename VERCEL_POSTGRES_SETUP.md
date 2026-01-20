# Setting Up Vercel Postgres - Quick Start Guide

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Create Database**
   - Click on **Storage** tab (in project settings)
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name (e.g., `league-ladder-db`)
   - Select region (choose closest to your users)
   - Click **Create**

3. **Environment Variables**
   - Vercel automatically adds these to your project:
     - `POSTGRES_URL` - Main connection string
     - `POSTGRES_PRISMA_URL` - For Prisma (if using)
     - `POSTGRES_URL_NON_POOLING` - Direct connection

## Step 2: Initialize Database Schema

After creating the database, you need to run the schema:

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your database in Vercel Dashboard
2. Click **Query** tab
3. Copy the contents of `src/lib/db/postgres-schema.sql`
4. Paste and execute

### Option B: Using psql (Local)

If you have PostgreSQL installed locally:

```bash
# Get connection string from Vercel Dashboard → Storage → Your Database → .env.local
# Then run:
psql $POSTGRES_URL_NON_POOLING < src/lib/db/postgres-schema.sql
```

### Option C: Using a Migration Script

I'll create a migration API route that you can call once to initialize the schema.

## Step 3: Update Code

The code has been updated to automatically use PostgreSQL when `POSTGRES_URL` is available.

**No code changes needed!** The database adapter detects which database to use:
- If `POSTGRES_URL` exists → Uses PostgreSQL
- Otherwise → Uses SQLite (for local development)

## Step 4: Test

1. Deploy to Vercel
2. The app will automatically use PostgreSQL
3. Try joining a league
4. Check if data persists (it should now!)

## Troubleshooting

### Database not connecting
- Check `POSTGRES_URL` is set in Vercel environment variables
- Verify database is created and active
- Check Vercel function logs for connection errors

### Schema errors
- Make sure you've run the schema SQL
- Check for existing tables that might conflict
- Review error messages in Vercel logs

### Data not persisting
- Verify you're using PostgreSQL (check logs)
- Ensure schema was created successfully
- Check database in Vercel Dashboard → Storage → Query

## Next Steps

After migration:
- ✅ Data will persist across deployments
- ✅ Multiple users can join leagues
- ✅ Leaderboards will show all players
- ✅ Challenges will work correctly

## Rollback

If you need to rollback:
1. Remove `POSTGRES_URL` from Vercel environment variables
2. Redeploy
3. App will use SQLite again (but data will be ephemeral)
