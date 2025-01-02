import { useEffect, useState, useCallback, useRef } from 'react';
import webgazer from 'webgazer';

interface GazeData {
  x: number;
  y: number;
  timestamp: number;
}

interface EyeTrackingConfig {
  onGazeUpdate?: (data: GazeData) => void;
  calibrationPoints?: number;
  enableBlink?: boolean;
  onBlink?: () => void;
  minBlinkDuration?: number;
}

interface EyeTrackingState {
  isCalibrated: boolean;
  isTracking: boolean;
  currentGaze: GazeData | null;
  error: string | null;
}

export const useEyeTracking = (config: EyeTrackingConfig = {}) => {
  const [state, setState] = useState<EyeTrackingState>({
    isCalibrated: false,
    isTracking: false,
    currentGaze: null,
    error: null,
  });

  const gazeInterval = useRef<number>();
  const blinkTimeout = useRef<NodeJS.Timeout>();
  const lastBlinkTime = useRef<number>(0);
  
  const startTracking = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, isTracking: true }));
      
      await webgazer
        .setRegression('ridge')
        .setTracker('TF')
        .begin();

      // Hide video by default
      webgazer.showVideo(false);
      webgazer.showFaceOverlay(false);
      webgazer.showFaceFeedbackBox(false);
      
      // Start continuous gaze tracking
      gazeInterval.current = window.setInterval(() => {
        webgazer.getCurrentPrediction()
          .then((prediction: { x: number; y: number } | null) => {
            if (prediction) {
              const gazeData: GazeData = {
                x: prediction.x,
                y: prediction.y,
                timestamp: Date.now()
              };
              setState(prev => ({ ...prev, currentGaze: gazeData }));
              config.onGazeUpdate?.(gazeData);
            }
          });
      }, 50); // 20fps update rate

      // Blink detection if enabled
      if (config.enableBlink) {
        webgazer.setGazeListener((data: { x: number; y: number } | null) => {
          if (!data && config.onBlink) {
            const now = Date.now();
            // Prevent multiple blink triggers
            if (now - lastBlinkTime.current > (config.minBlinkDuration || 300)) {
              lastBlinkTime.current = now;
              config.onBlink();
            }
          }
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to start eye tracking',
        isTracking: false 
      }));
    }
  }, [config]);

  const stopTracking = useCallback(() => {
    if (gazeInterval.current) {
      clearInterval(gazeInterval.current);
      gazeInterval.current = undefined;
    }
    if (blinkTimeout.current) {
      clearTimeout(blinkTimeout.current);
      blinkTimeout.current = undefined;
    }
    webgazer.end();
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  const startCalibration = useCallback(async () => {
    try {
      await webgazer
        .setRegression('ridge')
        .setTracker('TF')
        .begin();

      // Show video feed during calibration
      webgazer.showVideo(true);
      webgazer.showFaceOverlay(true);
      webgazer.showFaceFeedbackBox(true);

      // Wait for face to be detected
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Face detection timeout')), 10000);
        const checkFace = setInterval(() => {
          if (webgazer.isReady()) {
            clearInterval(checkFace);
            clearTimeout(timeout);
            resolve();
          }
        }, 100);
      });

      setState(prev => ({ ...prev, isCalibrated: true }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Calibration failed' 
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    ...state,
    startTracking,
    stopTracking,
    startCalibration,
  };
};
