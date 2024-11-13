'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Separator } from "@radix-ui/react-separator";
import CartPoleVisualizer from './components/CartPoleVisualizer';

const BACKEND_URL = 'https://muzero-backend-yaulseqd.fly.dev';

interface GameState {
  cart_position: number;
  cart_velocity: number;
  pole_angle: number;
  pole_velocity: number;
  done: boolean;
  reward: number;
  suggested_action?: number;
}

// Components will be added for different environments
const CartPoleDemo = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    cart_position: 0,
    cart_velocity: 0,
    pole_angle: 0,
    pole_velocity: 0,
    done: false,
    reward: 0
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContinuousMode, setIsContinuousMode] = useState(false);

  // Initialize game
  const initializeGame = async () => {
    try {
      const newSessionId = `session_${Date.now()}`;
      const response = await fetch(`${BACKEND_URL}/game/init?session_id=${newSessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGameState({
        cart_position: data.cart_position,
        cart_velocity: data.cart_velocity,
        pole_angle: data.pole_angle,
        pole_velocity: data.pole_velocity,
        done: data.done,
        reward: data.reward,
        suggested_action: data.suggested_action
      });
      setSessionId(newSessionId);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setGameState({
        cart_position: 0,
        cart_velocity: 0,
        pole_angle: 0,
        pole_velocity: 0,
        done: false,
        reward: 0,
        suggested_action: undefined
      });
    }
  };

  // Take action in game
  const takeAction = async (action: number, useAI: boolean = false) => {
    if (!sessionId || !isPlaying) return;

    try {
      const response = await fetch(`${BACKEND_URL}/game/step/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, use_ai: useAI }),
      });
      const newState = await response.json();
      setGameState(newState);

      if (newState.done) {
        setIsPlaying(false);
        setSessionId(null);
      }
    } catch (error) {
      console.error('Failed to take action:', error);
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (event.key) {
        case 'ArrowLeft':
          takeAction(0);
          break;
        case 'ArrowRight':
          takeAction(1);
          break;
        case 'a':
          takeAction(gameState.suggested_action || 0, true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameState.suggested_action]);

  // Handle continuous AI mode
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && isContinuousMode && !gameState.done) {
      intervalId = setInterval(() => {
        takeAction(gameState.suggested_action || 0, true);
      }, 1000); // Poll every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, isContinuousMode, gameState.done, gameState.suggested_action]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <CartPoleVisualizer state={gameState} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Environment State</h3>
          <div className="space-x-4">
            {!isPlaying ? (
              <button
                onClick={initializeGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Game
              </button>
            ) : (
              <>
                <button
                  onClick={() => takeAction(0)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Left
                </button>
                <button
                  onClick={() => takeAction(1)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Right
                </button>
                <button
                  onClick={() => setIsContinuousMode(!isContinuousMode)}
                  className={`px-4 py-2 ${isContinuousMode ? 'bg-green-600' : 'bg-green-500'} text-white rounded hover:bg-green-600`}
                >
                  {isContinuousMode ? 'Stop AI' : 'Start AI'}
                </button>
                {!isContinuousMode && (
                  <button
                    onClick={() => takeAction(gameState.suggested_action || 0, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Use AI Once
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Cart Position</p>
            <p className="font-mono">{typeof gameState?.cart_position === 'number' ? gameState.cart_position.toFixed(2) : '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cart Velocity</p>
            <p className="font-mono">{typeof gameState?.cart_velocity === 'number' ? gameState.cart_velocity.toFixed(2) : '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pole Angle</p>
            <p className="font-mono">{typeof gameState?.pole_angle === 'number' ? gameState.pole_angle.toFixed(2) : '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pole Velocity</p>
            <p className="font-mono">{typeof gameState?.pole_velocity === 'number' ? gameState.pole_velocity.toFixed(2) : '0.00'}</p>
          </div>
        </div>
        {gameState.suggested_action !== undefined && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">AI Suggestion</p>
            <p className="font-mono">{gameState.suggested_action === 0 ? 'Left' : 'Right'}</p>
          </div>
        )}
        {gameState.done && (
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            <p className="text-yellow-800">Game Over! Final reward: {gameState.reward}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LunarLanderDemo = () => (
  <div className="p-4">
    <p className="text-gray-700">LunarLander Environment Demo (Coming Soon)</p>
  </div>
);

export default function MuZeroDemo() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">
          MuZero Interactive Demo
        </h1>
        <p className="text-gray-600">
          Explore DeepMind&apos;s MuZero algorithm through interactive demonstrations
          in different environments. Watch as the AI learns to balance the pole in real-time.
        </p>

        <Separator className="my-4" />

        <Tabs defaultValue="cartpole" className="w-full">
          <TabsList className="flex h-10 items-center justify-start rounded-md bg-slate-100 p-1">
            <TabsTrigger
              value="cartpole"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
            >
              CartPole
            </TabsTrigger>
            <TabsTrigger
              value="lunarlander"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
            >
              LunarLander
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cartpole" className="mt-6">
            <CartPoleDemo />
          </TabsContent>
          <TabsContent value="lunarlander" className="mt-6">
            <LunarLanderDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
