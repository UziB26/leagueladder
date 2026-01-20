import { defineConfig } from "prisma/config";

// Check for Prisma database URL variables in order of preference
// Your Vercel setup has PRISMA_DATABASE_URL, so we check that first
const databaseUrl = 
  process.env.PRISMA_DATABASE_URL ||      // Your current Vercel Postgres variable
  process.env.POSTGRES_PRISMA_URL ||      // Standard Vercel Postgres variable
  process.env.POSTGRES_URL ||             // Alternative Postgres URL
  process.env.DATABASE_URL;               // Generic fallback

if (!databaseUrl) {
  throw new Error(
    "Database connection URL is required.\n\n" +
    "Please set one of these environment variables:\n" +
    "- PRISMA_DATABASE_URL (preferred)\n" +
    "- POSTGRES_PRISMA_URL\n" +
    "- POSTGRES_URL\n" +
    "- DATABASE_URL\n\n" +
    "Set it in: Vercel Dashboard → Settings → Environment Variables"
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
