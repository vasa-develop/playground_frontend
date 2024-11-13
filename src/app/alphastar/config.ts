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

// Wait for configuration to be loaded
const waitForConfig = async (): Promise<AlphaStarConfig> => {
  const maxAttempts = 50;
  const interval = 100; // ms

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (typeof window !== 'undefined' && window.ALPHASTAR_CONFIG) {
      console.log('Configuration loaded:', window.ALPHASTAR_CONFIG);
      return window.ALPHASTAR_CONFIG;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  console.warn('Failed to load configuration from window, using fallback URLs');
  return {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://timely-pavlova-eab52f.netlify.app/api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://timely-pavlova-eab52f.netlify.app/ws'
  };
};

// Export async config loader
export const getConfig = async (): Promise<AlphaStarConfig> => {
  return await waitForConfig();
};

// Log configuration at runtime
if (typeof window !== 'undefined') {
  waitForConfig().then(config => {
    if (config.backendUrl.includes('localhost') || config.wsUrl.includes('localhost')) {
      console.warn('Using localhost URLs - this should not happen in production');
    }
  });
}
