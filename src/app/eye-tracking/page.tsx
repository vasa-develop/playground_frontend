'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import styles from './styles.module.css';

declare global {
  interface Window {
    webgazer: any;
  }
}

export default function EyeTrackingPage() {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState(0);

  useEffect(() => {
    let webgazer: any = null;

    const initWebGazer = async () => {
      try {
        webgazer = window.webgazer;
        await webgazer
          .setRegression('ridge')
          .setTracker('TFFacemesh')
          .begin();

        webgazer.setGazeListener((data: any) => {
          if (data == null || !isCalibrated) return;

          const viewportHeight = window.innerHeight;
          const scrollZone = viewportHeight * 0.2;

          if (data.y < scrollZone) {
            window.scrollBy(0, -10);
          } else if (data.y > viewportHeight - scrollZone) {
            window.scrollBy(0, 10);
          }
        });
      } catch (err) {
        console.error('Failed to initialize WebGazer:', err);
      }
    };

    if (window.webgazer) {
      initWebGazer();
    }

    return () => {
      try {
        if (window.webgazer) {
          window.webgazer.end();
        }
      } catch (err) {
        console.warn('Error during cleanup:', err);
      }
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
        onError={() => console.error('Failed to load WebGazer')}
      />

      {!isCalibrated && (
        <div className={styles.calibrationOverlay} onClick={handleCalibrationClick}>
          <div className={styles.calibrationMessage}>
            <h2>Calibration Required</h2>
            <p>Please look at the cursor and click a few points on the screen to calibrate the eye tracker.</p>
            <p>Click at least 5 different points for better accuracy.</p>
            <p>Points collected: {calibrationPoints}/5</p>
          </div>
        </div>
      )}

      <div className={styles.eyeTrackingContainer}>
        <section className={styles.scrollSection}>
          <h1>Eye Tracking Scroll Demo</h1>
          <p>This demo uses your webcam to track your eye movements and automatically scroll the page.</p>
          <p>Instructions:</p>
          <ol>
            <li>Allow camera access when prompted</li>
            <li>Follow the calibration instructions</li>
            <li>Look towards the bottom of the page to scroll down</li>
            <li>Look towards the top of the page to scroll up</li>
          </ol>
        </section>

        {[1, 2, 3, 4].map((section) => (
          <section key={section} className={styles.scrollSection}>
            <h2>Section {section}</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </section>
        ))}
      </div>
    </>
  );
}
