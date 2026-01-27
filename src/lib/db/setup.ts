/**
 * Prisma Environment Setup
 * This file MUST be imported before any PrismaClient imports
 * It ensures PRISMA_CLIENT_ENGINE_TYPE is set before module evaluation
 */

// CRITICAL: Force binary engine type at the absolute earliest point
// This must run before ANY Prisma-related code is evaluated
// This is especially critical for AWS Amplify builds
if (typeof process !== 'undefined') {
  // Set it unconditionally - don't check if it exists first
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
  
  // CRITICAL for Amplify: Detect AWS environment and set flag
  if (!process.env.AWS_AMPLIFY && (process.env.AWS_EXECUTION_ENV || process.env.AWS_REGION)) {
    process.env.AWS_AMPLIFY = 'true'
  }
  
  // CRITICAL: Always ensure DATABASE_URL is set (not just during build)
  // Prisma detects "client" engine type if DATABASE_URL is missing
  // This must be set BEFORE PrismaClient is imported
  if (!process.env.DATABASE_URL) {
    const fallbackUrl = process.env.PRISMA_DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL ||
      'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
    process.env.DATABASE_URL = fallbackUrl
  }
  
  // Re-assert binary engine type after setting DATABASE_URL
  // This ensures it's set even if something tried to override it
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}

// Export nothing - this is just a side-effect module
export {}
