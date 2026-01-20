# 🚀 Complete Deployment Instructions - Prisma 7 Fix

## ✅ What We Fixed

1. **Removed `url` from `schema.prisma`** - Prisma 7 no longer allows connection URLs in schema files
2. **Created `prisma.config.ts`** - Moved connection URL to Prisma 7 config format
3. **Updated to use `PRISMA_DATABASE_URL`** - Matches your Vercel environment variable

## 📋 Step-by-Step Instructions

### Step 1: Verify Your Changes

Before committing, verify these files have been updated:

✅ **`prisma/schema.prisma`** - Should NOT have `url = env(...)` in datasource block
✅ **`prisma.config.ts`** - Should exist and check for `PRISMA_DATABASE_URL`
✅ **`src/lib/db/prisma.ts`** - PrismaClient should be configured correctly

### Step 2: Check Your Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables (should already be set):**
- ✅ `PRISMA_DATABASE_URL` - Your PostgreSQL connection string
- ✅ `POSTGRES_URL` - Alternative connection string
- ✅ `DATABASE_URL` - Fallback connection string
- ✅ `NEXTAUTH_URL` - Your app URL
- ✅ `NEXTAUTH_SECRET` - Secret key
- ✅ `NEXT_PUBLIC_APP_URL` - Public app URL

**Verify:**
- All variables are set for **"All Environments"** or at least **"Production"**
- `PRISMA_DATABASE_URL` is present (this is what Prisma will use)

### Step 3: Commit Your Changes

Open your terminal in the project directory and run:

```bash
# Check what files have changed
git status

# You should see:
# - prisma/schema.prisma (modified)
# - prisma.config.ts (new file)

# Stage the changes
git add prisma/schema.prisma
git add prisma.config.ts

# Commit with a descriptive message
git commit -m "Fix Prisma 7 configuration: Move connection URL to prisma.config.ts

- Remove url from schema.prisma datasource block (Prisma 7 requirement)
- Add prisma.config.ts with PRISMA_DATABASE_URL support
- Fix build error: PrismaConfigEnvError"
```

### Step 4: Push to GitHub

```bash
# Push to your main branch
git push origin main

# Or if you're on a different branch:
git push origin <your-branch-name>
```

### Step 5: Monitor Vercel Build

After pushing, Vercel will automatically start building:

1. **Go to Vercel Dashboard** → Your Project → **Deployments**
2. **Watch the build logs** - You should see:
   ```
   ✓ Running "npm run build"
   ✓ Prisma schema loaded from prisma/schema.prisma
   ✓ Generated Prisma Client
   ✓ Building Next.js application
   ```

### Step 6: Verify Build Success

**✅ Success Indicators:**
- Build completes without errors
- Status shows "Ready" (green checkmark)
- No PrismaConfigEnvError in logs
- No "Cannot resolve environment variable" errors

**❌ If Build Fails:**
- Check the build logs for specific errors
- Verify `PRISMA_DATABASE_URL` is set in Vercel
- Make sure it's enabled for Production environment
- See Troubleshooting section below

### Step 7: Test Your Application

Once deployment is successful:

1. **Visit your Vercel URL** (e.g., `https://your-app.vercel.app`)
2. **Test Database Connection:**
   - Try to register/login
   - Create a league or join one
   - Check if data persists

3. **Check Application Logs:**
   - Vercel Dashboard → Your Project → **Functions** → View logs
   - Look for any database connection errors

### Step 8: Run Database Migrations (If Needed)

If this is your first time using Prisma with this database:

**Option A: Using Prisma Migrate (Recommended)**
```bash
# Locally, with your database URL in .env
npx prisma migrate deploy
```

**Option B: Using Prisma Push (Faster, for development)**
```bash
npx prisma db push
```

**Option C: Manual SQL (If you have existing schema)**
- Go to Vercel Dashboard → Storage → Your Database → Query
- Run the SQL from `src/lib/db/postgres-schema.sql`

## 🔧 Troubleshooting

### Error: "Cannot resolve environment variable: PRISMA_DATABASE_URL"

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `PRISMA_DATABASE_URL` exists
3. Click on it and verify it's enabled for **Production**
4. If missing, add it:
   - Click "Add New"
   - Key: `PRISMA_DATABASE_URL`
   - Value: Copy from `POSTGRES_URL` or get from Vercel Postgres dashboard
   - Environment: Select "Production" (and Preview if needed)
5. **Redeploy** after adding

### Error: "Prisma schema validation error"

**Solution:**
- Verify `prisma/schema.prisma` does NOT have `url = env(...)` in datasource block
- Verify `prisma.config.ts` exists and is correct
- Run `npx prisma validate` locally to check

### Error: "Database connection failed"

**Solution:**
1. Verify your Vercel Postgres database is active
2. Check connection string format in `PRISMA_DATABASE_URL`
3. Verify database schema is initialized (run migrations)
4. Check Vercel function logs for detailed error messages

### Build Succeeds But App Doesn't Work

**Check:**
1. Database schema is initialized (tables exist)
2. Environment variables are set correctly
3. Check browser console for errors
4. Check Vercel function logs for runtime errors

## 📝 Quick Reference

### Files Changed
- `prisma/schema.prisma` - Removed `url` from datasource
- `prisma.config.ts` - New file with connection URL config

### Environment Variables Needed
- `PRISMA_DATABASE_URL` ✅ (Primary - you have this)
- `POSTGRES_URL` ✅ (Fallback - you have this)
- `DATABASE_URL` ✅ (Fallback - you have this)

### Build Command
```bash
npm run build
# Which runs: prisma generate && next build
```

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Validate schema
npx prisma validate

# Push schema to database (development)
npx prisma db push

# Run migrations (production)
npx prisma migrate deploy
```

## ✅ Success Checklist

Before considering deployment complete:

- [ ] Changes committed to Git
- [ ] Changes pushed to GitHub
- [ ] Vercel build completes successfully
- [ ] No Prisma errors in build logs
- [ ] Application loads on Vercel URL
- [ ] Database connection works (can register/login)
- [ ] Data persists (can create/join leagues)
- [ ] No errors in browser console
- [ ] No errors in Vercel function logs

## 🎉 You're Done!

Once all checks pass, your application should be fully functional with:
- ✅ Prisma 7 working correctly
- ✅ PostgreSQL database connected
- ✅ Production deployment live
- ✅ All features working

If you encounter any issues, check the Troubleshooting section above or review the Vercel build logs for specific error messages.
