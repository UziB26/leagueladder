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
  
  // During build time, ensure DATABASE_URL is set (even if dummy)
  // CRITICAL: For AWS Amplify, ONLY use DATABASE_URL (ignore Vercel variables)
  // This prevents Prisma from detecting "client" engine type due to Vercel Accelerate URLs
  const isAwsAmplify = process.env.AWS_AMPLIFY === 'true' || process.env.AWS_EXECUTION_ENV !== undefined
  const isVercel = process.env.VERCEL === '1'
  
  if ((isVercel || isAwsAmplify || process.env.CI === 'true') && !process.env.DATABASE_URL) {
    if (isAwsAmplify) {
      // AWS Amplify: ONLY use DATABASE_URL, ignore Vercel variables
      process.env.DATABASE_URL = process.env.DATABASE_URL || 
        'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    } else {
      // Vercel or CI: Can use Vercel variables
      process.env.DATABASE_URL = process.env.DATABASE_URL || 
        process.env.PRISMA_DATABASE_URL || 
        process.env.POSTGRES_PRISMA_URL || 
        process.env.POSTGRES_URL ||
        'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    }
  }
}

// Export nothing - this is just a side-effect module
export {}
