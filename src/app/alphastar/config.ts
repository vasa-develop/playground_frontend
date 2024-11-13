// Environment variables with type safety
export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000',
} as const;

// Validate environment variables at runtime
if (typeof window !== 'undefined') {
  console.log('Runtime environment variables:', {
    backendUrl: config.backendUrl,
    wsUrl: config.wsUrl,
  });
}
