/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  // Ensure client-side components work properly
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
