import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/kasplex/:path*',
        destination: 'https://api.kasplex.org/v1/:path*'
      }
    ]
  }
};

export default nextConfig;
