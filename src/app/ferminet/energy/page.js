'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function EnergyConvergence() {
  const [data, setData] = useState(null);

  // Generate mock training data
  const generateTrainingData = (iterations = 1000) => {
    const data = [];
    let energy = -0.5; // Starting close to ground state energy of hydrogen

    for (let i = 0; i < iterations; i++) {
      // Add some noise and convergence behavior
      const noise = 0.01 * Math.random();
      const convergence = 0.1 * Math.exp(-i/200);
      energy = energy * (1 + noise * convergence);

      data.push({
        iteration: i,
        energy: energy,
        moving_avg: energy // In real implementation, calculate actual moving average
      });
    }
    return data;
  };

  // Create plot data and layout configuration
  const createVisualization = (data) => {
    const iterations = data.map(d => d.iteration);
    const energies = data.map(d => d.energy);
    const movingAvg = data.map(d => d.moving_avg);

    return {
      data: [
        {
          x: iterations,
          y: energies,
          type: 'scatter',
          mode: 'lines',
          name: 'Energy',
          line: {
            color: 'rgb(31, 119, 180)',
            width: 1
          }
        },
        {
          x: iterations,
          y: movingAvg,
          type: 'scatter',
          mode: 'lines',
          name: 'Moving Average',
          line: {
            color: 'rgb(255, 127, 14)',
            width: 2
          }
        }
      ],
      layout: {
        title: 'Energy Convergence During Training',
        xaxis: {
          title: 'Training Iteration'
        },
        yaxis: {
          title: 'Energy (Hartree)',
          hoverformat: '.4f'
        },
        showlegend: true,
        legend: {
          x: 0.7,
          y: 0.1
        },
        autosize: true
      }
    };
  };

  // Generate new data
  const generateNewData = () => {
    const newData = generateTrainingData();
    setData(createVisualization(newData));
  };

  // Initialize data on component mount
  useEffect(() => {
    generateNewData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        FermiNet Energy Convergence Visualization
      </div>
      <div className={styles.controlPanel}>
        <button onClick={generateNewData}>Generate New Data</button>
      </div>
      <Plot
        data={data.data}
        layout={data.layout}
        useResizeHandler={true}
        className={styles.plot}
      />
    </div>
  );
}
