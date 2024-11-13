const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), "@tensorflow/tfjs-node"];
    return config;
  }
};

module.exports = nextConfig;
