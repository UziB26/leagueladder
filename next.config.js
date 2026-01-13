/** @type {import('next').NextConfig} */
const nextConfig = {
    
    devIndicators: {
      buildActivity: false,
      buildActivityPosition: 'bottom-right',
    },
    
    experimental: {
      serverActions: {
        allowedOrigins: ['localhost:3000'],
      },
    },
  }
  
  module.exports = nextConfig