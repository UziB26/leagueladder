/**
 * Prisma Environment Setup
 * This file MUST be imported before any PrismaClient imports
 * It ensures PRISMA_CLIENT_ENGINE_TYPE is set before module evaluation
 */

// CRITICAL: Force binary engine type at the absolute earliest point
// This must run before ANY Prisma-related code is evaluated
if (typeof process !== 'undefined') {
  // Set it unconditionally - don't check if it exists first
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  // During build time (Amplify/Vercel), ensure DATABASE_URL is set even if dummy
  // This prevents Prisma from detecting "client" engine type
  if ((process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true') && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 
      process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  }
}

// Export nothing - this is just a side-effect module
export {}
