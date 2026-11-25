import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    // The driver form accepts two vehicle photos in one action.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
