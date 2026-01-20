# 🚀 Complete Deployment Guide - From Scratch

This guide will walk you through deploying your League Ladder app to Vercel from scratch, including database setup, environment variables, and deployment.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (sign up at https://vercel.com if needed)
- ✅ Your code pushed to a GitHub repository
- ✅ Node.js installed locally (for generating secrets)

---

## Step 1: Prepare Your Code

### 1.1 Commit and Push Your Code

Make sure all your code is committed and pushed to GitHub:

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Your Repository

- Go to https://github.com
- Verify your repository `UziB26/leagueladder` exists
- Make sure the `main` branch has all your latest code

---

## Step 2: Create Vercel Project

### 2.1 Sign In to Vercel

1. Go to https://vercel.com
2. Sign in with your GitHub account (recommended for easy integration)

### 2.2 Import Your Project

1. Click **"Add New"** → **"Project"**
2. Import your GitHub repository:
   - Find `UziB26/leagueladder` in the list
   - Click **"Import"**
3. Configure Project Settings:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `leagueladder` (if your code is in a subfolder)
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `.next` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. Click **"Deploy"** (we'll add environment variables after)

**Note**: The first deployment will fail because we haven't set up the database yet. That's okay - we'll fix it in the next steps.

---

## Step 3: Set Up PostgreSQL Database

### 3.1 Create Postgres Database

1. In Vercel Dashboard, go to **"Storage"** tab (or click **"Create Database"**)
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a name (e.g., `league-ladder-db`)
5. Select a region (choose closest to your users)
6. Click **"Create"**

### 3.2 Get Your Connection String

1. After database is created, click on your database
2. Go to the **".env.local"** tab
3. You'll see your connection string. It looks like:
   ```
   POSTGRES_URL="postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb"
   ```
4. **Copy this entire connection string** - you'll need it in the next step

**Important**: Keep this connection string secure. Don't share it publicly.

---

## Step 4: Generate NEXTAUTH_SECRET

### 4.1 Generate Secret Locally

Open your terminal and run:

```bash
openssl rand -base64 32
```

This will output something like:
```
7K9mP2qR5vX8wY3zA6bC1dE4fG7hJ0kL3nO6pQ9sT2uV5wX8yZ1aB4cD7eF0gH
```

**Copy this value** - you'll need it for the environment variable.

**Alternative**: If you don't have OpenSSL, use this online generator:
- Go to https://generate-secret.vercel.app/32
- Copy the generated secret

---

## Step 5: Set Up Environment Variables

### 5.1 Go to Environment Variables

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the left sidebar

### 5.2 Add Each Variable

Add the following variables one by one:

#### Variable 1: `PRISMA_DATABASE_URL`

1. Click **"Add New"**
2. **Key**: `PRISMA_DATABASE_URL`
3. **Value**: Paste your PostgreSQL connection string from Step 3.2
   - It should look like: `postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb`
4. **Environment**: Select **"Production"**, **"Preview"**, and **"Development"** (or just **"Production"** for now)
5. Click **"Save"**

#### Variable 2: `DATABASE_URL` (Fallback)

1. Click **"Add New"**
2. **Key**: `DATABASE_URL`
3. **Value**: Same PostgreSQL connection string as above
4. **Environment**: Select **"Production"**, **"Preview"**, and **"Development"**
5. Click **"Save"**

#### Variable 3: `POSTGRES_URL` (Alternative)

1. Click **"Add New"**
2. **Key**: `POSTGRES_URL`
3. **Value**: Same PostgreSQL connection string as above
4. **Environment**: Select **"Production"**, **"Preview"**, and **"Development"**
5. Click **"Save"**

#### Variable 4: `NEXTAUTH_URL`

1. Click **"Add New"**
2. **Key**: `NEXTAUTH_URL`
3. **Value**: Your Vercel deployment URL
   - Format: `https://your-project-name.vercel.app`
   - To find it: Go to your project → **"Deployments"** tab → Click latest deployment → Copy the URL
   - Example: `https://leagueladder.vercel.app`
4. **Environment**: Select **"Production"** (and **"Preview"** if you want)
5. Click **"Save"**

#### Variable 5: `NEXTAUTH_SECRET`

1. Click **"Add New"**
2. **Key**: `NEXTAUTH_SECRET`
3. **Value**: Paste the secret you generated in Step 4.1
   - Example: `7K9mP2qR5vX8wY3zA6bC1dE4fG7hJ0kL3nO6pQ9sT2uV5wX8yZ1aB4cD7eF0gH`
4. **Environment**: Select **"Production"**, **"Preview"**, and **"Development"**
5. Click **"Save"**

#### Variable 6: `NEXT_PUBLIC_APP_URL`

1. Click **"Add New"**
2. **Key**: `NEXT_PUBLIC_APP_URL`
3. **Value**: Same as `NEXTAUTH_URL`
   - Example: `https://leagueladder.vercel.app`
4. **Environment**: Select **"Production"** (and **"Preview"** if you want)
5. Click **"Save"**

### 5.3 Verify All Variables

You should now have these 6 environment variables:
- ✅ `PRISMA_DATABASE_URL`
- ✅ `DATABASE_URL`
- ✅ `POSTGRES_URL`
- ✅ `NEXTAUTH_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXT_PUBLIC_APP_URL`

---

## Step 6: Initialize Database Schema

### 6.1 Run Database Migrations

You need to create the database tables. You have two options:

#### Option A: Using Prisma Migrate (Recommended)

1. Install Vercel CLI locally (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

3. Run Prisma migrations:
   ```bash
   cd leagueladder
   npx prisma migrate deploy
   ```

#### Option B: Using Prisma Push (Faster, for development)

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Push schema to database:
   ```bash
   cd leagueladder
   npx prisma db push
   ```

#### Option C: Manual SQL (If you have existing schema)

1. Go to Vercel Dashboard → **Storage** → Your Postgres Database
2. Click **"Query"** tab
3. If you have a SQL schema file (`src/lib/db/postgres-schema.sql`), copy and paste it
4. Click **"Run"**

**Note**: If you don't have a schema file, Prisma will create the tables automatically when the app runs.

---

## Step 7: Redeploy Your Application

### 7.1 Trigger New Deployment

After setting all environment variables:

1. Go to your project in Vercel Dashboard
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Or: Make a small change and push to GitHub (Vercel will auto-deploy)

### 7.2 Monitor the Build

1. Watch the build logs in real-time
2. You should see:
   - ✅ `npm install` completes
   - ✅ `prisma generate` completes
   - ✅ `next build` completes
   - ✅ Deployment successful

### 7.3 Check for Errors

If the build fails:
- Check the build logs for specific errors
- Verify all environment variables are set correctly
- Make sure database is accessible
- Check that `NEXTAUTH_URL` matches your deployment URL exactly

---

## Step 8: Verify Deployment

### 8.1 Test Your Application

1. Go to your deployment URL (e.g., `https://leagueladder.vercel.app`)
2. Test these features:
   - ✅ Homepage loads
   - ✅ Registration works
   - ✅ Login works
   - ✅ Dashboard loads
   - ✅ Can join leagues
   - ✅ Database operations work

### 8.2 Check Function Logs

1. Go to Vercel Dashboard → Your Project → **"Functions"** tab
2. Check for any runtime errors
3. Look for database connection errors

### 8.3 Test Database Connection

1. Try registering a new user
2. Try joining a league
3. If these work, your database is connected correctly

---

## Step 9: Set Up Custom Domain (Optional)

### 9.1 Add Custom Domain

1. Go to Vercel Dashboard → Your Project → **"Settings"** → **"Domains"**
2. Enter your domain name
3. Follow Vercel's instructions to configure DNS

### 9.2 Update Environment Variables

If you add a custom domain, update:
- `NEXTAUTH_URL` to your custom domain
- `NEXT_PUBLIC_APP_URL` to your custom domain

---

## 🔧 Troubleshooting

### Build Fails: "Database connection URL is required"

**Solution**: 
- Verify `PRISMA_DATABASE_URL` is set in Vercel
- Make sure it's enabled for Production environment
- Check the connection string format

### Build Fails: Syntax Errors

**Solution**:
- Check build logs for specific file and line number
- Fix the syntax error
- Commit and push again

### App Deploys But Doesn't Work

**Solution**:
- Check Function logs in Vercel Dashboard
- Verify `NEXTAUTH_URL` matches deployment URL exactly
- Check database is accessible
- Verify all environment variables are set

### Database Connection Errors

**Solution**:
- Verify PostgreSQL database is active
- Check connection string is correct
- Make sure database schema is initialized (run migrations)
- Check Vercel Storage dashboard for database status

### NextAuth Errors

**Solution**:
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Check `NEXTAUTH_SECRET` is set and is a valid string
- Make sure both variables are enabled for Production

---

## ✅ Deployment Checklist

Before considering deployment complete:

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] PostgreSQL database created
- [ ] Connection string copied
- [ ] `NEXTAUTH_SECRET` generated
- [ ] All 6 environment variables set in Vercel
- [ ] Environment variables enabled for Production
- [ ] Database schema initialized (migrations run)
- [ ] Application redeployed
- [ ] Build completes successfully
- [ ] Application loads on Vercel URL
- [ ] Registration works
- [ ] Login works
- [ ] Database operations work
- [ ] No errors in Function logs

---

## 📝 Quick Reference

### Environment Variables Summary

| Variable | Value Example | Required |
|----------|---------------|----------|
| `PRISMA_DATABASE_URL` | `postgres://default:xxx@ep-xxx.postgres.vercel-storage.com:5432/verceldb` | ✅ Yes |
| `DATABASE_URL` | Same as above | ✅ Yes (fallback) |
| `POSTGRES_URL` | Same as above | ✅ Yes (alternative) |
| `NEXTAUTH_URL` | `https://leagueladder.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | `7K9mP2qR5vX8wY3zA6bC1dE4fG7hJ0kL3nO6pQ9sT2uV5wX8yZ1aB4cD7eF0gH` | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | `https://leagueladder.vercel.app` | ✅ Yes |

### Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/UziB26/leagueladder
- **Vercel Storage**: Vercel Dashboard → Storage tab

### Useful Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Pull environment variables locally
vercel env pull .env.local

# Run Prisma migrations
npx prisma migrate deploy

# Push Prisma schema
npx prisma db push

# Check Vercel CLI
vercel --version
```

---

## 🎉 You're Done!

Once all steps are complete, your League Ladder app should be:
- ✅ Deployed on Vercel
- ✅ Connected to PostgreSQL database
- ✅ Fully functional with authentication
- ✅ Ready for users

If you encounter any issues, check the Troubleshooting section above or review the Vercel build logs for specific error messages.
