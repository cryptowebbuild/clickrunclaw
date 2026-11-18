import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @cloudflare/next-on-pages cannot run the Next image optimiser, so images are
  // served as the pre-sized files in /public instead of a 404 on /_next/image.
  images: {
    unoptimized: true,
    formats: ['image/webp'],
  },
  eslint: {
    // Lint runs as its own CI step; a lint warning must not block a deploy.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  ...(process.env.NEXT_STANDALONE === 'true' ? { output: 'standalone' as const } : {}),
};

export default nextConfig;
