/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure for app directory
  experimental: {
    appDir: true,
  }
}

module.exports = nextConfig
