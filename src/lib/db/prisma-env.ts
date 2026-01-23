/**
 * Prisma Environment Setup - MUST be imported before @prisma/client
 * This file ensures environment variables are set before Prisma reads them
 */

// CRITICAL: This must run before ANY Prisma imports
// Prisma reads environment variables at import time, not instantiation time

// Detect AWS Amplify environment
if (!process.env.AWS_AMPLIFY && (process.env.AWS_EXECUTION_ENV || process.env.AWS_REGION)) {
  process.env.AWS_AMPLIFY = 'true'
}

// Force binary engine type - set it multiple times to ensure it sticks
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// Ensure DATABASE_URL is set during build time
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

// Export nothing - this is just a side-effect module
export {}
