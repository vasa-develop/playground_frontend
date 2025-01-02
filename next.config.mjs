/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static HTML export
  output: 'export',
  
  // Keep it simple for now - just enable static export
  // Remove rewrites since they don't work with static export
  // We can add more config as needed when we run into specific issues
};

export default nextConfig;
