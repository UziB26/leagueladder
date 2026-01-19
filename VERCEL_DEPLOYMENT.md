# Vercel Deployment Guide

This guide will help you deploy the League Ladder application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier is sufficient)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Version 18.0.0 or higher (Vercel will use this automatically)

## Step 1: Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Select your GitHub repository (`league-ladder`)
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `leagueladder` (if your project is in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm install` (default)
   - **Output Directory**: `.next` (default)

4. **Set Environment Variables**
   
   Click "Environment Variables" and add the following:

   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```
   *(Replace `your-app-name` with your actual Vercel app name)*

   ```
   NEXTAUTH_SECRET=your-generated-secret-key
   ```
   *(Generate with: `openssl rand -base64 32`)*

   ```
   DATABASE_PATH=/tmp/league-ladder.db
   ```
   *(Required for Vercel - uses ephemeral storage)*

   ```
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```
   *(Replace with your actual Vercel URL)*

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your app will be live at `https://your-app-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Project Directory**
   ```bash
   cd leagueladder
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set up environment variables (see Step 2, Option A)
   - Deploy to production

5. **Set Environment Variables via CLI** (if not done during deploy)
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add DATABASE_PATH
   vercel env add NEXT_PUBLIC_APP_URL
   ```

## Step 3: Post-Deployment Configuration

### Update NEXTAUTH_URL

After your first deployment, Vercel will provide you with a URL. Update the `NEXTAUTH_URL` environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXTAUTH_URL` with your actual Vercel URL
3. Redeploy (or wait for automatic redeploy)

### Create Admin User

1. Visit your deployed app
2. Register a new account
3. The first user will need admin privileges set manually (if needed)

**Note**: SQLite on Vercel uses ephemeral storage (`/tmp/`). This means:
- ✅ Database will be created automatically on first API request
- ⚠️ Data will be lost on each deployment
- ⚠️ Data may be lost between function invocations (serverless)

**For Production Use**: Consider migrating to a persistent database like:
- Vercel Postgres
- PlanetScale
- Supabase
- Railway PostgreSQL

## Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Review build logs for any errors

2. **Test Your App**
   - Visit your live URL
   - Test registration/login
   - Test core features (challenges, matches, leaderboard)

3. **Check Health Endpoint**
   - Visit `https://your-app-name.vercel.app/api/health`
   - Should return `{ "status": "ok" }`

## Troubleshooting

### Build Fails

**Error**: "Database initialization skipped during build"
- ✅ **This is expected** - Database initialization is lazy and happens at runtime
- The build process creates an in-memory database to prevent build errors

**Error**: "Module not found" or "TypeScript errors"
- Run `npm run build` locally to identify issues
- Ensure all dependencies are in `package.json`
- Check that `tsconfig.json` is properly configured

### Runtime Errors

**Error**: "Database is locked" or "Cannot write to database"
- This can happen with SQLite on serverless platforms
- Consider migrating to a persistent database for production

**Error**: "NEXTAUTH_SECRET is not set"
- Ensure environment variables are set in Vercel Dashboard
- Redeploy after adding environment variables

### Authentication Issues

**Error**: "Invalid redirect URL"
- Check `NEXTAUTH_URL` matches your Vercel deployment URL exactly
- Ensure `NEXT_PUBLIC_APP_URL` is also set correctly

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXTAUTH_URL` | ✅ Yes | Full URL of your deployed app | `https://league-ladder.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ Yes | Secret key for session encryption | Generated with `openssl rand -base64 32` |
| `DATABASE_PATH` | ⚠️ Recommended | Database file path | `/tmp/league-ladder.db` (Vercel) |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Recommended | Public app URL for CORS | `https://league-ladder.vercel.app` |

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to use your custom domain

## Continuous Deployment

Vercel automatically deploys when you push to your connected GitHub branch:
- `main` branch → Production
- Other branches → Preview deployments

Each push triggers a new deployment automatically.

## Monitoring

- **Deployment Logs**: Vercel Dashboard → Deployments → View Logs
- **Function Logs**: Vercel Dashboard → Functions → View Logs
- **Analytics**: Available in Vercel Dashboard (Pro plan)

## Next Steps

1. ✅ Your app is now live!
2. 🔄 Set up a persistent database for production use
3. 📊 Configure analytics and monitoring
4. 🔒 Review security settings
5. 📱 Test on mobile devices

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**Deployment Date**: [Fill in after deployment]
**Live URL**: [Fill in your Vercel URL]
