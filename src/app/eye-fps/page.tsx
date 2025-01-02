'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

export default function EyeFPSGame() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [showCalibration, setShowCalibration] = useState(true);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationPoints] = useState([
    { x: '10%', y: '10%' }, { x: '50%', y: '10%' }, { x: '90%', y: '10%' },
    { x: '10%', y: '50%' }, { x: '50%', y: '50%' }, { x: '90%', y: '50%' },
    { x: '10%', y: '90%' }, { x: '50%', y: '90%' }, { x: '90%', y: '90%' }
  ]);

  // Convert percentage to actual pixels for WebGazer
  const getPixelCoordinates = (point: { x: string; y: string }) => {
    const x = (parseInt(point.x) / 100) * window.innerWidth;
    const y = (parseInt(point.y) / 100) * window.innerHeight;
    return { x, y };
  };

  const handleCalibrationPoint = (index: number) => {
    if (typeof window !== 'undefined' && window.webgazer && index < calibrationPoints.length) {
      // Show face overlay during calibration
      window.webgazer.showVideo(true);
      window.webgazer.showFaceOverlay(true);
      window.webgazer.showFaceFeedback(true);

      // Get pixel coordinates and record the point
      const point = getPixelCoordinates(calibrationPoints[index]);
      window.webgazer.recordScreenPosition(point.x, point.y);

      // Update calibration step
      const nextStep = index + 1;
      setCalibrationStep(nextStep);

      // If calibration is complete, hide overlays and finish
      if (nextStep >= calibrationPoints.length) {
        window.webgazer.showFaceOverlay(false);
        window.webgazer.showFaceFeedback(false);
        window.webgazer.showVideo(false);
        setShowCalibration(false);
        setIsCalibrated(true);
        
        // Enable game controls after calibration
        if (window.scene && window.controls) {
          window.scene.enableControls = true;
          window.controls.enabled = true;
        }
      }
    }
  };

  useEffect(() => {
    // Initialize WebGazer
    const initWebGazer = async () => {
      if (typeof window === 'undefined' || !window.webgazer) {
        console.error('WebGazer not available');
        return;
      }

      try {
        console.log('Starting WebGazer initialization...');
          
        // Initialize WebGazer with basic configuration
        await window.webgazer.setRegression('ridge');
        console.log('Regression model set to ridge');
          
        // Configure WebGazer UI elements and listeners
        window.webgazer
          .showVideo(true)
          .showFaceOverlay(true)
          .showFaceFeedback(true)
          .setGazeListener((data: any) => {
            if (data == null) {
              console.log('Received null gaze data');
              return;
            }
            console.log('Received gaze data:', { x: data.x, y: data.y });
              
            // Update crosshair position based on gaze only after calibration
            if (window.updateCrosshair && isCalibrated) {
              window.updateCrosshair(data.x, data.y);
            }
          })
          .setBlinkListener((blinking: boolean) => {
            if (blinking) {
              console.log('Blink detected');
              if (window.handleShoot && isCalibrated) {
                console.log('Shooting triggered by blink');
                window.handleShoot();
              }
            }
          });

        console.log('WebGazer UI elements and listeners configured');
          
        // Begin WebGazer tracking
        await window.webgazer.begin();
        console.log('WebGazer tracking started successfully');
          
        // Show calibration UI
        setShowCalibration(true);
        console.log('Calibration UI displayed');
      } catch (error) {
        console.error('Error initializing WebGazer:', error);
        window.alert('Error initializing eye tracking. Please ensure your browser supports WebGL and camera access is granted.');
        setShowCalibration(true);
      }
    };

    interface GameScript {
      src: string;
      async: boolean;
    }

    // Load game scripts after component mounts
    const loadGame = () => {
      // Define scripts in order of dependency
      const scripts: GameScript[] = [
        { src: '/fps/libs/three.js', async: false },
        { src: '/fps/libs/MTLLoader.js', async: false },
        { src: '/fps/libs/OBJLoader.js', async: false },
        { src: '/fps/libs/PointerLockControls.js', async: false },
        { src: '/fps/libs/dat.gui.js', async: false },
        { src: '/fps/libs/stats.js', async: false },
        { src: '/fps/libs/ammo.js', async: false },
        { src: '/fps/libs/physi.js', async: false },
        { src: '/fps/libs/physijs_worker.js', async: false },
        { src: '/fps/libs/howler.js', async: false },
        { src: '/fps/libs/jquery-1.9.0.js', async: false },
        { src: '/fps/Bullets.js', async: false },
        { src: '/fps/Crosshair.js', async: false },
        { src: '/fps/Enemies.js', async: false },
        { src: '/fps/Map.js', async: false },
        { src: '/fps/Skybox.js', async: false },
        { src: '/fps/TheScene.js', async: false },
        { src: '/fps/avatar.js', async: false },
        { src: '/fps/script.js', async: false }
      ];

      // Load scripts sequentially
      const loadScriptSequentially = (index: number): void => {
        if (index >= scripts.length) {
          console.log('All scripts loaded');
          return;
        }

        const script = document.createElement('script');
        script.src = scripts[index].src;
        script.async = scripts[index].async;
        
        script.onload = () => {
          loadScriptSequentially(index + 1);
        };
        
        script.onerror = (error) => {
          console.error(`Error loading script ${scripts[index].src}:`, error);
          loadScriptSequentially(index + 1); // Continue loading next script even if one fails
        };

        document.body.appendChild(script);
      };

      // Start loading scripts
      loadScriptSequentially(0);
    };

    loadGame();
    initWebGazer();

    return () => {
      // Cleanup WebGazer when component unmounts
      if (typeof window !== 'undefined' && window.webgazer && typeof window.webgazer.end === 'function') {
        try {
          window.webgazer.end();
        } catch (error) {
          console.error('Error cleaning up WebGazer:', error);
        }
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
                onClick={() => handleCalibrationPoint(index)}
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
