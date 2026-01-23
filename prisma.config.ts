import { defineConfig } from "prisma/config";

// CRITICAL: Force binary engine type BEFORE any Prisma operations
// This must be set before Prisma CLI reads the config
// Setting it here ensures it's available during prisma generate
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// Load .env files if dotenv is available (optional for build environments)
// In Amplify/Vercel, environment variables are already set, so dotenv isn't needed
try {
  const { config } = require("dotenv");
  // Load .env.local first (Prisma CLI doesn't load it automatically)
  // Then load .env as fallback
  config({ path: require("path").resolve(process.cwd(), ".env.local") });
  config({ path: require("path").resolve(process.cwd(), ".env") });
} catch (error) {
  // dotenv not available - this is fine in build environments where env vars are already set
  // Environment variables should be set in Amplify Console
}

// Ensure engine type is still set after dotenv loads (in case it was overridden)
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

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
// Support both Vercel and AWS Amplify build environments
const isBuildTime = process.env.VERCEL === '1' || 
                    process.env.AWS_AMPLIFY === 'true' ||
                    process.env.AWS_EXECUTION_ENV !== undefined || // AWS Amplify/Lambda
                    process.env.NEXT_PHASE === 'phase-production-build' ||
                    process.env.CI === 'true'; // Generic CI detection

// Use a dummy connection string ONLY during build/generate (not for migrations or push)
// This allows prisma generate to work without a real database connection
// The dummy URL is only used for schema parsing, not actual connection
// For migrations and db push, we MUST have a real database URL
// IMPORTANT: Never use Accelerate URLs (prisma+postgres://) here - they cause engine type detection issues
const finalDatabaseUrl = databaseUrl || (isBuildTime 
  ? "postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
  : null);

// Ensure DATABASE_URL is set in environment for Prisma Client generation
// This prevents Prisma from detecting "client" engine type during generate
if (isBuildTime && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = finalDatabaseUrl || "postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
}

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
  datasourceUrl: finalDatabaseUrl,
  // Note: Generator configuration (including engineType) is in schema.prisma
  // The generator there is set to engineType = "binary" which is what we want
  migrations: {
    seed: "ts-node --project tsconfig.prisma.json -r dotenv/config prisma/seed.ts"
  },
});
