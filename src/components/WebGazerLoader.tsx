'use client';

import { useEffect, useState } from 'react';

let webgazerInstance: any = null;

interface WebGazerLoaderProps {
  onLoad: (webgazer: any) => void;
}

export const WebGazerLoader: React.FC<WebGazerLoaderProps> = ({ onLoad }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWebGazer = async () => {
      try {
        if (!webgazerInstance) {
          const webgazerModule = await import('webgazer');
          webgazerInstance = webgazerModule.default;
        }
        onLoad(webgazerInstance);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load webgazer');
      }
    };

    loadWebGazer();
  }, [onLoad]);

  if (error) {
    return <div>Error loading eye tracking: {error}</div>;
  }

  return null;
};
