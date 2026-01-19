/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable Vercel features
    devIndicators: {
      buildActivity: false,
    },
    // Fix TLS certificate issue
    experimental: {
      turbopackUseSystemTlsCerts: true,
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
    },
    // PWA Configuration
    async headers() {
      return [
        {
          source: '/sw.js',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=0, must-revalidate',
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
              value: 'public, max-age=0, must-revalidate',
            },
          ],
        },
      ]
    },
    // Ensure service worker and manifest are accessible
    async rewrites() {
      return []
    },
  }
  
  module.exports = nextConfig