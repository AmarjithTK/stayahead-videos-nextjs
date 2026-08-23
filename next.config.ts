import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages hosting.
  output: "export",
  images: {
    // No image optimization needed for static export; thumbnails are plain <img> tags.
    unoptimized: true,
  },
};

export default nextConfig;
