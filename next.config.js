/** @type {import('next').NextConfig} */

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_BACKEND_URL', 'NEXT_PUBLIC_WS_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Using default localhost URL.`);
  }
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Remove deprecated appDir option as it's enabled by default now
  images: {
    unoptimized: true
  },
  // Make environment variables available at build time
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
  }
}

module.exports = nextConfig
