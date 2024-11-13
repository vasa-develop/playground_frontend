'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Solution {
  code: string;
  explanation: string;
}

export default function AlphaCodePage() {
  const [problemDescription, setProblemDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);

  const handleGenerateSolution = async () => {
    if (!problemDescription.trim()) {
      setError("Please enter a problem description");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSolution({
        code: "// Solution will be generated here\nfunction solve() {\n  // Implementation\n}",
        explanation: "Explanation of the solution will appear here."
      });
    } catch (err) {
      setError("Failed to generate solution. Please try again.");
      setSolution(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">AlphaCode Playground</h1>
      <p className="text-lg mb-8">
        Interactive competitive programming problem solver powered by AI
      </p>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Problem Description</h2>
            <Textarea
              placeholder="Describe your programming problem here..."
              value={problemDescription}
              onChange={(e) => {
                setProblemDescription(e.target.value);
                setError(null);
              }}
              className="min-h-[200px]"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              className="w-full"
              onClick={handleGenerateSolution}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Solution"}
            </Button>
          </div>
        </div>

        {solution && (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Generated Solution</h2>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {solution.code}
                </pre>
              </div>
              <h3 className="text-xl font-semibold">Explanation</h3>
              <p className="text-sm text-muted-foreground">
                {solution.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
