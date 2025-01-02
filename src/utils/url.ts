export const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    // Vercel preview deployments
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    // Vercel production deployment
    return 'https://playground.vasa.bio';
  }
  // Development
  return 'http://localhost:3001';
}; 