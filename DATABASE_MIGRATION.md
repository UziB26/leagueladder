# Database Migration: SQLite → Vercel Postgres

This guide documents the migration from SQLite to Vercel Postgres for persistent storage on Vercel.

## Why Migrate?

- **SQLite on Vercel is ephemeral** - Data resets between deployments/function invocations
- **Vercel Postgres is persistent** - Data survives deployments and is shared across functions
- **Better for production** - Proper database with connection pooling, backups, etc.

## Migration Steps

### 1. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose a name (e.g., `league-ladder-db`)
6. Select a region (choose closest to your users)
7. Click **Create**

Vercel will automatically:
- Create the database
- Add connection string to environment variables
- Set up `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`

### 2. Install Dependencies

```bash
npm install @vercel/postgres
```

### 3. Database Schema Changes

**SQLite → PostgreSQL differences:**
- `TEXT` → `VARCHAR` or `TEXT` (both work, TEXT is fine)
- `INTEGER` → `INTEGER` (same)
- `BOOLEAN` → `BOOLEAN` (same)
- `DATETIME` → `TIMESTAMP` or `TIMESTAMPTZ`
- `PRAGMA foreign_keys` → Not needed (PostgreSQL enforces by default)
- `INSERT OR IGNORE` → `INSERT ... ON CONFLICT DO NOTHING`
- `CREATE TRIGGER` → Similar syntax, but some differences

### 4. Query Changes

**SQLite (synchronous):**
```typescript
const result = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
db.prepare('INSERT INTO users ...').run(id, email, name)
```

**PostgreSQL (async):**
```typescript
const result = await sql`SELECT * FROM users WHERE email = ${email}`
await sql`INSERT INTO users ... VALUES (${id}, ${email}, ${name})`
```

### 5. Environment Variables

After creating the database, Vercel automatically adds:
- `POSTGRES_URL` - Connection string for serverless functions
- `POSTGRES_PRISMA_URL` - For Prisma (if using)
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

For local development, add to `.env.local`:
```env
POSTGRES_URL=your_local_postgres_url
```

## Migration Checklist

- [ ] Create Vercel Postgres database
- [ ] Install @vercel/postgres package
- [ ] Create new database adapter (lib/db/postgres.ts)
- [ ] Convert schema to PostgreSQL
- [ ] Update all API routes to async
- [ ] Update auth.ts
- [ ] Update transactions.ts
- [ ] Test locally with local PostgreSQL
- [ ] Deploy to Vercel
- [ ] Verify data persistence

## Rollback Plan

If issues occur:
1. Keep SQLite code in a branch
2. Can switch back by changing database import
3. Data migration script can export SQLite → PostgreSQL if needed

## Next Steps

See the implementation files for the actual migration code.
