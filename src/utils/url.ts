export const getBaseUrl = () => {
  const isVercelDeployment = process.env.VERCEL === '1';

  if (isVercelDeployment) {
/*     if (process.env.VERCEL_URL) {
      // Vercel preview deployments 
      return `https://${process.env.VERCEL_URL}`;
    } */
    // When VERCEL=1 but VERCEL_URL is not set, it means we're in Vercel production
    return 'https://playground.vasa.bio';
  }

  // Local development
  return 'http://localhost:3001';
}; 