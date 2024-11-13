'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GameVisualization } from "./components/GameVisualization";
import { GameState, gameStateManager } from './services/api';

export default function AlphaStarDemo() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const handleStateUpdate = (newState: GameState) => {
      setGameState(newState);
      setIsConnected(newState.connected);
    };

    gameStateManager.connect(handleStateUpdate);

    // Initial game state fetch
    gameStateManager.getGameState()
      .then(handleStateUpdate)
      .catch(console.error);

    return () => {
      gameStateManager.disconnect();
    };
  }, []);

  const handleConnect = async () => {
    try {
      const state = await gameStateManager.getGameState();
      setGameState(state);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleAction = async (action: string) => {
    try {
      await gameStateManager.performAction(action);
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
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
                    onClick={() => handleAction('move')}
                    disabled={!isConnected}
                  >
                    Move Units
                  </Button>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => handleAction('attack')}
                    disabled={!isConnected}
                  >
                    Attack
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Game State</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
                  <p>Units: {gameState?.units?.length ?? '--'}</p>
                  <p>Current Action: {gameState?.current_action ?? '--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
