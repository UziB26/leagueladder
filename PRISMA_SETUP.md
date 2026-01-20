# Prisma Setup Guide

## What is Prisma?

Prisma is a modern ORM (Object-Relational Mapping) that provides:
- ✅ **Type Safety** - Full TypeScript support with autocomplete
- ✅ **Migrations** - Version-controlled database schema changes
- ✅ **Clean API** - Simple, intuitive database queries
- ✅ **NextAuth Integration** - Works seamlessly with `@auth/prisma-adapter`

## Setup Steps

### 1. Create Vercel Postgres Database

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Storage** → **Create Database** → **Postgres**
4. Name it: `league-ladder-db`
5. Click **Create**

Vercel automatically adds:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ✅ (This is what Prisma uses!)
- `POSTGRES_URL_NON_POOLING`

### 2. Generate Prisma Client

```bash
npx prisma generate
```

This creates the TypeScript types based on your schema.

### 3. Run Migrations

```bash
npx prisma migrate dev --name init
```

This creates the database tables from your schema.

**OR** if you already have a database, push the schema:

```bash
npx prisma db push
```

### 4. Seed Initial Data (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.league.upsert({
    where: { id: 'tt_league' },
    update: {},
    create: {
      id: 'tt_league',
      name: 'Table Tennis',
      gameType: 'table-tennis',
    },
  })

  await prisma.league.upsert({
    where: { id: 'fifa_league' },
    update: {},
    create: {
      id: 'fifa_league',
      name: 'Fifa',
      gameType: 'fifa',
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts"
  }
}
```

Run: `npx prisma db seed`

## Usage Examples

### Before (Raw SQL):
```typescript
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
```

### After (Prisma):
```typescript
const user = await prisma.user.findUnique({
  where: { email }
})
```

### Join League Example:
```typescript
// Create membership
const membership = await prisma.leagueMembership.create({
  data: {
    playerId: player.id,
    leagueId: leagueId,
    isActive: true,
  },
  include: {
    player: true,
    league: true,
  },
})

// Create rating
await prisma.playerRating.create({
  data: {
    playerId: player.id,
    leagueId: leagueId,
    rating: 1000,
  },
})
```

### Leaderboard Example:
```typescript
const players = await prisma.playerRating.findMany({
  where: { leagueId },
  include: {
    player: true,
  },
  orderBy: {
    rating: 'desc',
  },
  take: 100,
})
```

## Benefits Over Raw SQL

1. **Type Safety**: TypeScript knows all your fields
2. **Autocomplete**: IDE suggests available fields
3. **Relations**: Easy joins with `include`
4. **Migrations**: Version-controlled schema changes
5. **Validation**: Prisma validates data types
6. **Less Boilerplate**: No manual query building

## Next Steps

1. ✅ Install Prisma (done)
2. ✅ Create schema (done)
3. ⏳ Create Vercel Postgres database
4. ⏳ Generate Prisma client: `npx prisma generate`
5. ⏳ Run migrations: `npx prisma migrate dev`
6. ⏳ Update code to use Prisma

## Migration Strategy

You can migrate routes gradually:
1. Start with new routes using Prisma
2. Migrate critical routes (join league, leaderboard)
3. Keep old routes working with SQLite/raw SQL
4. Eventually migrate everything

The code can use both Prisma and raw SQL during transition!
