import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/play',
        permanent: true, // Set to true for a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;