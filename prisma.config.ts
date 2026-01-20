import { defineConfig } from "prisma/config";

// Check for Prisma database URL variables in order of preference
// IMPORTANT: For migrations, use direct database URL (not Accelerate)
// Accelerate URLs (prisma+postgres://) don't work with migrations - they're query proxies only
// So we prioritize direct database URLs first
const databaseUrl = 
  process.env.DATABASE_URL ||             // Direct PostgreSQL connection (best for migrations)
  process.env.POSTGRES_URL ||             // Direct Postgres URL (also good for migrations)
  process.env.POSTGRES_PRISMA_URL;        // Standard Vercel Postgres variable

// Note: PRISMA_DATABASE_URL is for Accelerate (runtime queries only, not migrations)

// During build time (prisma generate), we don't need a real connection
// Prisma generate only needs the schema, not a database connection
// We provide a dummy URL if none is set to allow generation to proceed
const isBuildTime = process.env.VERCEL === '1' || 
                    process.env.NEXT_PHASE === 'phase-production-build';

// Use a dummy connection string ONLY during build/generate (not for migrations or push)
// This allows prisma generate to work without a real database connection
// The dummy URL is only used for schema parsing, not actual connection
// For migrations and db push, we MUST have a real database URL
const finalDatabaseUrl = databaseUrl || (isBuildTime 
  ? "postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
  : null);

if (!finalDatabaseUrl) {
  throw new Error(
    "Database connection URL is required.\n\n" +
    "Please set one of these environment variables:\n" +
    "- DATABASE_URL (direct PostgreSQL connection - preferred for migrations)\n" +
    "- POSTGRES_URL (direct Postgres connection)\n" +
    "- POSTGRES_PRISMA_URL\n\n" +
    "Note: PRISMA_DATABASE_URL is for Accelerate (runtime only, not migrations)\n\n" +
    "Create a .env.local file with:\n" +
    "DATABASE_URL=\"your-postgresql-connection-string\"\n\n" +
    "Or set it in: Vercel Dashboard → Settings → Environment Variables"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: finalDatabaseUrl,
  },
  migrations: {
    seed: "ts-node --project tsconfig.prisma.json -r dotenv/config prisma/seed.ts"
  },
});
