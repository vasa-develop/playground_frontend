const BACKEND_URL = typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.env?.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const WS_URL = typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.env?.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export const config = {
  backendUrl: BACKEND_URL,
  wsUrl: WS_URL,
} as const;

// Log configuration at runtime
if (typeof window !== 'undefined') {
  console.log('Runtime Configuration:', {
    backendUrl: config.backendUrl,
    wsUrl: config.wsUrl,
    window_next_data: typeof window !== 'undefined' ? window.__NEXT_DATA__ : null
  });
}

// Ensure we're using the correct URLs
if (config.backendUrl === 'http://localhost:8000' || config.wsUrl === 'ws://localhost:8000') {
  console.warn('Using localhost URLs - environment variables may not be set correctly');
}
