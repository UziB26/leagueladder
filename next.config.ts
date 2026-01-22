import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Vercel features
  devIndicators: {
    position: 'bottom-right',
  },
  // Fix TLS certificate issue
  experimental: {
    turbopackUseSystemTlsCerts: true,
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
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
