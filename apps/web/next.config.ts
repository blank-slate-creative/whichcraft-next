import type { NextConfig } from 'next';
import path from 'path';
const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    turbo: {
      resolveAlias: {
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
    },
  },
  webpack: config => {
    config.resolve.alias.react = path.resolve(__dirname, 'node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom');
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
