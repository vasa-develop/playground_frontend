'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, VStack, Text, Progress, useToast } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import type { WebGazer, WebGazerData } from './types';
import styles from './styles.module.css';

interface EyeTrackingState {
  pointsCollected: number;
  isCalibrated: boolean;
  isLoading: boolean;
}

function EyeTrackingPage(): React.ReactElement {
  const [pointsCollected, setPointsCollected] = useState<number>(0);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const webgazerRef = React.useRef<WebGazer | null>(null);
  const toast = useToast();

  // Set isBrowser on mount
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  // Initialize WebGazer
  const initWebGazer = useCallback(async () => {
    if (!isBrowser || typeof window === 'undefined') {
      console.log('Skipping WebGazer initialization - not in browser environment');
      return;
    }

    try {
      // Initialize WebGazer
      console.log('Loading WebGazer module...');
      const webgazerModule = await import('webgazer');
      webgazerRef.current = webgazerModule.default;
      
      // Begin WebGazer's camera initialization and tracking
      console.log('Starting WebGazer...');
      if (!webgazerRef.current) {
        throw new Error('WebGazer not initialized');
      }
      
      await webgazerRef.current.begin();
      
      // Configure WebGazer settings after initialization
      console.log('Configuring WebGazer...');
      webgazerRef.current
        .setGazeListener((data: WebGazerData | null) => {
          if (!data || !isCalibrated) return;

          // Get viewport height and current scroll position
          const viewportHeight = window.innerHeight;
          const currentScroll = window.scrollY;

          // Calculate relative position in viewport
          const relativeY = (data.y - currentScroll) / viewportHeight;

          // Scroll based on gaze position
          if (relativeY < 0.2) {
            window.scrollBy(0, -30); // Scroll up
          } else if (relativeY > 0.8) {
            window.scrollBy(0, 30); // Scroll down
          }
        })
        .showVideo(true)
        .showFaceOverlay(false)
        .showFaceFeedbackBox(false)
        .showPredictionPoints(true);

      // Make cursor dot violet
      const dotElement = document.getElementById('webgazerGazeDot');
      if (dotElement) {
        dotElement.style.background = 'violet';
      }

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
    if (!isBrowser || typeof window === 'undefined') {
      return;
    }

    initWebGazer();

    // Add styles to WebGazer video container
    const styleInterval = setInterval(() => {
      const videoContainer = document.getElementById('webgazerVideoContainer');
      if (videoContainer) {
        videoContainer.className = styles.webgazerVideoContainer;
        // Ensure overlay settings are maintained after style changes
        if (webgazerRef.current) {
          webgazerRef.current.showFaceOverlay(false);
          webgazerRef.current.showFaceFeedbackBox(false);
        }
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

  // Show loading state if not in browser
  if (!isBrowser) {
    return <div>Loading...</div>;
  }

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

// Disable SSR for the entire page
export default dynamic(() => Promise.resolve(EyeTrackingPage), { 
  ssr: false,
  loading: () => <div>Loading eye tracking...</div>
});
