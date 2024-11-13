'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
          <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Game Visualization</h3>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Game visualization will appear here</p>
              </div>
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
                  <Button className="w-full" variant="secondary" disabled>
                    No actions available
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Game State</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Status: Disconnected</p>
                  <p>Units: --</p>
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
