'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import PlotComponent to avoid SSR issues and name conflicts
const PlotComponent = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function WavefunctionVisualization() {
  const [orbitalType, setOrbitalType] = useState('1s');
  const [plotData, setPlotData] = useState(null);

  // Generate wavefunction data for different orbital types
  const generateWavefunctionData = (orbitalType, points = 100) => {
    const data = [];
    const x = Array.from({length: points}, (_, i) => (i - points/2) * 0.1);
    const y = Array.from({length: points}, (_, i) => (i - points/2) * 0.1);

    for (let i = 0; i < points; i++) {
      for (let j = 0; j < points; j++) {
        const r = Math.sqrt(x[i]**2 + y[j]**2);
        let amplitude = 0;
        let phase = 0;

        switch(orbitalType) {
          case '1s':
            amplitude = Math.exp(-r);
            phase = 0;
            break;
          case '2s':
            amplitude = (2 - r) * Math.exp(-r/2);
            phase = Math.PI * (r > 2 ? 1 : 0);
            break;
          case '2p':
            amplitude = r * Math.exp(-r/2);
            phase = Math.atan2(y[j], x[i]);
            break;
        }

        data.push({
          x: x[i],
          y: y[j],
          amplitude: amplitude,
          phase: phase
        });
      }
    }
    return { data, x, y };
  };

  // Create visualization data and layout
  const createVisualization = (orbitalType) => {
    const { data, x, y } = generateWavefunctionData(orbitalType);

    // Prepare data for heatmaps
    const z_amplitude = Array(x.length).fill().map(() => Array(y.length).fill(0));
    const z_phase = Array(x.length).fill().map(() => Array(y.length).fill(0));

    let idx = 0;
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        z_amplitude[i][j] = data[idx].amplitude;
        z_phase[i][j] = data[idx].phase;
        idx++;
      }
    }

    return {
      amplitude: {
        data: [{
          z: z_amplitude,
          x: x,
          y: y,
          type: 'heatmap',
          colorscale: 'Viridis',
          colorbar: {
            title: 'Amplitude'
          }
        }],
        layout: {
          title: 'Wavefunction Amplitude',
          xaxis: { title: 'x (Bohr)' },
          yaxis: { title: 'y (Bohr)' },
          margin: { t: 50 },
          autosize: true
        }
      },
      phase: {
        data: [{
          z: z_phase,
          x: x,
          y: y,
          type: 'heatmap',
          colorscale: 'HSV',
          colorbar: {
            title: 'Phase',
            tickmode: 'array',
            ticktext: ['-π', '0', 'π'],
            tickvals: [-Math.PI, 0, Math.PI]
          }
        }],
        layout: {
          title: 'Wavefunction Phase',
          xaxis: { title: 'x (Bohr)' },
          yaxis: { title: 'y (Bohr)' },
          margin: { t: 50 },
          autosize: true
        }
      }
    };
  };

  // Update visualization when orbital type changes
  const handleOrbitalChange = (event) => {
    const newType = event.target.value;
    setOrbitalType(newType);
    setPlotData(createVisualization(newType));
  };

  // Initialize visualization
  useEffect(() => {
    setPlotData(createVisualization(orbitalType));
  }, []);

  if (!plotData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        FermiNet Wavefunction Visualization
      </div>
      <div className={styles.controlPanel}>
        <select value={orbitalType} onChange={handleOrbitalChange}>
          <option value="1s">1s Orbital</option>
          <option value="2s">2s Orbital</option>
          <option value="2p">2p Orbital</option>
        </select>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.plot}>
          <PlotComponent
            data={plotData.amplitude.data}
            layout={plotData.amplitude.layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className={styles.plot}>
          <PlotComponent
            data={plotData.phase.data}
            layout={plotData.phase.layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
