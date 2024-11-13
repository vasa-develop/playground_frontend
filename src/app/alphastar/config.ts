// Define runtime configuration type
interface AlphaStarConfig {
  backendUrl: string;
  wsUrl: string;
}

// Declare global window type
declare global {
  interface Window {
    ALPHASTAR_CONFIG?: AlphaStarConfig;
  }
}

// Load configuration from public runtime config
const getRuntimeConfig = (): AlphaStarConfig => {
  if (typeof window !== 'undefined' && window.ALPHASTAR_CONFIG) {
    return window.ALPHASTAR_CONFIG;
  }
  return {
    backendUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8000'
  };
};

export const config = getRuntimeConfig();

// Log configuration at runtime
if (typeof window !== 'undefined') {
  console.log('Runtime Configuration:', config);
}

// Ensure we're using the correct URLs
if (config.backendUrl.includes('localhost') || config.wsUrl.includes('localhost')) {
  console.warn('Using localhost URLs - this should not happen in production');
}
