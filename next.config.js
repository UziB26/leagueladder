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
  }
  
  module.exports = nextConfig