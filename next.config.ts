import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    // Allow images with spaces in filenames
    remotePatterns: [],
  },
};

export default nextConfig;
