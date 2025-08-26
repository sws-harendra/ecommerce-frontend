import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Skip type checking at build time
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Skip ESLint checks at build time
    ignoreDuringBuilds: true,
  },

  /* config options here */ images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
