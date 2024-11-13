'use client';

import { useEffect, useRef } from 'react';

interface GameVisualizationProps {
  gameState?: {
    minimap?: {
      height_map?: number[][];
      visibility_map?: number[][];
    };
    units?: Array<{
      position: [number, number];
      type: string;
      health: number;
    }>;
  };
  className?: string;
}

export function GameVisualization({ gameState, className = '' }: GameVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1b1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameState?.minimap) {
      // Draw placeholder text when no game state
      ctx.fillStyle = '#4a4b4f';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Waiting for game state...', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw minimap
    if (gameState.minimap.height_map) {
      const { height_map } = gameState.minimap;
      const cellWidth = canvas.width / height_map[0].length;
      const cellHeight = canvas.height / height_map.length;

      height_map.forEach((row, y) => {
        row.forEach((height, x) => {
          const color = Math.floor(height * 255);
          ctx.fillStyle = `rgb(${color},${color},${color})`;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        });
      });
    }

    // Draw units
    if (gameState.units) {
      gameState.units.forEach(unit => {
        const [x, y] = unit.position;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
      });
    }
  }, [gameState]);

  return (
    <div className={`relative aspect-video bg-slate-900 rounded-lg ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={800}
        height={600}
      />
    </div>
  );
}
