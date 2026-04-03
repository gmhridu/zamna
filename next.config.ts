import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zamana-shop.com",
        pathname: "/wp-content/**",
      },
    ],
  },
  allowedDevOrigins: [
    "preview-chat-bf07adf4-4d5a-43c3-9c64-704b88276595.space.z.ai",
  ],
};

export default nextConfig;
