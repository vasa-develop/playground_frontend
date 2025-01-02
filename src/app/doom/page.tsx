'use client';

import React, { useEffect, useState } from 'react';

export default function DoomPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create and load the DOOM script
    const script = document.createElement('script');
    script.src = '/doom/doom.js';
    script.async = true;

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setError('Failed to load DOOM. Please try refreshing the page.');
      setIsLoading(false);
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      document.body.removeChild(script);
      // Clean up any DOOM-specific global objects or canvases if they exist
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">DOOM</h1>
      
      {isLoading && (
        <div className="text-xl">
          Loading DOOM...
        </div>
      )}
      
      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      {/* The game will automatically create and inject its canvas here */}
      <div id="doom-container" className="relative w-full max-w-4xl aspect-video bg-black">
        {/* The canvas will be mounted here by the DOOM WebAssembly code */}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Use arrow keys to move, Ctrl to shoot, and Space to open doors
      </div>
    </div>
  );
}
