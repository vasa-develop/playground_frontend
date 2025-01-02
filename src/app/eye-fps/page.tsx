'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function EyeFPSGame() {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize WebGazer
    const initWebGazer = async () => {
      if (typeof window !== 'undefined' && window.webgazer) {
        try {
          await window.webgazer.setRegression('ridge')
            .setGazeListener((data: any) => {
              if (data == null) return;
              
              // Update crosshair position based on gaze
              if (window.updateCrosshair) {
                window.updateCrosshair(data.x, data.y);
              }
            })
            .begin();
            
          // Set up blink detection
          window.webgazer.setBlinkListener((blinking: boolean) => {
            if (blinking && window.handleShoot) {
              window.handleShoot();
            }
          });
          
          console.log('WebGazer initialized successfully');
        } catch (error) {
          console.error('Error initializing WebGazer:', error);
        }
      }
    };

    // Load game scripts after component mounts
    const loadGame = () => {
      const scripts = [
        '/eye-fps/libs/three.js',
        '/eye-fps/libs/MTLLoader.js',
        '/eye-fps/libs/OBJLoader.js',
        '/eye-fps/libs/PointerLockControls.js',
        '/eye-fps/libs/dat.gui.js',
        '/eye-fps/libs/stats.js',
        '/eye-fps/libs/physi.js',
        '/eye-fps/libs/physijs_worker.js',
        '/eye-fps/libs/ammo.js',
        '/eye-fps/libs/howler.js',
        '/eye-fps/libs/jquery-1.9.0.js',
        '/eye-fps/fps/Bullets.js',
        '/eye-fps/fps/Crosshair.js',
        '/eye-fps/fps/Enemies.js',
        '/eye-fps/fps/Map.js',
        '/eye-fps/fps/Skybox.js',
        '/eye-fps/fps/TheScene.js',
        '/eye-fps/fps/avatar.js',
        '/eye-fps/fps/script.js'
      ];

      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    };

    loadGame();
    initWebGazer();

    return () => {
      // Cleanup WebGazer when component unmounts
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <Script src="https://webgazer.cs.brown.edu/webgazer.js" strategy="beforeInteractive" />
      <div ref={gameContainerRef} id="gameContainer" className="w-full h-full" />
    </div>
  );
}
