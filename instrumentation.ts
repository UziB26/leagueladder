/**
 * Next.js Instrumentation Hook
 * This file runs before any other code, ensuring environment variables are set
 * 
 * IMPORTANT: This file must be at the root of the project
 * Enable it in next.config.ts with: experimental.instrumentationHook = true
 */

// CRITICAL: Set Prisma engine type at the absolute earliest point
// This runs before ANY other code, including API routes
if (typeof process !== 'undefined') {
  // Force binary engine type unconditionally
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  // During build time, ensure DATABASE_URL is set (even if dummy)
  // This prevents Prisma from detecting "client" engine type
  if ((process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true') && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 
      process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  }
}

export async function register() {
  // This function runs when the instrumentation is loaded
  // Ensure environment variables are set
  if (typeof process !== 'undefined') {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  }
}
