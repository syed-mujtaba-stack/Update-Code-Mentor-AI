import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // This disables ESLint checks during Vercel (or any) production builds
    ignoreDuringBuilds: true,
  },
  // ...your other config (if any)
}

export default nextConfig
