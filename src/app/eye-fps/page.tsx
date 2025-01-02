'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function EyeFPSGame() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [showCalibration, setShowCalibration] = useState(true);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [calibrationPoints] = useState([
    { x: '10%', y: '10%' }, { x: '50%', y: '10%' }, { x: '90%', y: '10%' },
    { x: '10%', y: '50%' }, { x: '50%', y: '50%' }, { x: '90%', y: '50%' },
    { x: '10%', y: '90%' }, { x: '50%', y: '90%' }, { x: '90%', y: '90%' }
  ]);

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
    <div className="w-full h-screen relative">
      <Script src="https://webgazer.cs.brown.edu/webgazer.js" strategy="beforeInteractive" />
      <div ref={gameContainerRef} id="gameContainer" className="w-full h-full" />
      
      {/* Calibration overlay */}
      {showCalibration && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl font-bold mb-4">Eye Tracking Calibration</h2>
            <p className="text-white text-lg">
              Look at each point and click it with your mouse.
              <br />
              Keep your head still and follow the points with your eyes.
            </p>
            <p className="text-white text-lg mt-2">
              Progress: {calibrationStep} / 9 points
            </p>
          </div>

          {/* Calibration points grid */}
          <div className="absolute w-full h-full">
            {calibrationPoints.map((point, index) => (
              <button
                key={index}
                className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
                  index === calibrationStep
                    ? 'bg-green-500 animate-pulse'
                    : index < calibrationStep
                    ? 'bg-gray-500'
                    : 'bg-white'
                }`}
                style={{ left: point.x, top: point.y }}
                onClick={() => setCalibrationStep(prev => Math.min(prev + 1, 9))}
              />
            ))}
          </div>

          {/* Start/Reset buttons */}
          <div className="absolute bottom-8 flex gap-4">
            {calibrationStep === 0 && (
              <button
                onClick={() => setCalibrationStep(1)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Calibration
              </button>
            )}
            {calibrationStep === 9 && (
              <button
                onClick={() => setShowCalibration(false)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Game
              </button>
            )}
            <button
              onClick={() => setCalibrationStep(0)}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset Calibration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
