/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Exclude canvas from client-side bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
  // Transpile Konva modules
  transpilePackages: ['react-konva', 'konva']
}

module.exports = nextConfig
