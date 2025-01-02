import { useCallback, useEffect, useRef } from 'react';
import { useEyeTracking } from './useEyeTracking';

interface DoomEyeControlsConfig {
  enabled: boolean;
  sensitivity?: number;
  blinkToShoot?: boolean;
  deadzone?: number;
}

export const useDoomEyeControls = (config: DoomEyeControlsConfig) => {
  const { enabled, sensitivity = 1, blinkToShoot = true, deadzone = 0.1 } = config;
  const lastGazeRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleGazeUpdate = useCallback((data: { x: number; y: number }) => {
    if (!enabled || !lastGazeRef.current) return;

    // Calculate relative movement from last position
    const deltaX = (data.x - lastGazeRef.current.x) * sensitivity;
    const deltaY = (data.y - lastGazeRef.current.y) * sensitivity;

    // Only move if beyond deadzone
    if (Math.abs(deltaX) > deadzone || Math.abs(deltaY) > deadzone) {
      // TODO: Once webgazer is installed, we'll implement the actual DOOM controls here
      // This will involve simulating keyboard events or directly controlling DOOM's view
    }

    lastGazeRef.current = data;
  }, [enabled, sensitivity, deadzone]);

  const handleBlink = useCallback(() => {
    if (!enabled || !blinkToShoot) return;
    // TODO: Implement shooting mechanism
  }, [enabled, blinkToShoot]);

  const { startTracking, stopTracking, startCalibration, isCalibrated, isTracking, error } = useEyeTracking({
    onGazeUpdate: handleGazeUpdate,
    onBlink: handleBlink,
    enableBlink: blinkToShoot,
  });

  useEffect(() => {
    if (enabled && !isTracking && isCalibrated) {
      startTracking();
    } else if (!enabled && isTracking) {
      stopTracking();
    }
  }, [enabled, isTracking, isCalibrated, startTracking, stopTracking]);

  return {
    isCalibrated,
    isTracking,
    error,
    startCalibration,
    startTracking,
    stopTracking,
  };
};
