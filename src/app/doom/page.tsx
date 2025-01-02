'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { createModuleConfig } from './moduleConfig';
import './styles.css';
import Script from 'next/script';
import { preloadDoomFiles } from './preloadFiles';

declare global {
  interface Window {
    Module: EmscriptenModule;
  }
}

import { useDoomEyeControls } from '@/hooks/useDoomEyeControls';
import { EyeTrackingCalibration } from '@/components/EyeTrackingCalibration';
import { WebGazerLoader } from '@/components/WebGazerLoader';

export default function DoomPage() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
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
    if (typeof window === 'undefined') return;

    // Initialize Module configuration
    window.Module = createModuleConfig();
    window.Module?.setStatus?.('Downloading...');

    // Wait for next tick to ensure DOM is ready
    setTimeout(() => {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      if (!canvas) {
        setError('Canvas element not found');
        return;
      }

    // Initialize audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Resume audio context on first user interaction
    const resumeAudio = () => {
      audioCtx.resume();
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);

    // Add error handler
    window.onerror = function(event: Event | string) {
      console.error('DOOM Error:', event);
      setError('Exception thrown, see JavaScript console');
    };

    // Cleanup function
    return () => {
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
      if (audioCtx) {
        audioCtx.close().catch(console.error);
      }
    };
    }, 0);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="doom-container">
      {/* Canvas for DOOM */}
      <div className="emscripten_border">
        <canvas 
          id="canvas"
          className="emscripten"
          tabIndex={1}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      {isLoading && <div className="loading">Loading DOOM...</div>}
      {error && <div className="error">{error}</div>}


      {/* Module configuration is now imported from moduleConfig.ts */}

      {/* Load DOOM script */}
      <Script
        id="doom-main"
        src="/doom/websockets-doom.js"
        strategy="beforeInteractive"
        onReady={() => {
          const initDoom = async () => {
            console.log('Main script loaded');
            
            try {
              // Load WAD and config files first
              console.log('Loading WAD and config files...');
              const [wadResponse, configResponse] = await Promise.all([
                fetch('/doom/doom1.wad'),
                fetch('/doom/default.cfg')
              ]);
              
              // Convert responses to appropriate formats
              const wadBuffer = await wadResponse.arrayBuffer();
              const configText = await configResponse.text();
              console.log('Files loaded successfully, size:', wadBuffer.byteLength);

              // Wait for Module to be defined and initialized
              let attempts = 0;
              const maxAttempts = 10;
              while (!window.Module?.FS && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
                console.log('Waiting for Module.FS, attempt:', attempts);
              }
              
              if (!window.Module?.FS) {
                throw new Error('Failed to initialize Module.FS after ' + maxAttempts + ' attempts');
              }

              // Create required directories
              try {
                window.Module.FS.mkdir('/doom');
              } catch (error: any) {
                if (!(error?.errno === 20)) { // EEXIST
                  throw error;
                }
              }
              
              // Write WAD and config files
              const wadArray = new Uint8Array(wadBuffer);
              window.Module.FS.writeFile('/doom/doom1.wad', wadArray);
              window.Module.FS.writeFile('/doom/default.cfg', configText);
              
              console.log('Filesystem setup complete');
              console.log('Directory contents:', window.Module.FS.readdir('/doom'));

              console.log('Starting DOOM...');
              // Let Module handle its own initialization
              console.log('DOOM initialization complete');
              setScriptsLoaded(true);
              setIsLoading(false);
            } catch (error: any) {
              console.error('Error initializing DOOM:', error);
              setError('Failed to initialize DOOM: ' + (error?.message || 'Unknown error'));
            }
          };

          initDoom().catch(error => {
            console.error('Error in initDoom:', error);
            setError('Failed to initialize DOOM: ' + (error?.message || 'Unknown error'));
          });
        }}
      />


      
      <div className="controls">
        <button
          onClick={() => setEyeTrackingEnabled(!eyeTrackingEnabled)}
          className={eyeTrackingEnabled ? 'active' : ''}
        >
          {eyeTrackingEnabled ? 'Disable' : 'Enable'} Eye Tracking
        </button>
        
        {eyeTrackingEnabled && !isCalibrated && (
          <button onClick={startCalibration}>
            Calibrate Eye Tracking
          </button>
        )}
        
        {eyeTrackingEnabled && isCalibrated && !isTracking && (
          <button onClick={startTracking}>
            Start Eye Tracking
          </button>
        )}
        
        {isTracking && (
          <button onClick={stopTracking}>
            Stop Eye Tracking
          </button>
        )}
      </div>

      {showCalibration && (
        <EyeTrackingCalibration
          onCalibrationComplete={() => setShowCalibration(false)}
          onCalibrationCancel={() => setShowCalibration(false)}
        />
      )}

      {eyeTrackingEnabled && (
        <WebGazerLoader
          onLoad={(webgazer) => {
            console.log('WebGazer loaded:', webgazer);
            // TODO: Initialize webgazer with proper configuration
          }}
        />
      )}
    </div>
  );
}
