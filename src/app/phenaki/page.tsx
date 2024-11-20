'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function PhenakiDemo() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError(null);
        setProcessedVideo(null);
      } else {
        setError('Please upload a valid video file');
      }
    }
  };

  const loadTestVideo = async () => {
    try {
      setProcessing(true);
      setError(null);

      const response = await fetch('https://phenaki-backend-demo-6029f061cb2a.herokuapp.com/api/test-video');
      if (!response.ok) {
        throw new Error('Failed to load test video');
      }

      const blob = await response.blob();
      const file = new File([blob], 'test_video.mp4', { type: 'video/mp4' });
      setVideoFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load test video');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcess = async () => {
    if (!videoFile) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await fetch('https://phenaki-backend-demo-6029f061cb2a.herokuapp.com/api/process-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      setProcessedVideo(videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-4xl font-bold mb-8">Phenaki Video Processing Demo</h1>

      <Card className="p-6 mb-6 bg-muted">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Demo Limitations & Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maximum file size: 50MB</li>
            <li>Videos larger than 1MB will be automatically compressed for processing</li>
            <li>Supported formats: MP4, WebM, MOV</li>
            <li>Processing time may vary based on video size and complexity</li>
            <li>The demo applies a basic edge detection effect to demonstrate the processing pipeline</li>
          </ul>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="video-upload">Upload Video</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={processing}
              className="w-full"
            />
          </div>

          <Button
            onClick={loadTestVideo}
            disabled={processing}
            variant="outline"
            className="w-full"
          >
            Load Test Video
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleProcess}
            disabled={!videoFile || processing}
            className="w-full"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Video'
            )}
          </Button>

          {videoFile && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Original Video</h3>
                <video
                  controls
                  src={URL.createObjectURL(videoFile)}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}

          {processedVideo && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Processed Video</h3>
              <video
                controls
                src={processedVideo}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
