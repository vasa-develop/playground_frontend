'use client';

import React, { useState, useCallback } from 'react';

interface CalibrationPoint {
  x: number;
  y: number;
  completed: boolean;
}

interface Props {
  onCalibrationComplete: () => void;
  onCalibrationCancel: () => void;
  pointCount?: number;
}

export const EyeTrackingCalibration: React.FC<Props> = ({
  onCalibrationComplete,
  onCalibrationCancel,
  pointCount = 9
}) => {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [points, setPoints] = useState<CalibrationPoint[]>(() => {
    // Create a grid of calibration points
    const points: CalibrationPoint[] = [];
    const rows = Math.ceil(Math.sqrt(pointCount));
    const cols = Math.ceil(pointCount / rows);
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (points.length < pointCount) {
          points.push({
            x: (j + 1) * (100 / (cols + 1)),
            y: (i + 1) * (100 / (rows + 1)),
            completed: false
          });
        }
      }
    }
    return points;
  });

  const handlePointClick = useCallback((index: number) => {
    // TODO: Once webgazer is installed, we'll add the actual calibration logic here
    setPoints(prev => prev.map((p, i) => 
      i === index ? { ...p, completed: true } : p
    ));
    
    if (index === points.length - 1) {
      onCalibrationComplete();
    } else {
      setCurrentPoint(index + 1);
    }
  }, [points.length, onCalibrationComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg max-w-lg w-full text-white">
        <h2 className="text-xl font-bold mb-4">Eye Tracking Calibration</h2>
        <p className="mb-4">
          Please click each point while looking directly at it. This helps calibrate the eye tracker.
        </p>
        
        <div className="relative w-full h-[400px] bg-gray-900 rounded-lg mb-4">
          {points.map((point, index) => (
            <button
              key={index}
              className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full transition-all duration-300 ${
                index === currentPoint
                  ? 'bg-blue-500 animate-pulse'
                  : point.completed
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => handlePointClick(index)}
              disabled={index !== currentPoint}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            onClick={onCalibrationCancel}
          >
            Cancel
          </button>
          <div className="text-gray-400">
            Point {currentPoint + 1} of {points.length}
          </div>
        </div>
      </div>
    </div>
  );
};
