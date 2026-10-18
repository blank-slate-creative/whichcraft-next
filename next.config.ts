import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  turbopack: {},
  async redirects() {
    // The App Store listing names the short paths (blank-slate issue 1477). They returned 404.
    return [
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-of-service', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // The file has no extension, so Apple's check needs the JSON type said outright.
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
      {
        // Shared brew lists live in the link itself and must never be indexed or leak a referrer.
        source: '/l',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ];
  },
};

export default nextConfig;
