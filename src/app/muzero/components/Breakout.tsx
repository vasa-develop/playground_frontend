'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Type definitions for props
interface BreakoutProps {
  gameState: number[][][];
  onAction: (action: number) => void;
  isAIEnabled: boolean;
  onToggleAI: () => void;
  gameOver: boolean;
  terminationReason?: string;
}

const GAME_WIDTH = 160;
const GAME_HEIGHT = 210;
const PADDLE_HEIGHT = 5;
const PADDLE_WIDTH = 40;
const BALL_SIZE = 4;

export const Breakout: React.FC<BreakoutProps> = ({
  gameState,
  onAction,
  isAIEnabled,
  onToggleAI,
  gameOver,
  terminationReason
}) => {
  const [keyPressed, setKeyPressed] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setKeyPressed(prev => ({ ...prev, [e.key]: true }));
        onAction(e.key === 'ArrowLeft' ? 3 : 2);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setKeyPressed(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onAction]);

  // Convert gameState to visual elements
  const renderGameState = () => {
    if (!gameState || !gameState[0]) return null;

    const frame = gameState[0];
    const normalizedFrame = frame.map(row =>
      row.map(pixel => Math.min(255, Math.max(0, pixel * 255)))
    );

    return (
      <div
        className="relative bg-black"
        style={{
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          transform: 'scale(2)',
          transformOrigin: 'top left'
        }}
      >
        {normalizedFrame.map((row, y) =>
          row.map((pixel, x) =>
            pixel > 0 && (
              <div
                key={`${x}-${y}`}
                className="absolute bg-white"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: '1px',
                  height: '1px',
                  opacity: pixel / 255
                }}
              />
            )
          )
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative">
        {renderGameState()}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl font-bold">
              Game Over
              {terminationReason && (
                <div className="text-sm mt-2">
                  Reason: {terminationReason}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onToggleAI}
              variant={isAIEnabled ? "default" : "outline"}
              className="mt-4"
            >
              {isAIEnabled ? "Disable AI" : "Enable AI"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle between AI and manual control</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!isAIEnabled && (
        <div className="text-sm text-gray-500 mt-2">
          Use left and right arrow keys to control the paddle
        </div>
      )}
    </div>
  );
};




