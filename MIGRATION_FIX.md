# Fix for Prisma Migration Error

## Problem
The error occurs because:
1. The baseline migration file was empty (just a comment)
2. Prisma needs valid SQL in migration files, even if it's just comments

## Solution Options

### Option 1: Use `prisma db push` (Recommended - Bypasses Migration System)

This will sync your schema directly without using migrations:

```bash
npx prisma db push
```

This will create the `verification_tokens` table directly from your schema.

**Note**: This doesn't create a migration file, but it will update your database.

### Option 2: Manually Apply SQL

If `db push` doesn't work, you can manually run the SQL:

1. Connect to your database (via Prisma Studio or direct connection)
2. Run this SQL:

```sql
CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "verification_tokens_identifier_token_key" UNIQUE ("identifier", "token")
);

CREATE INDEX IF NOT EXISTS "verification_tokens_identifier_idx" ON "verification_tokens"("identifier");
CREATE INDEX IF NOT EXISTS "verification_tokens_token_idx" ON "verification_tokens"("token");
CREATE INDEX IF NOT EXISTS "verification_tokens_expires_idx" ON "verification_tokens"("expires");
```

3. Then mark the migration as applied:

```bash
npx prisma migrate resolve --applied 20260126120000_add_email_verification
```

### Option 3: Fix Network Issue and Retry

If you have a proxy or network issue:

1. Check your network connection
2. Try again:
```bash
npm run prisma:migrate
```

## Quick Fix (Recommended)

Just use `db push` to sync the schema:

```bash
npx prisma db push
npx prisma generate
```

This will:
- Create the `verification_tokens` table
- Generate Prisma Client with the new model
- Skip the migration system (which is fine for this change)

Then you can continue with the rest of the setup!
