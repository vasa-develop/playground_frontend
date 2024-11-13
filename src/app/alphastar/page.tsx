import React from 'react';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: 'AlphaStar Demo | Scientific Visualizations',
  description: 'Interactive demo of DeepMind\'s AlphaStar, a StarCraft II AI agent',
};

export default function AlphaStarDemo() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">AlphaStar Demo</h1>
          <Button variant="outline">Connect to Game</Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Visualization */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Game Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Game visualization will appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Controls Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Available Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full" variant="secondary" disabled>
                    No actions available
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold">Game State</h3>
                <div className="text-sm text-slate-500">
                  <p>Status: Disconnected</p>
                  <p>Units: --</p>
                  <p>Resources: --</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
