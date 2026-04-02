import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages via @cloudflare/next-on-pages
  images: {
    // R2 public bucket domain — replace with your actual R2 public URL
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
    unoptimized: true, // Required for Cloudflare Pages (no image optimization server)
  },
}

export default nextConfig
