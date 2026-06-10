import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wtsdwtlzntugqqcskvow.supabase.co",
        pathname: "/storage/v1/object/public/dish-images/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Image uploads go through a server action; default limit is 1 MB
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
