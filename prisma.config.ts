import { defineConfig } from "prisma/config";

// Check for Prisma database URL variables in order of preference
// Your Vercel setup has PRISMA_DATABASE_URL, so we check that first
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Your current Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback

// During build time (prisma generate), we don't need a real connection
// Prisma generate only needs the schema, not a database connection
// We provide a dummy URL if none is set to allow generation to proceed
const isBuildTime = process.env.VERCEL === '1' || 
                    process.env.NEXT_PHASE === 'phase-production-build' ||
                    process.env.NODE_ENV === 'production';

// Use a dummy connection string during build if no URL is provided
// This allows prisma generate to work without a real database connection
// The dummy URL is only used for schema parsing, not actual connection
const finalDatabaseUrl = databaseUrl || (isBuildTime 
  ? "postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
  : null);

if (!finalDatabaseUrl) {
  throw new Error(
    "Database connection URL is required.\n\n" +
    "Please set one of these environment variables:\n" +
    "- PRISMA_DATABASE_URL (preferred)\n" +
    "- POSTGRES_PRISMA_URL\n" +
    "- POSTGRES_URL\n" +
    "- DATABASE_URL\n\n" +
    "Set it in: Vercel Dashboard → Settings → Environment Variables\n\n" +
    "Note: During build, a dummy URL will be used for schema generation only."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: finalDatabaseUrl,
  },
});
