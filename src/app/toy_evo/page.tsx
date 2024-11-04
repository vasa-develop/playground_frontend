'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const generateRandomDNA = (length: number = 20): string => {
  const bases = ['A', 'T', 'C', 'G'];
  return Array.from({ length }, () => bases[Math.floor(Math.random() * bases.length)]).join('');
};

const DNAViewer = ({ sequence }: { sequence: string }) => {
  return (
    <div className="font-mono text-lg break-all">
      {sequence.split('').map((base, index) => {
        const baseColors: Record<string, string> = {
          'A': 'text-green-500',
          'T': 'text-red-500',
          'C': 'text-blue-500',
          'G': 'text-yellow-500'
        };
        return (
          <span key={index} className={baseColors[base]}>
            {base}
          </span>
        );
      })}
    </div>
  );
};

export default function ToyEvo() {
  const [dnaSequence, setDnaSequence] = useState<string>('');

  const handleGenerateClick = () => {
    setDnaSequence(generateRandomDNA());
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Evo Toy - DNA Generator</h1>
        <div className="space-y-4">
          <Button
            onClick={handleGenerateClick}
            className="w-full sm:w-auto"
          >
            Generate DNA Sequence
          </Button>
          {dnaSequence && (
            <div className="p-4 rounded-lg border bg-card">
              <DNAViewer sequence={dnaSequence} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
