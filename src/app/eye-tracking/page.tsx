'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import styles from './styles.module.css';
import Script from 'next/script';
import { initWebGazer, cleanupWebGazer } from './webgazer-init';
import './global.css';

export default function EyeTrackingPage() {
  const [calibrationPoints, setCalibrationPoints] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webgazerRef = useRef<any>(null);

  useEffect(() => {
    const setupGazeListener = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const webgazer = await initWebGazer();
        webgazerRef.current = webgazer;

        webgazer.setGazeListener((data: any) => {
          if (data == null || !isCalibrated) return;

          const viewportHeight = window.innerHeight;
          const scrollThreshold = 0.2;
          const baseScrollSpeed = 2;
          const maxScrollSpeed = 8;
          
          const topThreshold = viewportHeight * scrollThreshold;
          const bottomThreshold = viewportHeight * (1 - scrollThreshold);
          
          if (data.y < topThreshold) {
            const distance = topThreshold - data.y;
            const speed = Math.min(baseScrollSpeed + (distance / topThreshold) * maxScrollSpeed, maxScrollSpeed);
            window.scrollBy({
              top: -speed,
              behavior: 'smooth'
            });
          } else if (data.y > bottomThreshold) {
            const distance = data.y - bottomThreshold;
            const speed = Math.min(baseScrollSpeed + (distance / (viewportHeight - bottomThreshold)) * maxScrollSpeed, maxScrollSpeed);
            window.scrollBy({
              top: speed,
              behavior: 'smooth'
            });
          }
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize WebGazer:', err);
        setError('Failed to initialize eye tracking. Please ensure camera access is allowed and try again.');
        setIsLoading(false);
      }
    };

    setupGazeListener();

    return () => {
      cleanupWebGazer();
    };
  }, [isCalibrated]);

  const handleCalibrationClick = () => {
    if (!isCalibrated) {
      setCalibrationPoints(prev => {
        const newCount = Math.min(prev + 1, 5);
        if (newCount >= 5) {
          setIsCalibrated(true);
        }
        return newCount;
      });
    }
  };

  return (
    <>
      <Script 
        src="https://webgazer.cs.brown.edu/webgazer.js" 
        strategy="beforeInteractive"
        onError={() => setError('Failed to load eye tracking script')}
      />
      <Box className={styles.eyeTrackingContainer}>
        {error && (
          <Box 
            p={4} 
            bg="red.100" 
            color="red.900" 
            borderRadius="md" 
            mb={4}
          >
            {error}
          </Box>
        )}
        
        {isLoading && (
          <Box 
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
          >
            <Text color="white">Initializing eye tracking...</Text>
          </Box>
        )}

        {!isCalibrated && (
          <Box 
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.8)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            onClick={handleCalibrationClick}
          >
            <Box bg="white" p={8} borderRadius={8} textAlign="center" maxW="80%">
              <Text fontSize="2xl" mb={4}>Calibration Required</Text>
              <Text mb={4}>Please look at the cursor and click a few points on the screen to calibrate the eye tracker.</Text>
              <Text mb={4}>Click at least 5 different points for better accuracy.</Text>
              <Text>Points collected: {calibrationPoints}/5</Text>
            </Box>
          </Box>
        )}

        <VStack spacing={6} p={8}>
          <Box p={4} bg="gray.100" borderRadius="md" w="100%">
            <Text fontSize="2xl">Eye Tracking Scroll Demo</Text>
            <Text>This demo uses your webcam to track your eye movements and automatically scroll the page.</Text>
            <Text mt={4}>Instructions:</Text>
            <VStack align="start" pl={4} mt={2}>
              <Text>1. Allow camera access when prompted</Text>
              <Text>2. Follow the calibration instructions</Text>
              <Text>3. Look towards the bottom of the page to scroll down</Text>
              <Text>4. Look towards the top of the page to scroll up</Text>
            </VStack>
          </Box>

          {/* Scrollable content sections */}
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i} p={4} bg="gray.100" borderRadius="md" w="100%">
              <Text fontSize="xl" mb={2}>Section {i + 1}</Text>
              <Text>This is a scrollable section. Look up or down to scroll through the content.</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </>
  );
}
