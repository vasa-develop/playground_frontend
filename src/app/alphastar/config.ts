// Hardcoded backend URLs for demo purposes
const BACKEND_URL = 'https://3.83.244.93';
const WS_URL = 'wss://3.83.244.93';

export const config = {
  backendUrl: BACKEND_URL,
  wsUrl: WS_URL,
} as const;

// Log configuration at runtime
if (typeof window !== 'undefined') {
  console.log('Runtime Configuration:', {
    backendUrl: config.backendUrl,
    wsUrl: config.wsUrl
  });
}

// Ensure we're using the correct URLs
if (config.backendUrl.includes('localhost') || config.wsUrl.includes('localhost')) {
  console.warn('Using localhost URLs - this should not happen in production');
}
