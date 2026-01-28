# League Ladder - Production Deployment Guide

This document describes how production deployment works, including environment variables, database migrations, and rollback procedures.

**Last Updated**: January 2026  
**Production URL**: https://leagueladderapp.vercel.app/  
**Status**: Production Ready ✅

---

## 🏗️ Production Architecture

### Deployment Platform
- **Hosting**: Vercel (serverless functions)
- **Database**: PostgreSQL (Vercel Postgres or external provider)
- **ORM**: Prisma 7 with binary engine
- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth.js v5
- **Runtime**: Node.js 18+ (serverless functions)

### How Production Works

#### 1. Build Process
```mermaid
graph LR
    A[Git Push to main] --> B[Vercel Detects Push]
    B --> C[Install Dependencies]
    C --> D[Run Build Command]
    D --> E[Prisma Generate]
    E --> F[Next.js Build]
    F --> G[Deploy to Production]
```

**Build Steps:**
1. Vercel automatically builds on push to `main` branch
2. Build command: `npm run build` (which runs `npm run prisma-generate && next build`)
3. **Prisma Client Generation**:
   - `prisma.config.ts` is read to get database URL
   - During build, a dummy connection string is used if no real URL is available
   - Prisma Client is generated with binary engine type
   - Generated client is included in the build
4. **Next.js Compilation**:
   - TypeScript is compiled
   - React components are optimized
   - Server components are pre-rendered where possible
   - Static assets are optimized
5. **Deployment**:
   - Serverless functions are created for API routes
   - Static assets are deployed to CDN
   - Application is live at production URL

#### 2. Runtime
- **Serverless Functions**: Each API route runs as an isolated serverless function
- **Database Connection**: Each function invocation connects to PostgreSQL via Prisma
- **Connection Pooling**: Managed automatically by Prisma (connection pooling for serverless)
- **Sessions**: Stored in database via NextAuth.js (`sessions` table)
- **Function Timeout**: 30 seconds maximum (configured in `vercel.json`)

#### 3. Database
- **PostgreSQL Database**: Persistent, production-ready database
- **Schema Management**: Managed via Prisma migrations
- **Connection Strings**: Provided via environment variables
- **Connection Pooling**: Automatic via Prisma for serverless functions
- **No Database Triggers**: All business logic in application layer

---

## 🔐 Environment Variables

### Required Environment Variables

All environment variables must be set in **Vercel Dashboard → Settings → Environment Variables** for the Production environment.

#### Authentication Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `AUTH_SECRET` | ✅ Yes | Secret key for NextAuth session encryption (preferred in NextAuth v5) | `d/I8oYQAwR+KOMizPCteb+UWFx1sdlB2uKSMP8t4Vcw=` |
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

**Important Notes:**
- `AUTH_SECRET` is the preferred variable for NextAuth.js v5
- `NEXTAUTH_SECRET` is used as fallback for compatibility
- Both should be set to the same value for consistency
- Secret must be at least 32 characters
- Never commit secrets to version control

#### Database Variables

The application checks for database connection strings in this order:

**For Runtime (API Routes):**
1. `PRISMA_DATABASE_URL` - Prisma-optimized connection (can be Accelerate URL)
2. `POSTGRES_PRISMA_URL` - Standard Vercel Postgres variable (pooling)
3. `POSTGRES_URL` - Direct Postgres URL (Vercel Postgres)
4. `DATABASE_URL` - Generic fallback

**For Migrations (Prisma CLI):**
1. `DATABASE_URL` - Direct PostgreSQL connection (preferred for migrations)
2. `POSTGRES_URL` - Direct Postgres URL
3. `POSTGRES_PRISMA_URL` - Prisma-optimized connection
4. **Does NOT support** Accelerate URLs (`prisma+postgres://`) - requires direct connection

**Vercel Postgres automatically provides:**
- `POSTGRES_URL` - Direct connection string (pooling enabled)
- `POSTGRES_PRISMA_URL` - Prisma-optimized connection string (pooling)
- `POSTGRES_URL_NON_POOLING` - Non-pooling connection (for migrations)
- `PRISMA_DATABASE_URL` - Accelerate connection (if enabled, runtime only)

**For External PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

**Connection String Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public
```

#### Build-Time Variables

| Variable | Required | Description | How It's Set |
|----------|----------|-------------|--------------|
| `VERCEL` | Auto-set | Automatically set by Vercel (indicates build environment) | Vercel sets to `"1"` |
| `NEXT_PHASE` | Auto-set | Set to `phase-production-build` during build | Next.js sets automatically |
| `PRISMA_CLIENT_ENGINE_TYPE` | Auto-set | Set to `binary` to force binary engine | Set in `next.config.ts` and `prisma.config.ts` |
| `DATABASE_URL` | Auto-set (build) | Dummy connection string during build if not provided | Set in build scripts |

**Build-Time Behavior:**
- During build, if no database URL is found, a dummy connection string is used
- This allows Prisma Client generation without a real database connection
- The dummy URL is: `postgresql://dummy:dummy@localhost:5432/dummy?schema=public`
- Prisma Client generation doesn't require a real database connection

### Environment Variable Priority

#### Runtime (API Routes)
The application uses this priority order (from `src/lib/db/prisma.ts`):
1. `PRISMA_DATABASE_URL` (can be Accelerate URL: `prisma+postgres://...`)
2. `POSTGRES_PRISMA_URL` (pooling enabled)
3. `POSTGRES_URL` (direct connection)
4. `DATABASE_URL` (generic fallback)

#### Migrations (Prisma CLI)
Prisma migrations use this priority (from `prisma.config.ts`):
1. `DATABASE_URL` (preferred for migrations)
2. `POSTGRES_URL` (direct connection)
3. `POSTGRES_PRISMA_URL` (Prisma-optimized)
4. **Does NOT support** Accelerate URLs (migrations require direct connection)

#### Build Time
- Uses dummy connection string if no database URL found
- Prisma Client generation doesn't require real database connection
- Dummy URL prevents Prisma from detecting "client" engine type

### Setting Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Enter variable name and value
4. Select environments:
   - **Production** (required)
   - **Preview** (optional, for branch deployments)
   - **Development** (optional, for local development)
5. Click **Save**
6. **Redeploy** after adding new variables (changes take effect on next deployment)

**Important:**
- Environment variables are encrypted at rest
- Variables are injected at build time and runtime
- Changes require redeployment to take effect
- Use different values for Production vs Preview environments

### Environment Variable Checklist

**Required for Production:**
- [ ] `AUTH_SECRET` - NextAuth session encryption
- [ ] `NEXTAUTH_URL` - Full production URL
- [ ] `NEXT_PUBLIC_APP_URL` - Public app URL (optional but recommended)
- [ ] Database connection (one of: `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `PRISMA_DATABASE_URL`)

**Auto-Provided by Vercel Postgres:**
- [x] `POSTGRES_URL` - Direct connection
- [x] `POSTGRES_PRISMA_URL` - Prisma-optimized
- [x] `POSTGRES_URL_NON_POOLING` - For migrations
- [x] `PRISMA_DATABASE_URL` - If Accelerate enabled

**Auto-Set by Vercel:**
- [x] `VERCEL` - Set to `"1"`
- [x] `NEXT_PHASE` - Set during build
- [x] `NODE_ENV` - Set to `"production"`

---

## 🗄️ Database Migrations

### Migration Workflow

Prisma migrations are used to manage database schema changes in production. The application uses **Prisma 7** with `prisma.config.ts` for connection configuration.

#### Migration Files Location
```
prisma/
├── migrations/
│   └── YYYYMMDDHHMMSS_migration_name/
│       └── migration.sql
├── schema.prisma          # Database schema definition
└── prisma.config.ts       # Prisma 7 connection configuration
```

### Creating Migrations

**Local Development:**
```bash
# 1. Make changes to prisma/schema.prisma

# 2. Create migration
npm run prisma:migrate
# Or: npx prisma migrate dev --name migration_name

# 3. Migration file is created in prisma/migrations/
# 4. Migration is automatically applied to local database
```

**Migration Naming Convention:**
- Format: `YYYYMMDDHHMMSS_descriptive_name`
- Example: `20260121092008_add_admin_actions_table`
- Use descriptive names that explain what the migration does

### Applying Migrations to Production

#### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Link to your project
vercel link

# 3. Pull environment variables locally
vercel env pull .env.local

# 4. Verify DATABASE_URL is set (for migrations)
cat .env.local | grep DATABASE_URL

# 5. Run migrations (uses DATABASE_URL from .env.local)
npx prisma migrate deploy

# 6. Verify migration success
npx prisma migrate status
```

**Expected Output:**
```
Prisma Migrate
Status: All migrations have been applied
```

#### Option B: Using Direct Database Connection

```bash
# 1. Get database connection string from Vercel Dashboard
#    Vercel Dashboard → Storage → Your Database → Connection String
#    Use POSTGRES_URL_NON_POOLING for migrations

# 2. Set DATABASE_URL locally
export DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"
# Or on Windows PowerShell:
# $env:DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"

# 3. Run migrations
npx prisma migrate deploy

# 4. Verify
npx prisma migrate status
```

#### Option C: Using Vercel Postgres Query Interface (Not Recommended)

1. Go to **Vercel Dashboard** → **Storage** → Your Database
2. Click **Query** tab
3. Copy SQL from `prisma/migrations/YYYYMMDDHHMMSS_migration_name/migration.sql`
4. Paste and execute in query interface

**⚠️ Warning**: This bypasses Prisma migration tracking. Only use if absolutely necessary and manually update `_prisma_migrations` table.

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
   - Use Vercel Postgres backup feature (if available)
   - Or export schema: `pg_dump -s database_name > backup.sql`
   - Or use Vercel Dashboard → Storage → Backup

4. **Apply migrations during low-traffic periods**
   - Some migrations may lock tables
   - Plan for maintenance window if needed
   - Consider using `CREATE INDEX CONCURRENTLY` for large tables

5. **Verify migration status**
   ```bash
   npx prisma migrate status
   ```

6. **Use transactions in migrations when possible**
   - Prisma migrations run in transactions by default
   - Ensures atomicity (all or nothing)

### Migration Status Check

```bash
# Check which migrations have been applied
npx prisma migrate status

# Output shows:
# ✅ Applied migrations
# ⏳ Pending migrations
# ⚠️ Database drift (if schema differs)
```

**Example Output:**
```
Database schema is up to date!

Following migrations have been applied:

migrations/
  └── 20260121092008_init/
    └── migration.sql
```

### Troubleshooting Migrations

**Error: "Migration failed"**
```bash
# 1. Check database connection
npx prisma db pull

# 2. Verify environment variables
echo $DATABASE_URL
# Or on Windows:
# echo %DATABASE_URL%

# 3. Check migration SQL for errors
cat prisma/migrations/latest/migration.sql

# 4. Check Prisma migration table
npx prisma studio
# Navigate to _prisma_migrations table

# 5. Rollback if needed (see Rollback Plan section)
```

**Error: "Database schema drift detected"**
```bash
# 1. Check current schema
npx prisma db pull

# 2. Compare with schema.prisma
# 3. Create new migration to sync
npx prisma migrate dev --name fix_schema_drift
```

**Error: "Migration already applied"**
```bash
# 1. Check migration status
npx prisma migrate status

# 2. If migration is partially applied, may need manual fix
# 3. Consider creating new migration instead of re-applying
```

**Error: "Cannot connect to database"**
```bash
# 1. Verify DATABASE_URL is set correctly
# 2. Check database is active in Vercel Dashboard
# 3. Verify connection string format
# 4. Check network/firewall settings
```

---

## 🔄 Rollback Plan

### Rollback Strategy

The application uses Prisma migrations which are **forward-only by default**. Rollback requires creating a new migration that reverses changes.

### Rollback Procedures

#### Scenario 1: Rollback Recent Migration (Before Production Deployment)

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

4. Test locally before deploying

#### Scenario 2: Rollback Applied Migration (Production)

**Step 1: Create Rollback Migration**

1. Identify the migration to rollback:
   ```bash
   npx prisma migrate status
   ```

2. Review the migration SQL to understand what it did:
   ```bash
   cat prisma/migrations/YYYYMMDDHHMMSS_bad_migration/migration.sql
   ```

3. Create a new migration that reverses the changes:
   ```bash
   # Edit prisma/schema.prisma to remove/revert the change
   # Example: If migration added a column, remove it from schema
   
   # Create rollback migration
   npx prisma migrate dev --name rollback_previous_migration
   ```

4. Review the rollback migration SQL:
   ```bash
   cat prisma/migrations/latest/migration.sql
   ```

5. Test rollback migration locally:
   ```bash
   # Apply original migration
   npx prisma migrate deploy
   
   # Apply rollback migration
   npx prisma migrate deploy
   
   # Verify schema is back to original state
   npx prisma db pull
   ```

6. Apply rollback migration to production:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

**Step 2: Verify Rollback**

```bash
# Check migration status
npx prisma migrate status

# Verify schema matches expected state
npx prisma db pull

# Test application functionality
# Check that features work as expected
```

#### Scenario 3: Emergency Database Rollback (Data Loss Risk)

**⚠️ WARNING: This may cause data loss. Use only in emergencies.**

1. **Restore from Backup**:
   ```bash
   # If using Vercel Postgres, use their backup feature
   # Vercel Dashboard → Storage → Your Database → Backups
   
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

#### Scenario 4: Rollback Application Code (No Database Changes)

If you need to rollback application code without database changes:

1. **Revert Git Commit**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Vercel Auto-Redeploy**:
   - Vercel automatically redeploys on push
   - Previous deployment remains available for instant rollback

3. **Manual Rollback via Vercel Dashboard**:
   - Go to **Deployments** tab
   - Find previous working deployment
   - Click **three dots (⋯)** → **Promote to Production**

### Rollback Checklist

**Before Rolling Back:**
- [ ] Identify the problematic migration or deployment
- [ ] Understand what data will be affected
- [ ] Create database backup
- [ ] Test rollback on staging/local environment
- [ ] Notify team/users if downtime expected
- [ ] Document rollback steps
- [ ] Have rollback plan ready

**During Rollback:**
- [ ] Stop any ongoing operations if possible
- [ ] Execute rollback steps carefully
- [ ] Monitor for errors
- [ ] Verify each step completes successfully

**After Rollback:**
- [ ] Verify application functionality
- [ ] Check database integrity
- [ ] Monitor error logs
- [ ] Test critical user flows
- [ ] Update documentation
- [ ] Create post-mortem if needed
- [ ] Plan fix for the original issue

### Preventing Rollback Scenarios

1. **Test migrations locally first**
   - Always test on local database
   - Verify migration SQL is correct

2. **Use staging environment for testing**
   - Deploy to preview branch first
   - Test migrations on preview database

3. **Review migration SQL before applying**
   - Check for destructive operations (DROP, TRUNCATE)
   - Verify data transformations are correct

4. **Create database backups regularly**
   - Use Vercel Postgres backup feature
   - Or schedule automated backups

5. **Use transactions in migrations**
   - Prisma migrations run in transactions by default
   - Ensures atomicity

6. **Avoid destructive migrations without backups**
   - Never DROP tables without backup
   - Never TRUNCATE without backup
   - Always have rollback plan

7. **Incremental migrations**
   - Break large changes into smaller migrations
   - Easier to test and rollback

---

## 🚀 Deployment Process

### Standard Deployment Flow

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Git as Git Repository
    participant Vercel as Vercel
    participant Build as Build Process
    participant DB as PostgreSQL
    participant Prod as Production

    Dev->>Git: Make changes & commit
    Dev->>Git: Push to main branch
    Git->>Vercel: Webhook triggers build
    Vercel->>Build: Start build process
    Build->>Build: Install dependencies
    Build->>Build: Generate Prisma Client
    Build->>Build: Build Next.js app
    Build->>Vercel: Build complete
    Vercel->>Prod: Deploy to production
    Prod->>DB: Connect to database
    Dev->>DB: Run migrations (if needed)
    Prod->>Prod: Application live
```

**Step-by-Step:**

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
   # Test migration locally
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
   - Previous deployment remains available

5. **Apply Migrations** (if needed):
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

6. **Verify Deployment**:
   - Check Vercel deployment logs
   - Test application functionality
   - Monitor error logs
   - Check health endpoint: `/api/health`

### Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Code is linted and formatted
- [ ] Environment variables are set in Vercel
- [ ] Database migrations are created and tested locally
- [ ] Migration SQL is reviewed
- [ ] Code is committed and pushed
- [ ] No breaking changes without migration plan
- [ ] Documentation is updated
- [ ] Database backup is available (if schema changes)

### Post-Deployment Checklist

- [ ] Build completed successfully
- [ ] Application loads correctly
- [ ] Database migrations applied (if any)
- [ ] Migration status verified: `npx prisma migrate status`
- [ ] Authentication works (login/register)
- [ ] Core features functional (leagues, challenges, matches)
- [ ] No errors in Vercel logs
- [ ] Health endpoint responds: `/api/health`
- [ ] Admin features work (if admin user exists)
- [ ] Database connection is stable

### Deployment Monitoring

**During Deployment:**
- Monitor Vercel build logs
- Watch for build errors
- Check function compilation

**After Deployment:**
- Test critical user flows
- Monitor error rates in Vercel Dashboard
- Check database connection health
- Verify API endpoints respond correctly

---

## 📊 Monitoring & Health Checks

### Health Check Endpoint

```bash
# Check application health
curl https://leagueladderapp.vercel.app/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2026-01-26T10:30:00.000Z",
#   "service": "league-ladder-api"
# }
```

### Monitoring Points

1. **Vercel Dashboard**:
   - Deployment status
   - Function logs
   - Error rates
   - Response times
   - Function invocations
   - Bandwidth usage

2. **Database**:
   - Connection pool status
   - Query performance
   - Migration status
   - Database size
   - Active connections

3. **Application**:
   - API response times
   - Error rates
   - User authentication success rate
   - Function execution duration
   - Memory usage

### Key Metrics to Monitor

- **Uptime**: Application availability
- **Response Time**: API endpoint response times
- **Error Rate**: Percentage of failed requests
- **Database Connections**: Active connection count
- **Function Duration**: Serverless function execution time
- **Build Success Rate**: Percentage of successful deployments

---

## 🔧 Troubleshooting

### Common Issues

#### Build Fails: "Prisma Client not generated"

**Symptoms:**
- Build error: "Cannot find module '@prisma/client'"
- Prisma Client import errors

**Solution:**
```bash
# Verify build script includes prisma generate
# Check package.json:
# "build": "npm run prisma-generate && next build"

# Manually generate if needed
npm run prisma:generate
```

**Prevention:**
- Ensure `prisma generate` runs before `next build`
- Check `package.json` build script

---

#### Runtime Error: "Database connection failed"

**Symptoms:**
- API routes return 500 errors
- Database query failures
- Connection timeout errors

**Solution:**
1. Verify database connection string is set in Vercel:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Check `DATABASE_URL`, `POSTGRES_URL`, or `POSTGRES_PRISMA_URL` is set

2. Check database is active:
   - Vercel Dashboard → Storage → Your Database
   - Verify database status is "Active"

3. Verify connection string format:
   ```
   postgresql://user:password@host:5432/database?schema=public
   ```

4. Check Vercel function logs for detailed error messages:
   - Vercel Dashboard → Deployments → Latest → Functions → View Logs

5. Test connection locally:
   ```bash
   vercel env pull .env.local
   npx prisma db pull
   ```

---

#### Migration Error: "Migration already applied"

**Symptoms:**
- Error when running `prisma migrate deploy`
- Migration appears in `_prisma_migrations` but schema doesn't match

**Solution:**
```bash
# 1. Check migration status
npx prisma migrate status

# 2. If migration is partially applied, may need manual fix
# 3. Consider creating new migration instead of re-applying
# 4. If needed, manually update _prisma_migrations table
```

---

#### Authentication Error: "AUTH_SECRET not configured"

**Symptoms:**
- Login/registration fails
- Session errors
- NextAuth configuration errors

**Solution:**
1. Set `AUTH_SECRET` in Vercel environment variables:
   - Vercel Dashboard → Settings → Environment Variables
   - Add `AUTH_SECRET` with generated secret
   - Enable for Production environment

2. Also set `NEXTAUTH_SECRET` (for compatibility):
   - Use same value as `AUTH_SECRET`

3. Verify `NEXTAUTH_URL` is set correctly:
   - Should match your production URL exactly

4. Redeploy after adding variables:
   - Variables require redeployment to take effect

---

#### Build Error: "Prisma schema validation error"

**Symptoms:**
- Build fails with Prisma schema errors
- "Cannot resolve environment variable" errors

**Solution:**
1. Verify `prisma.config.ts` exists and is correct
2. Verify `prisma/schema.prisma` does NOT have `url = env(...)` in datasource block
3. Run validation locally:
   ```bash
   npx prisma validate
   ```
4. Check that database URL is available (or dummy URL for build)

---

#### Runtime Error: "Cannot find module '@prisma/client'"

**Symptoms:**
- Application fails to start
- Import errors for Prisma Client

**Solution:**
1. Verify Prisma Client is generated:
   ```bash
   npm run prisma:generate
   ```

2. Check build process includes Prisma generation:
   - Build script should run `prisma generate` before `next build`

3. Verify `@prisma/client` is in `package.json` dependencies

---

#### Database Query Timeout

**Symptoms:**
- Slow API responses
- Function timeout errors (30s limit)

**Solution:**
1. Optimize database queries:
   - Add indexes for frequently queried columns
   - Use `select` to limit returned fields
   - Avoid N+1 queries

2. Check query performance:
   ```bash
   # Enable Prisma query logging
   # Check logs in Vercel Dashboard
   ```

3. Consider pagination for large datasets
4. Use database connection pooling (automatic with Prisma)

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

# Validate Prisma schema
npx prisma validate
```

### Environment Variable Quick Setup

```bash
# Required for production:
AUTH_SECRET=<generated-secret>
NEXTAUTH_SECRET=<same-as-auth-secret>
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Database (auto-set by Vercel Postgres):
POSTGRES_URL=<auto-provided>
POSTGRES_PRISMA_URL=<auto-provided>
POSTGRES_URL_NON_POOLING=<auto-provided>
PRISMA_DATABASE_URL=<auto-provided-if-accelerate-enabled>
```

### Migration Quick Reference

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Check status
npx prisma migrate status

# Reset database (development only - DESTRUCTIVE)
npx prisma migrate reset
```

### Rollback Quick Reference

```bash
# Create rollback migration
# 1. Edit prisma/schema.prisma to revert changes
# 2. Create migration
npx prisma migrate dev --name rollback_previous

# Apply rollback
npx prisma migrate deploy

# Promote previous deployment (Vercel)
# Vercel Dashboard → Deployments → Previous → Promote to Production
```

---

## 🔒 Security Considerations

### Environment Variables
- Never commit secrets to version control
- Use Vercel's encrypted environment variables
- Rotate secrets periodically
- Use different secrets for Production vs Preview

### Database Security
- Use connection pooling (automatic with Prisma)
- Limit database user permissions
- Use SSL connections (enforced by Vercel Postgres)
- Regular backups

### Application Security
- Rate limiting on all API endpoints
- Input sanitization and validation
- Authentication required for protected routes
- Admin authorization verified from database

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Migration Guide](https://www.prisma.io/docs/guides/migrate)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Last Updated**: January 2026  
**Production URL**: https://leagueladderapp.vercel.app/  
**Status**: Production Ready ✅
