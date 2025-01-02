'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, VStack, Text, Progress, useToast } from '@chakra-ui/react';
import type { WebGazer, WebGazerData } from './types/webgazer';
import styles from './styles.module.css';

interface EyeTrackingState {
  pointsCollected: number;
  isCalibrated: boolean;
  isLoading: boolean;
}

export default function EyeTrackingPage(): React.ReactElement {
  const [pointsCollected, setPointsCollected] = useState<number>(0);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const webgazerRef = React.useRef<WebGazer | null>(null);
  const toast = useToast();

  // Initialize WebGazer
  const initWebGazer = useCallback(async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // List available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No camera devices found');
      }

      console.log('Available video devices:', videoDevices);

      // Request camera permissions explicitly first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user"
          },
          audio: false
        });

        // Keep the stream active
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          console.log('Camera permission granted:', videoTrack.label);
        }
      } catch (error: any) {
        console.error('Camera permission error:', error);
        throw new Error(`Camera access failed: ${error.message || 'Permission denied'}`);
      }

      // Import and initialize WebGazer
      console.log('Loading WebGazer module...');
      const webgazerModule = await import('webgazer');
      webgazerRef.current = webgazerModule.default;

      // Initialize WebGazer with debug mode
      console.log('Initializing WebGazer...');
      await webgazerRef.current
        .setGazeListener((data: WebGazerData | null) => {
          if (!data || !isCalibrated) return;

          // Get viewport height and current scroll position
          const viewportHeight = window.innerHeight;
          const scrollPosition = window.scrollY;

          // Calculate relative Y position
          const relativeY = data.y / viewportHeight;

          // Scroll based on gaze position
          if (relativeY < 0.2) {
            window.scrollTo({
              top: scrollPosition - 20,
              behavior: 'smooth'
            });
          } else if (relativeY > 0.8) {
            window.scrollTo({
              top: scrollPosition + 20,
              behavior: 'smooth'
            });
          }
        })
        .begin();

      // Show webcam feed
      webgazerRef.current.showVideo(true);
      webgazerRef.current.showFaceOverlay(true);
      webgazerRef.current.showFaceFeedbackBox(true);

      setIsLoading(false);
      
      toast({
        title: 'WebGazer initialized',
        description: 'Please calibrate by clicking on 5 different points while looking at them.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to initialize WebGazer:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize eye tracking. Please ensure camera permissions are granted.',
        status: 'error',
        duration: null,
        isClosable: true,
      });
    }
  }, [toast, isCalibrated]);

  // Handle calibration clicks
  const handleCalibrationClick = useCallback(() => {
    setPointsCollected((prev: number) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setIsCalibrated(true);
        toast({
          title: 'Calibration complete',
          description: 'You can now scroll the page by looking at the top or bottom areas.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      return newCount;
    });
  }, [toast]);

  // Initialize WebGazer on component mount
  useEffect(() => {
    initWebGazer();

    // Add styles to WebGazer video container
    const styleInterval = setInterval(() => {
      const videoContainer = document.getElementById('webgazerVideoContainer');
      if (videoContainer) {
        videoContainer.className = styles.webgazerVideoContainer;
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      if (webgazerRef.current) {
        webgazerRef.current.end();
      }
      clearInterval(styleInterval);
    };
  }, [initWebGazer]);

  return (
    <Box 
      className={styles.eyeTrackingContainer}
      p={8} 
      onClick={!isCalibrated ? handleCalibrationClick : undefined}
      cursor={!isCalibrated ? 'pointer' : 'default'}
    >
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Eye Tracking Scroll Demo
        </Text>
        
        {isLoading ? (
          <Text>Initializing eye tracking...</Text>
        ) : !isCalibrated ? (
          <>
            <Text>
              Please look at your cursor and click on 5 different points on the screen to calibrate.
            </Text>
            <Box>
              <Text mb={2}>Calibration Progress: {pointsCollected}/5 points</Text>
              <Progress value={(pointsCollected / 5) * 100} />
            </Box>
          </>
        ) : (
          <Text>
            Calibration complete! Look at the top or bottom of the page to scroll.
          </Text>
        )}

        {/* Sample content for scrolling */}
        {isCalibrated && (
          <VStack spacing={4} align="stretch">
            {Array.from({ length: 20 }).map((_, i) => (
              <Box key={i} p={4} bg="gray.100" borderRadius="md" className={styles.scrollSection}>
                <Text>Scroll section {i + 1}</Text>
                <Text fontSize="sm">
                  Look at the top or bottom of the page to scroll through this content.
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
