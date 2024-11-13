// Environment variables with type safety
export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000',
} as const;

// Validate environment variables at runtime
console.log('Environment Variables:', {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  config: {
    backendUrl: config.backendUrl,
    wsUrl: config.wsUrl,
  }
});

// Ensure we're using the correct URLs
if (config.backendUrl === 'http://localhost:8000' || config.wsUrl === 'ws://localhost:8000') {
  console.warn('Using localhost URLs - environment variables may not be set correctly');
}
