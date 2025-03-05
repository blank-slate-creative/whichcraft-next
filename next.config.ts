import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development" ?
            "http://localhost:5001/api/:path*"
          : "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
