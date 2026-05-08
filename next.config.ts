import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Memory optimization for 32-bit environments
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching to save memory
    config.cache = false;
    
    // Reduce parallelism to lower memory usage during builds
    if (!isServer) {
      config.parallelism = 1;
    }
    
    return config;
  },
  
  // Disable native SWC minification if it causes issues on 32-bit
  swcMinify: false,
  
  // Disable features that use native binaries
  experimental: {
    // Ensuring no Turbopack if not explicitly requested
    turbo: {
      rules: {}
    }
  }
};

export default nextConfig;
