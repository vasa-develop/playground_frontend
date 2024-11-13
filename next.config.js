/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  // Remove deprecated appDir option as it's enabled by default now
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
