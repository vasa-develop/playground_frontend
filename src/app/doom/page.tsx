'use client';

import React, { useEffect, useState } from 'react';
import { useDoomEyeControls } from '@/hooks/useDoomEyeControls';
import { EyeTrackingCalibration } from '@/components/EyeTrackingCalibration';

export default function DoomPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);

  const {
    isCalibrated,
    isTracking,
    error: eyeTrackingError,
    startCalibration,
    startTracking,
    stopTracking,
  } = useDoomEyeControls({
    enabled: eyeTrackingEnabled,
    sensitivity: 1.5,
    blinkToShoot: true,
    deadzone: 0.1,
  });

  useEffect(() => {
    // Initialize the Module configuration before loading the script
    const commonArgs = ["-iwad", "doom1.wad", "-window", "-nogui", "-nomusic", "-config", "default.cfg", "-servername", "doomflare"];
    
    // @ts-ignore
    window.Module = {
      onRuntimeInitialized: () => {
        // @ts-ignore
        window.callMain(commonArgs);
        setIsLoading(false);
      },
      noInitialRun: true,
      preRun: () => {
        // @ts-ignore
        const Module = window.Module;
        Module.FS.createPreloadedFile("", "doom1.wad", "/doom/doom1.wad", true, true);
        Module.FS.createPreloadedFile("", "default.cfg", "/doom/default.cfg", true, true);
      },
      printErr: function(text: string) {
        if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(" ");
        console.error(text);
      },
      canvas: (function() {
        const canvas = document.getElementById("doomCanvas");
        canvas?.addEventListener(
          "webglcontextlost",
          function(e) {
            alert("WebGL context lost. You will need to reload the page.");
            e.preventDefault();
          },
          false
        );
        return canvas;
      })(),
      print: function(text: string) {
        console.log(text);
      },
      setStatus: function(text: string) {
        console.log(text);
      },
      totalDependencies: 0,
      monitorRunDependencies: function(left: number) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        // @ts-ignore
        Module.setStatus(left ? "Preparing... (" + (this.totalDependencies - left) + "/" + this.totalDependencies + ")" : "All downloads complete.");
      },
    };

    let scriptElement: HTMLScriptElement | null = null;

    // Load WASM binary first
    fetch('/doom/websockets-doom.wasm')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        // @ts-ignore
        window.Module.wasmBinary = buffer;
        
        // Then load the JavaScript
        scriptElement = document.createElement('script');
        scriptElement.src = '/doom/websockets-doom.js';
        scriptElement.async = true;

        const handleScriptError = () => {
          setError('Failed to load DOOM. Please try refreshing the page.');
          setIsLoading(false);
        };

        scriptElement.addEventListener('error', handleScriptError);
        document.body.appendChild(scriptElement);
      })
      .catch(() => {
        setError('Failed to load DOOM WASM binary. Please try refreshing the page.');
        setIsLoading(false);
      });

    // Cleanup function
    return () => {
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
      // Clean up any DOOM-specific global objects or canvases if they exist
      const canvas = document.getElementById('doomCanvas');
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

      <canvas 
        id="doomCanvas" 
        className="bg-black"
        width={320}
        height={200}
        style={{
          width: '800px',
          height: '600px',
          imageRendering: 'pixelated'
        }}
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={-1}
      />

      <div className="mt-4 text-sm text-gray-400">
        {eyeTrackingEnabled ? (
          <>Use your eyes to aim and blink to shoot</>
        ) : (
          <>Use arrow keys to move, Ctrl to shoot, and Space to open doors</>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            eyeTrackingEnabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => {
            if (!isCalibrated && !eyeTrackingEnabled) {
              setShowCalibration(true);
            } else {
              setEyeTrackingEnabled(!eyeTrackingEnabled);
              if (!eyeTrackingEnabled) {
                startTracking();
              } else {
                stopTracking();
              }
            }
          }}
        >
          {eyeTrackingEnabled ? 'Disable' : 'Enable'} Eye Controls
        </button>
        
        {isCalibrated && (
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            onClick={() => setShowCalibration(true)}
          >
            Recalibrate
          </button>
        )}
      </div>

      {showCalibration && (
        <EyeTrackingCalibration
          onCalibrationComplete={() => {
            setShowCalibration(false);
            setEyeTrackingEnabled(true);
            startTracking();
          }}
          onCalibrationCancel={() => {
            setShowCalibration(false);
          }}
        />
      )}
    </div>
  );
}
