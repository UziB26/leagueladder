/**
 * Next.js Instrumentation Hook
 * This file runs before any other code, ensuring environment variables are set
 * 
 * IMPORTANT: This file must be at the root of the project
 * Enable it in next.config.ts with: experimental.instrumentationHook = true
 */

// CRITICAL: Set Prisma engine type at the absolute earliest point
// This runs before ANY other code, including API routes
// This is especially important for AWS Amplify builds
if (typeof process !== 'undefined') {
  // Force binary engine type unconditionally - set it multiple times to ensure it sticks
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  // CRITICAL for Amplify: Set AWS_AMPLIFY flag if we detect AWS environment
  if (!process.env.AWS_AMPLIFY && (process.env.AWS_EXECUTION_ENV || process.env.AWS_REGION)) {
    process.env.AWS_AMPLIFY = 'true'
  }
  
  // During build time, ensure DATABASE_URL is set (even if dummy)
  // This prevents Prisma from detecting "client" engine type
  const isBuildTime = process.env.VERCEL === '1' || 
                      process.env.AWS_AMPLIFY === 'true' || 
                      process.env.AWS_EXECUTION_ENV !== undefined ||
                      process.env.CI === 'true'
  
  if (isBuildTime && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 
      process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  }
  
  // Re-assert binary engine type after setting DATABASE_URL
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}

export async function register() {
  // This function runs when the instrumentation is loaded
  // Ensure environment variables are set
  if (typeof process !== 'undefined') {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  }
}
