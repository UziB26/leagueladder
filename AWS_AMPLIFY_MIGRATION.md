# AWS Amplify Migration Guide - Dual Deployment

This guide will help you migrate from Vercel to AWS Amplify while keeping both deployments active during the transition.

## 🎯 Strategy: Dual Deployment

We're using a **dual deployment** approach:
- ✅ **Vercel**: Continues working with existing deployment
- ✅ **AWS Amplify**: New deployment for testing and migration
- ✅ **Both active**: Test Amplify thoroughly before switching

## 📋 Prerequisites

1. **AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **GitHub Repository**: Your code should be in GitHub (already done)
3. **AWS RDS PostgreSQL**: Database instance (we'll create this)

## 🗄️ Phase 1: Set Up AWS RDS PostgreSQL (1-2 hours)

### Step 1: Create RDS PostgreSQL Instance

1. **Go to AWS Console** → **RDS** → **Create Database**

2. **Database Configuration**:
   - **Engine**: PostgreSQL
   - **Version**: Latest stable (e.g., 15.x or 16.x)
   - **Template**: 
     - **Free tier** (for testing) OR
     - **Production** (for production use)

3. **Settings**:
   - **DB Instance Identifier**: `league-ladder-db`
   - **Master Username**: `postgres` (or your choice)
   - **Master Password**: Create a strong password (save this!)
   - **Confirm Password**: Re-enter password

4. **Instance Configuration**:
   - **DB Instance Class**: 
     - Free tier: `db.t3.micro` (1 vCPU, 1GB RAM)
     - Production: `db.t3.small` (2 vCPU, 2GB RAM) or larger
   - **Storage**: 
     - **Storage Type**: General Purpose SSD (gp3)
     - **Allocated Storage**: 20 GB (minimum, can increase later)

5. **Connectivity**:
   - **VPC**: Default VPC (or create new)
   - **Public Access**: **Yes** (needed for Amplify to connect)
   - **VPC Security Group**: Create new or use existing
   - **Availability Zone**: No preference (or choose closest)
   - **Database Port**: `5432` (default PostgreSQL port)

6. **Database Authentication**: Password authentication

7. **Additional Configuration**:
   - **Initial Database Name**: `league_ladder`
   - **Backup Retention**: 7 days (recommended)
   - **Enable Encryption**: Yes (recommended)

8. **Create Database**: Click "Create Database" (takes 5-10 minutes)

### Step 2: Configure Security Group

1. **Go to RDS** → Your Database → **Connectivity & Security** tab
2. **Click on Security Group** (e.g., `sg-xxxxx`)
3. **Edit Inbound Rules**:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: 
     - For testing: `0.0.0.0/0` (all IPs - **not recommended for production**)
     - For production: Your Amplify IP ranges or specific IPs
   - **Description**: "Allow PostgreSQL from Amplify"
4. **Save Rules**

### Step 3: Get Connection String

1. **Go to RDS** → Your Database → **Connectivity & Security** tab
2. **Endpoint**: Copy the endpoint (e.g., `league-ladder-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. **Port**: `5432`
4. **Connection String Format**:
   ```
   postgresql://username:password@endpoint:5432/league_ladder
   ```
   Example:
   ```
   postgresql://postgres:YourPassword@league-ladder-db.xxxxx.us-east-1.rds.amazonaws.com:5432/league_ladder
   ```

### Step 4: Initialize Database Schema

**Option A: Using Prisma Migrate (Recommended)**

```bash
# Set your RDS connection string temporarily
export DATABASE_URL="postgresql://postgres:YourPassword@your-endpoint:5432/league_ladder"

# Run migrations
npx prisma migrate deploy
```

**Option B: Using Prisma Push (Faster, for development)**

```bash
export DATABASE_URL="postgresql://postgres:YourPassword@your-endpoint:5432/league_ladder"
npx prisma db push
```

**Option C: Manual SQL (If you have existing schema)**

1. Export schema from Vercel Postgres
2. Connect to RDS using pgAdmin or psql
3. Run the SQL commands

## 📦 Phase 2: Migrate Data (30-60 minutes)

### Step 1: Export from Vercel Postgres

**Using pg_dump:**
```bash
# Install PostgreSQL client tools if needed
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Export data
pg_dump "your-vercel-postgres-connection-string" > vercel-backup.sql
```

**Or using Vercel Dashboard:**
1. Go to Vercel Dashboard → Storage → Your Database
2. Use the Query interface to export data
3. Or use Vercel's backup feature if available

### Step 2: Import to AWS RDS

```bash
# Import to RDS
psql "your-aws-rds-connection-string" < vercel-backup.sql
```

**Or using pgAdmin:**
1. Connect to RDS instance
2. Right-click database → Restore
3. Select backup file

## 🚀 Phase 3: Set Up AWS Amplify (30-45 minutes)

### Step 1: Connect Repository

1. **Go to AWS Amplify Console**: [console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify)
2. **New App** → **Host web app**
3. **Repository**: Select "GitHub" → Authorize if needed
4. **Select Repository**: Choose `UziB26/leagueladder` (or your repo)
5. **Branch**: `main` (or your production branch)

### Step 2: Configure Build Settings

Amplify should auto-detect `amplify.yml`. Verify:

- **Build specification**: `amplify.yml` (should be auto-detected)
- **App name**: `league-ladder` (or your choice)
- **Environment**: `production`

If auto-detection doesn't work, manually set:
- **Build command**: `npm run build`
- **Install command**: `npm ci`
- **Output directory**: `.next`

### Step 3: Add Environment Variables

Go to **App Settings** → **Environment Variables** and add:

```
# Database Connection (use your RDS connection string)
DATABASE_URL=postgresql://postgres:YourPassword@your-rds-endpoint:5432/league_ladder
PRISMA_DATABASE_URL=postgresql://postgres:YourPassword@your-rds-endpoint:5432/league_ladder
POSTGRES_URL=postgresql://postgres:YourPassword@your-rds-endpoint:5432/league_ladder
POSTGRES_PRISMA_URL=postgresql://postgres:YourPassword@your-rds-endpoint:5432/league_ladder

# Authentication
NEXTAUTH_URL=https://your-app-id.amplifyapp.com
NEXTAUTH_SECRET=your-existing-secret-key
AUTH_SECRET=your-existing-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-id.amplifyapp.com
NODE_ENV=production

# AWS Amplify Detection (optional, for build-time detection)
AWS_AMPLIFY=true
```

**Important Notes:**
- Use the **same** `NEXTAUTH_SECRET` and `AUTH_SECRET` from Vercel (so sessions work)
- `NEXTAUTH_URL` will be your Amplify URL (e.g., `https://main.xxxxx.amplifyapp.com`)
- Update `NEXTAUTH_URL` after first deployment with actual Amplify URL

### Step 4: Deploy

1. **Review Settings** → Click **Save and Deploy**
2. **Wait for Build** (5-10 minutes)
3. **Get Your Amplify URL** (e.g., `https://main.xxxxx.amplifyapp.com`)

### Step 5: Update Environment Variables with Actual URL

After first deployment:

1. **Copy your Amplify URL** from the deployment page
2. **Go to App Settings** → **Environment Variables**
3. **Update**:
   - `NEXTAUTH_URL` → Your Amplify URL
   - `NEXT_PUBLIC_APP_URL` → Your Amplify URL
4. **Redeploy** (or push a new commit)

## ✅ Phase 4: Testing & Verification (1-2 hours)

### Test Checklist

1. **Build Success**:
   - [ ] Amplify build completes without errors
   - [ ] No Prisma errors in build logs
   - [ ] App loads on Amplify URL

2. **Database Connection**:
   - [ ] Can register new user
   - [ ] Can login
   - [ ] Database queries work

3. **Core Features**:
   - [ ] View leaderboards
   - [ ] Join leagues
   - [ ] Create challenges
   - [ ] Report matches
   - [ ] Confirm matches
   - [ ] View player profiles

4. **Data Integrity**:
   - [ ] All leagues present
   - [ ] User data migrated correctly
   - [ ] Match history intact
   - [ ] Ratings correct

5. **Performance**:
   - [ ] Page load times acceptable
   - [ ] API responses fast
   - [ ] No timeout errors

### Compare with Vercel

- [ ] Same features work on both platforms
- [ ] Data is consistent
- [ ] Performance is similar or better

## 🔄 Phase 5: Switch Traffic (When Ready)

### Option 1: DNS Switch (If Using Custom Domain)

1. **Point DNS to Amplify**:
   - Go to your domain registrar
   - Update A/CNAME records to point to Amplify
   - Wait for DNS propagation (24-48 hours)

2. **Update Environment Variables**:
   - Update `NEXTAUTH_URL` to custom domain
   - Redeploy

### Option 2: Gradual Migration

1. **Keep both active** for a period
2. **Monitor Amplify** for issues
3. **Switch when confident**

### Option 3: Complete Switch

1. **Verify Amplify works 100%**
2. **Update all references** to use Amplify URL
3. **Vercel deployment** can remain as backup

## 📝 Files Changed

### New Files Created:
- ✅ `amplify.yml` - Amplify build configuration
- ✅ `AWS_AMPLIFY_MIGRATION.md` - This guide

### Files Updated:
- ✅ `prisma.config.ts` - Added AWS Amplify build detection

### Files Kept (for Vercel):
- ✅ `vercel.json` - Kept so Vercel continues working

## 🔧 Troubleshooting

### Build Fails: "Database connection error"

**Solution:**
- Verify `DATABASE_URL` is set in Amplify environment variables
- Check RDS security group allows connections
- Verify connection string format is correct
- Check RDS instance is running

### Build Fails: "Prisma generate error"

**Solution:**
- Ensure `amplify.yml` includes `npx prisma generate` in preBuild
- Check Prisma schema is valid: `npx prisma validate`
- Verify `prisma.config.ts` handles build-time correctly

### App Works But Database Empty

**Solution:**
- Verify data migration completed successfully
- Check RDS connection string points to correct database
- Verify schema was initialized: `npx prisma db push` or `npx prisma migrate deploy`

### Authentication Not Working

**Solution:**
- Verify `NEXTAUTH_URL` matches Amplify URL exactly
- Ensure `NEXTAUTH_SECRET` is same as Vercel (for session compatibility)
- Check `AUTH_SECRET` is also set
- Clear browser cookies and try again

### API Routes Timeout

**Solution:**
- Amplify has 30-second timeout (same as Vercel with your config)
- Check for long-running database queries
- Optimize slow endpoints
- Consider adding caching

## 💰 Cost Comparison

### Current (Vercel):
- Hosting: Free tier
- Vercel Postgres: ~$20/month
- **Total: ~$20/month**

### AWS Amplify:
- Hosting: Free tier (15GB storage, 100GB transfer)
- RDS PostgreSQL (db.t3.micro): ~$15/month
- **Total: ~$15/month**

**Savings: ~$5/month** (or more with larger usage)

## ✅ Success Criteria

Migration is complete when:
- [ ] Amplify build succeeds
- [ ] All features work on Amplify
- [ ] Data is migrated and intact
- [ ] Performance is acceptable
- [ ] No critical errors
- [ ] Tested for at least 24-48 hours

## 🎉 Next Steps After Migration

Once Amplify is stable:
1. **Monitor for 1-2 weeks**
2. **Fix any issues**
3. **Optionally remove Vercel deployment** (or keep as backup)
4. **Update documentation** with Amplify URLs
5. **Update any external references**

## 📞 Support

- **AWS Amplify Docs**: [docs.amplify.aws](https://docs.amplify.aws)
- **AWS RDS Docs**: [docs.aws.amazon.com/rds](https://docs.aws.amazon.com/rds)
- **Prisma Docs**: [prisma.io/docs](https://www.prisma.io/docs)

---

**Remember**: Both deployments will work simultaneously. Test Amplify thoroughly before making it primary!
