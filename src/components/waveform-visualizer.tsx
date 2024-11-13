"use client";

import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformVisualizerProps {
  audioUrl?: string;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  cursorColor?: string;
  onReady?: () => void;
  className?: string;
}

export function WaveformVisualizer({
  audioUrl,
  height = 128,
  waveColor = '#4aed88',
  progressColor = '#1db954',
  cursorColor = '#ffffff',
  onReady,
  className,
}: WaveformVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      container: containerRef.current,
      height,
      waveColor,
      progressColor,
      cursorColor,
      cursorWidth: 2,
      barWidth: 2,
      minPxPerSec: 50,
      normalize: true,
      fillParent: true,
    };

    wavesurfer.current = WaveSurfer.create(options);

    const ws = wavesurfer.current;

    ws.on('ready', () => {
      if (onReady) onReady();
      setDuration(ws.getDuration());
    });

    ws.on('timeupdate', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    if (audioUrl) {
      ws.load(audioUrl);
    }

    return () => {
      ws.destroy();
    };
  }, [audioUrl, height, waveColor, progressColor, cursorColor, onReady]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full" />
      <div className="flex justify-between text-sm mt-2">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
