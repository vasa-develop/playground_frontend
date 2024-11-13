"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { WaveformVisualizer } from "@/components/waveform-visualizer";
import { useToast } from "@/components/ui/use-toast";

export default function WaveNetDemo(): React.ReactElement {
  const [temperature, setTemperature] = useState<number>(0.8);
  const [pitch, setPitch] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature,
          pitch,
          speed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setAudioUrl(data.audioUrl);
      toast({
        title: "Success",
        description: "Audio generated successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate audio',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>WaveNet Demo</h1>
        <p className={styles.description}>
          Experiment with WaveNet, a deep generative model for raw audio developed by DeepMind.
          Generate realistic-sounding human speech and explore different generation parameters.
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <Card className="p-6">
            <h2 className={styles.sectionTitle}>Audio Generation</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Temperature (randomness)</Label>
                  <Slider
                    value={[temperature]}
                    onValueChange={([value]) => setTemperature(value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Controls the randomness of the generation. Higher values (closer to 1) produce more varied but potentially less stable output.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Pitch Adjustment</Label>
                  <Slider
                    value={[pitch]}
                    onValueChange={([value]) => setPitch(value)}
                    min={-12}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Adjust pitch by {pitch > 0 ? `+${pitch}` : pitch} semitones. Positive values make the audio higher, negative values make it lower.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Generation Speed</Label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    Speed multiplier: {speed.toFixed(1)}x. Values below 1 slow down the audio, above 1 speed it up.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating Audio..." : "Generate Audio"}
              </Button>

              {audioUrl && (
                <div className="mt-6">
                  <WaveformVisualizer
                    audioUrl={audioUrl}
                    className="w-full"
                    height={128}
                    waveColor="#4aed88"
                    progressColor="#1db954"
                  />
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
