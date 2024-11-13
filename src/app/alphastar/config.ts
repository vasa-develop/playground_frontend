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
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://alphastar-alb-2018657447.us-east-1.elb.amazonaws.com',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://alphastar-alb-2018657447.us-east-1.elb.amazonaws.com'
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
