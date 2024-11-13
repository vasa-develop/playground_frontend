/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure for app directory
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore node-pre-gyp HTML files
    config.module.rules.push({
      test: /\.html$/,
      issuer: /node-pre-gyp/,
      use: 'ignore-loader'
    });

    if (isServer) {
      // Handle Node.js modules
      config.externals = [...config.externals, '@tensorflow/tfjs-node'];
    }

    return config;
  }
}

module.exports = nextConfig
