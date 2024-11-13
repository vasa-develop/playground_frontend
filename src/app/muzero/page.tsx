'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Separator } from "@radix-ui/react-separator";
import CartPoleVisualizer from './components/CartPoleVisualizer';

// Components will be added for different environments
const CartPoleDemo = () => {
  const [cartPoleState, setCartPoleState] = useState({
    cart_position: 0,
    cart_velocity: 0,
    pole_angle: 0,
    pole_velocity: 0
  });

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <CartPoleVisualizer state={cartPoleState} />
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Environment State</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Cart Position</p>
            <p className="font-mono">{cartPoleState.cart_position.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cart Velocity</p>
            <p className="font-mono">{cartPoleState.cart_velocity.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pole Angle</p>
            <p className="font-mono">{cartPoleState.pole_angle.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pole Velocity</p>
            <p className="font-mono">{cartPoleState.pole_velocity.toFixed(2)}</p>
          </div>
        </div>
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
