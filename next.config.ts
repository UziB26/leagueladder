import type { NextConfig } from "next";

// CRITICAL: Set Prisma engine type BEFORE any module evaluation
// This must be set at the very top level to ensure it's available during Next.js build
if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'
}
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary'

// Ensure DATABASE_URL is set during build time (even if dummy)
// This prevents Prisma from detecting "client" engine type
if ((process.env.VERCEL === '1' || process.env.AWS_AMPLIFY === 'true' || process.env.CI === 'true') && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 
    process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_PRISMA_URL || 
    process.env.POSTGRES_URL ||
    'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
}

const nextConfig: NextConfig = {
  // Disable Vercel features
  devIndicators: {
    position: 'bottom-right',
  },
  // Fix TLS certificate issue
  // CRITICAL: Disable Turbopack on AWS Amplify (causes Prisma build issues)
  // Keep Turbopack enabled for Vercel and local development
  experimental: {
    ...(process.env.AWS_AMPLIFY !== 'true' && process.env.AWS_EXECUTION_ENV === undefined
      ? { turbopackUseSystemTlsCerts: true }
      : {}),
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // CRITICAL: Expose environment variables to Next.js build process
  // This ensures PRISMA_CLIENT_ENGINE_TYPE is available during module evaluation
  env: {
    PRISMA_CLIENT_ENGINE_TYPE: process.env.PRISMA_CLIENT_ENGINE_TYPE || 'binary',
    // Also ensure DATABASE_URL is available during build
    ...(process.env.DATABASE_URL ? { DATABASE_URL: process.env.DATABASE_URL } : {}),
  },
  // Image configuration
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, no-cache',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, no-cache',
          },
        ],
      },
    ];
  },
  // Ensure service worker and manifest are accessible
  async rewrites() {
    return [];
  },
};

export default nextConfig;
