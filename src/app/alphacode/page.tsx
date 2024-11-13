'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AlphaCodePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">AlphaCode Playground</h1>
      <p className="text-lg mb-8">
        Interactive competitive programming problem solver powered by AI
      </p>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Problem Description</h2>
          <Textarea
            placeholder="Describe your programming problem here..."
            className="min-h-[200px]"
          />
          <Button
            className="w-full"
            onClick={() => {
              // TODO: Implement solution generation
              console.log("Generating solution...");
            }}
          >
            Generate Solution
          </Button>
        </div>
      </div>
    </div>
  );
}
