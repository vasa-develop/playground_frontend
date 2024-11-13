import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useInterval } from 'react-use';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toggle from '@radix-ui/react-toggle';

interface BreakoutProps {
  gameState: number[][][];
  onAction: (action: number) => void;
  isAIEnabled: boolean;
  onToggleAI: () => void;
  gameOver: boolean;
  terminationReason?: string;
}

const Breakout: React.FC<BreakoutProps> = ({
  gameState,
  onAction,
  isAIEnabled,
  onToggleAI,
  gameOver,
  terminationReason,
}) => {
  const [paddlePosition, setPaddlePosition] = useState(0);
  const stageRef = useRef<any>(null);

  // Convert grayscale frame to visible elements
  const renderFrame = (frame: number[][]) => {
    const elements = [];
    const scale = 6; // Scale up the 84x84 frame

    for (let y = 0; y < frame.length; y++) {
      for (let x = 0; x < frame[y].length; x++) {
        if (frame[y][x] > 0.1) { // Threshold for visibility
          elements.push(
            <Rect
              key={`${x}-${y}`}
              x={x * scale}
              y={y * scale}
              width={scale}
              height={scale}
              fill={`rgb(${frame[y][x] * 255}, ${frame[y][x] * 255}, ${frame[y][x] * 255})`}
            />
          );
        }
      }
    }
    return elements;
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver || isAIEnabled) return;

      switch (e.key) {
        case 'ArrowLeft':
          onAction(3); // Move left
          setPaddlePosition((prev) => Math.max(prev - 10, 0));
          break;
        case 'ArrowRight':
          onAction(2); // Move right
          setPaddlePosition((prev) => Math.min(prev + 10, 500));
          break;
        case ' ':
          onAction(1); // Fire/Start
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, isAIEnabled, onAction]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Stage width={504} height={504} ref={stageRef}>
          <Layer>
            {gameState && gameState[0] && renderFrame(gameState[0])}
          </Layer>
        </Stage>

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-2xl font-bold">
              Game Over
              {terminationReason && (
                <div className="text-sm mt-2 text-gray-300">
                  {terminationReason}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Toggle.Root
                className={`inline-flex items-center justify-center rounded px-3 py-2 text-sm font-medium ${
                  isAIEnabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                pressed={isAIEnabled}
                onPressedChange={onToggleAI}
              >
                AI Control
              </Toggle.Root>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-800 text-white px-3 py-2 rounded text-sm"
                sideOffset={5}
              >
                Toggle between AI and manual control
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        {!isAIEnabled && (
          <div className="text-sm text-gray-600">
            Use arrow keys to move, spacebar to start
          </div>
        )}
      </div>
    </div>
  );
};

export default Breakout;
