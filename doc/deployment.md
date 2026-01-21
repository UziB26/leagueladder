# League Ladder - Production Deployment Guide

This document describes how production deployment works, including environment variables, database migrations, and rollback procedures.

---

## 🏗️ Production Architecture

### Deployment Platform
- **Hosting**: Vercel (serverless functions)
- **Database**: PostgreSQL (Vercel Postgres or external provider)
- **ORM**: Prisma 7
- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js v5

### How Production Works

1. **Build Process**:
   - Vercel automatically builds on push to `main` branch
   - Build command: `npm run build` (runs `prisma generate && next build`)
   - Prisma Client is generated during build
   - Next.js application is compiled and optimized

2. **Runtime**:
   - Serverless functions handle API routes
   - Each function invocation connects to PostgreSQL via Prisma
   - Database connection pooling handled by Vercel Postgres
   - Sessions stored in database via NextAuth

3. **Database**:
   - PostgreSQL database (persistent, production-ready)
   - Schema managed via Prisma migrations
   - Connection strings provided via environment variables
   - Automatic connection pooling for serverless functions

---

## 🔐 Environment Variables

### Required Environment Variables

All environment variables must be set in **Vercel Dashboard → Settings → Environment Variables** for the Production environment.

#### Authentication Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `AUTH_SECRET` | ✅ Yes | Secret key for NextAuth session encryption (preferred) | `d/I8oYQAwR+KOMizPCteb+UWFx1sdlB2uKSMP8t4Vcw=` |
| `NEXTAUTH_SECRET` | ⚠️ Fallback | Alternative secret key (used if `AUTH_SECRET` not set) | Same as above |
| `NEXTAUTH_URL` | ✅ Yes | Full URL of your deployed app | `https://leagueladderapp.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Recommended | Public app URL for CORS and redirects | `https://leagueladderapp.vercel.app` |

**Generate AUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Database Variables

The application checks for database connection strings in this order:

1. `DATABASE_URL` - Direct PostgreSQL connection (preferred for migrations)
2. `POSTGRES_URL` - Direct Postgres URL (Vercel Postgres)
3. `POSTGRES_PRISMA_URL` - Standard Vercel Postgres variable
4. `PRISMA_DATABASE_URL` - For Prisma Accelerate (runtime queries only)

**Vercel Postgres automatically provides:**
- `POSTGRES_URL` - Direct connection string
- `POSTGRES_PRISMA_URL` - Prisma-optimized connection string
- `POSTGRES_URL_NON_POOLING` - Non-pooling connection (for migrations)
- `PRISMA_DATABASE_URL` - Accelerate connection (if enabled)

**For External PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

#### Build-Time Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VERCEL` | Auto-set | Automatically set by Vercel (indicates build environment) |
| `NEXT_PHASE` | Auto-set | Set to `phase-production-build` during build |

### Environment Variable Priority

1. **Runtime (API Routes)**:
   - Uses: `PRISMA_DATABASE_URL` → `POSTGRES_PRISMA_URL` → `POSTGRES_URL` → `DATABASE_URL`
   - Supports Prisma Accelerate URLs (`prisma+postgres://...`)

2. **Migrations (Prisma CLI)**:
   - Uses: `DATABASE_URL` → `POSTGRES_URL` → `POSTGRES_PRISMA_URL`
   - **Does NOT support** Accelerate URLs (requires direct connection)

3. **Build Time**:
   - Uses dummy connection string if no database URL found
   - Prisma Client generation doesn't require real database connection

### Setting Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter variable name and value
4. Select environments:
   - **Production** (required)
   - **Preview** (optional, for branch deployments)
   - **Development** (optional, for local development)
5. Click **Save**
6. **Redeploy** after adding new variables

---

## 🗄️ Database Migrations

### Migration Workflow

Prisma migrations are used to manage database schema changes in production.

#### Migration Files Location
```
prisma/
├── migrations/
│   └── YYYYMMDDHHMMSS_migration_name/
│       └── migration.sql
└── schema.prisma
```

### Creating Migrations

**Local Development:**
```bash
# 1. Make changes to prisma/schema.prisma

# 2. Create migration
npm run prisma:migrate
# Or: npx prisma migrate dev --name migration_name

# 3. Migration file is created in prisma/migrations/
```

**Migration Naming Convention:**
- Format: `YYYYMMDDHHMMSS_descriptive_name`
- Example: `20260121092008_add_player_avatar_field`

### Applying Migrations to Production

#### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Link to your project
vercel link

# 3. Pull environment variables locally
vercel env pull .env.local

# 4. Verify DATABASE_URL is set
cat .env.local | grep DATABASE_URL

# 5. Run migrations
npx prisma migrate deploy

# 6. Verify migration success
npx prisma migrate status
```

#### Option B: Using Direct Database Connection

```bash
# 1. Get database connection string from Vercel Dashboard
#    Vercel Dashboard → Storage → Your Database → Connection String

# 2. Set DATABASE_URL locally
export DATABASE_URL="postgresql://user:password@host:5432/db"

# 3. Run migrations
npx prisma migrate deploy

# 4. Verify
npx prisma migrate status
```

#### Option C: Using Vercel Postgres Query Interface

1. Go to **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab
3. Copy SQL from `prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql`
4. Paste and execute in query interface
5. **⚠️ Warning**: This bypasses Prisma migration tracking

### Migration Best Practices

1. **Always test migrations locally first**
   ```bash
   # Test on local database
   npm run prisma:migrate
   ```

2. **Review migration SQL before applying**
   ```bash
   # View migration SQL
   cat prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql
   ```

3. **Backup database before migrations**
   - Use Vercel Postgres backup feature
   - Or export schema: `pg_dump -s database_name > backup.sql`

4. **Apply migrations during low-traffic periods**
   - Some migrations may lock tables
   - Plan for maintenance window if needed

5. **Verify migration status**
   ```bash
   npx prisma migrate status
   ```

### Migration Status Check

```bash
# Check which migrations have been applied
npx prisma migrate status

# Output shows:
# - Applied migrations (✅)
# - Pending migrations (⏳)
# - Database drift (if schema differs)
```

### Troubleshooting Migrations

**Error: "Migration failed"**
```bash
# 1. Check database connection
npx prisma db pull

# 2. Verify environment variables
echo $DATABASE_URL

# 3. Check migration SQL for errors
cat prisma/migrations/latest/migration.sql

# 4. Rollback if needed (see Rollback Plan section)
```

**Error: "Database schema drift detected"**
```bash
# 1. Check current schema
npx prisma db pull

# 2. Compare with schema.prisma
# 3. Create new migration to sync
npx prisma migrate dev --name fix_schema_drift
```

---

## 🔄 Rollback Plan

### Rollback Strategy

The application uses Prisma migrations which are **forward-only by default**. Rollback requires creating a new migration that reverses changes.

### Rollback Procedures

#### Scenario 1: Rollback Recent Migration (Before Next Deployment)

**If migration hasn't been applied to production yet:**
1. Remove migration file:
   ```bash
   rm -rf prisma/migrations/YYYYMMDDHHMMSS_bad_migration
   ```
2. Fix schema in `prisma/schema.prisma`
3. Create new migration:
   ```bash
   npm run prisma:migrate
   ```

#### Scenario 2: Rollback Applied Migration (Production)

**Step 1: Create Rollback Migration**

1. Identify the migration to rollback:
   ```bash
   npx prisma migrate status
   ```

2. Create a new migration that reverses the changes:
   ```bash
   # Example: If migration added a column, create migration that removes it
   # Edit prisma/schema.prisma to remove the change
   npx prisma migrate dev --name rollback_previous_migration
   ```

3. Review the rollback migration SQL:
   ```bash
   cat prisma/migrations/latest/migration.sql
   ```

4. Apply rollback migration:
   ```bash
   npx prisma migrate deploy
   ```

**Step 2: Verify Rollback**

```bash
# Check migration status
npx prisma migrate status

# Verify schema matches expected state
npx prisma db pull
```

#### Scenario 3: Emergency Database Rollback (Data Loss Risk)

**⚠️ WARNING: This may cause data loss. Use only in emergencies.**

1. **Restore from Backup**:
   ```bash
   # If using Vercel Postgres, use their backup feature
   # Or restore from pg_dump backup
   psql -d database_name < backup.sql
   ```

2. **Reset Migration State** (if needed):
   ```sql
   -- Connect to database
   -- Manually update _prisma_migrations table
   DELETE FROM "_prisma_migrations" 
   WHERE migration_name = 'YYYYMMDDHHMMSS_bad_migration';
   ```

3. **Reapply Valid Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

### Rollback Checklist

Before rolling back:
- [ ] Identify the problematic migration
- [ ] Understand what data will be affected
- [ ] Create database backup
- [ ] Test rollback on staging/local environment
- [ ] Notify team/users if downtime expected
- [ ] Document rollback steps

After rollback:
- [ ] Verify application functionality
- [ ] Check database integrity
- [ ] Monitor error logs
- [ ] Update documentation
- [ ] Create post-mortem if needed

### Preventing Rollback Scenarios

1. **Test migrations locally first**
2. **Use staging environment for testing**
3. **Review migration SQL before applying**
4. **Create database backups regularly**
5. **Use transactions in migrations when possible**
6. **Avoid destructive migrations (DROP, TRUNCATE) without backups**

---

## 🚀 Deployment Process

### Standard Deployment Flow

1. **Development**:
   ```bash
   # Make code changes
   # Test locally
   npm run dev
   ```

2. **Create Migration** (if schema changed):
   ```bash
   # Update prisma/schema.prisma
   npm run prisma:migrate
   ```

3. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

4. **Vercel Auto-Deployment**:
   - Vercel automatically detects push to `main`
   - Builds application
   - Deploys to production

5. **Apply Migrations** (if needed):
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

6. **Verify Deployment**:
   - Check Vercel deployment logs
   - Test application functionality
   - Monitor error logs

### Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Environment variables are set in Vercel
- [ ] Database migrations are created and tested
- [ ] Code is committed and pushed
- [ ] No breaking changes without migration plan
- [ ] Documentation is updated

### Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Application loads correctly
- [ ] Database migrations applied (if any)
- [ ] Authentication works
- [ ] Core features functional
- [ ] No errors in Vercel logs
- [ ] Health endpoint responds: `/api/health`

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
# Check application health
curl https://leagueladderapp.vercel.app/api/health

# Expected response:
# { "status": "ok" }
```

### Monitoring Points

1. **Vercel Dashboard**:
   - Deployment status
   - Function logs
   - Error rates
   - Response times

2. **Database**:
   - Connection pool status
   - Query performance
   - Migration status

3. **Application**:
   - API response times
   - Error rates
   - User authentication success rate

---

## 🔧 Troubleshooting

### Common Issues

#### Build Fails: "Prisma Client not generated"
```bash
# Solution: Ensure prisma generate runs in build
# Check package.json build script: "prisma generate && next build"
```

#### Runtime Error: "Database connection failed"
```bash
# Solution:
# 1. Verify DATABASE_URL is set in Vercel
# 2. Check database is active
# 3. Verify connection string format
# 4. Check Vercel function logs for details
```

#### Migration Error: "Migration already applied"
```bash
# Solution:
# 1. Check migration status: npx prisma migrate status
# 2. If migration is partially applied, may need manual fix
# 3. Consider creating new migration instead
```

#### Authentication Error: "AUTH_SECRET not configured"
```bash
# Solution:
# 1. Set AUTH_SECRET in Vercel environment variables
# 2. Redeploy after adding variable
# 3. Verify variable is enabled for Production environment
```

---

## 📝 Quick Reference

### Essential Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Apply migrations to production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# View database schema
npx prisma db pull

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Build for production
npm run build

# Pull Vercel environment variables
vercel env pull .env.local
```

### Environment Variable Quick Setup

```bash
# Required for production:
AUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Database (auto-set by Vercel Postgres):
POSTGRES_URL=<auto-provided>
POSTGRES_PRISMA_URL=<auto-provided>
```

---

**Last Updated**: January 2026  
**Production URL**: https://leagueladderapp.vercel.app/
