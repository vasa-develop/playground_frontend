'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import Plot component to avoid SSR issues
const MCMCPlot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function MCMCSamplingVisualization() {
  const [numWalkers, setNumWalkers] = useState(50);
  const [temperature, setTemperature] = useState(300);
  const [isAnimating, setIsAnimating] = useState(true);
  const [acceptanceHistory, setAcceptanceHistory] = useState([]);
  const [walkerPositions, setWalkerPositions] = useState([]);
  const animationId = useRef(null);
  const currentStep = useRef(0);
  const maxHistoryLength = 100;

  // Initialize walker positions
  const initializeWalkers = useCallback((numWalkers) => {
    const newWalkerPositions = Array(numWalkers).fill().map(() => ({
      x: [],
      y: [],
      z: []
    }));
    setWalkerPositions(newWalkerPositions);
  }, []);

  // Generate new walker positions using Metropolis-Hastings
  const updateWalkers = useCallback(() => {
    const stepSize = 0.1;
    let accepted = 0;
    const beta = 1 / (temperature * 8.617333262145e-5); // Boltzmann constant in eV/K

    const newWalkerPositions = walkerPositions.map(walker => {
      // Get current position or initialize
      let x = walker.x.length > 0 ? walker.x[walker.x.length - 1] : (Math.random() - 0.5) * 2;
      let y = walker.y.length > 0 ? walker.y[walker.y.length - 1] : (Math.random() - 0.5) * 2;
      let z = walker.z.length > 0 ? walker.z[walker.z.length - 1] : (Math.random() - 0.5) * 2;

      // Propose new position
      const newX = x + (Math.random() - 0.5) * stepSize;
      const newY = y + (Math.random() - 0.5) * stepSize;
      const newZ = z + (Math.random() - 0.5) * stepSize;

      // Calculate acceptance probability (using a simple harmonic potential)
      const oldEnergy = (x*x + y*y + z*z) / 2;
      const newEnergy = (newX*newX + newY*newY + newZ*newZ) / 2;
      const deltaE = newEnergy - oldEnergy;

      if (Math.random() < Math.exp(-beta * deltaE)) {
        x = newX;
        y = newY;
        z = newZ;
        accepted++;
      }

      // Update walker history
      const newX_history = [...walker.x, x].slice(-maxHistoryLength);
      const newY_history = [...walker.y, y].slice(-maxHistoryLength);
      const newZ_history = [...walker.z, z].slice(-maxHistoryLength);

      return {
        x: newX_history,
        y: newY_history,
        z: newZ_history
      };
    });

    // Calculate acceptance rate
    const acceptanceRate = accepted / walkerPositions.length;
    setAcceptanceHistory(prev => [...prev.slice(-maxHistoryLength + 1), acceptanceRate]);
    setWalkerPositions(newWalkerPositions);
    return acceptanceRate;
  }, [temperature, walkerPositions]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isAnimating) return;
    updateWalkers();
    currentStep.current++;
    animationId.current = requestAnimationFrame(animate);
  }, [isAnimating, updateWalkers]);

  // Initialize animation
  useEffect(() => {
    initializeWalkers(numWalkers);
  }, [initializeWalkers, numWalkers]);

  // Handle animation state
  useEffect(() => {
    if (isAnimating) {
      animate();
    } else if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [isAnimating, animate]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    currentStep.current = 0;
    setAcceptanceHistory([]);
    initializeWalkers(numWalkers);
  }, [initializeWalkers, numWalkers]);

  // Toggle animation
  const toggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  // Prepare plot data
  const trajectoryData = walkerPositions.map((walker, i) => ({
    type: 'scatter3d',
    mode: 'lines',
    x: walker.x,
    y: walker.y,
    z: walker.z,
    name: `Walker ${i+1}`,
    line: {
      width: 2,
      color: `hsl(${(i * 360 / walkerPositions.length)}, 70%, 50%)`
    }
  }));

  const trajectoryLayout = {
    title: 'Walker Trajectories',
    scene: {
      xaxis: { title: 'X Position' },
      yaxis: { title: 'Y Position' },
      zaxis: { title: 'Z Position' }
    },
    margin: { t: 50 },
    autosize: true
  };

  const steps = Array.from({ length: acceptanceHistory.length }, (_, i) => i);
  const acceptanceData = [{
    type: 'scatter',
    mode: 'lines',
    x: steps,
    y: acceptanceHistory,
    name: 'Acceptance Rate',
    line: { color: 'blue' }
  }];

  const acceptanceLayout = {
    title: 'MCMC Acceptance Rate',
    xaxis: { title: 'Step' },
    yaxis: {
      title: 'Acceptance Rate',
      range: [0, 1]
    },
    margin: { t: 50 },
    autosize: true
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        FermiNet MCMC Sampling Visualization
      </div>
      <div className={styles.controlPanel}>
        <div className={styles.sliderContainer}>
          <label htmlFor="walkers">
            Number of Walkers: {numWalkers}
          </label>
          <input
            type="range"
            id="walkers"
            min="10"
            max="100"
            value={numWalkers}
            onChange={(e) => setNumWalkers(Number(e.target.value))}
          />
        </div>
        <div className={styles.sliderContainer}>
          <label htmlFor="temperature">
            Temperature (K): {temperature}
          </label>
          <input
            type="range"
            id="temperature"
            min="100"
            max="1000"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </div>
        <button onClick={resetSimulation}>Reset Simulation</button>
        <button onClick={toggleAnimation}>
          {isAnimating ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.plot}>
          <MCMCPlot
            data={trajectoryData}
            layout={trajectoryLayout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className={styles.plot}>
          <MCMCPlot
            data={acceptanceData}
            layout={acceptanceLayout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
