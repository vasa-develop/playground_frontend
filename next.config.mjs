/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/electron_density',
        destination: '/electron_density/index.html',
        permanent: true,
      },
      {
        source: '/ferminet/energy',
        destination: '/ferminet/energy/index.html',
        permanent: true,
      },
      {
        source: '/ferminet/mcmc_sampling',
        destination: '/ferminet/mcmc_sampling/index.html',
        permanent: true,
      },
      {
        source: '/ferminet/observable_quantities',
        destination: '/ferminet/observable_quantities/index.html',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
