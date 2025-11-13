import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/engines');
    }
    return config;
  },
  turbopack: {},
}

export default nextConfig
