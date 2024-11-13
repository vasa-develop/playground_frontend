'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GameVisualization } from "./components/GameVisualization";

interface GameState {
  minimap: {
    height_map: number[][];
    visibility_map: number[][];
  };
  units: Array<{
    position: [number, number];
    type: string;
    health: number;
  }>;
}

export default function AlphaStarDemo() {
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // TODO: Implement actual game connection
    setIsConnected(true);
    // Dummy game state for testing
    setGameState({
      minimap: {
        height_map: Array(128).fill(Array(128).fill(0.5)),
        visibility_map: Array(128).fill(Array(128).fill(1))
      },
      units: [
        { position: [400, 300], type: 'worker', health: 100 }
      ]
    });
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">AlphaStar Demo</h1>
          <Button
            variant="outline"
            onClick={handleConnect}
            disabled={isConnected}
          >
            {isConnected ? 'Connected' : 'Connect to Game'}
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Visualization */}
          <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Game Visualization</h3>
            </div>
            <div className="p-6">
              <GameVisualization gameState={gameState} />
            </div>
          </div>

          {/* Controls Panel */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Controls</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Available Actions</h4>
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant="secondary"
                    disabled={!isConnected}
                  >
                    {isConnected ? 'Select Action' : 'No actions available'}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Game State</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
                  <p>Units: {gameState?.units?.length ?? '--'}</p>
                  <p>Resources: --</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
