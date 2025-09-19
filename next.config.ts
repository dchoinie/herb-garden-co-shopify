import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "square-cdn.com",
      },
      {
        protocol: "https",
        hostname: "www.herbgardenco.com",
      },
    ],
  },
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
