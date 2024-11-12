'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Dynamically import Plot component to avoid SSR issues
const QuantityPlot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function ObservableQuantitiesVisualization() {
  const [observableType, setObservableType] = useState('dipole');
  const [fieldStrength, setFieldStrength] = useState(100);
  const [gridSize, setGridSize] = useState(20);
  const [plotData, setPlotData] = useState(null);

  // Generate grid points
  const generateGrid = useCallback((size) => {
    const points = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        points.push({
          x: (i - size/2) * (4/size),
          y: (j - size/2) * (4/size)
        });
      }
    }
    return points;
  }, []);

  // Generate vector field data
  const generateVectorField = useCallback((type, points, fieldStrength) => {
    const scale = fieldStrength / 100;
    return points.map(p => {
      const r = Math.sqrt(p.x*p.x + p.y*p.y);
      let u, v, density;

      switch(type) {
        case 'dipole':
          // Dipole field
          const r3 = Math.pow(r + 0.1, 3);
          u = scale * (3 * p.x * p.y / r3);
          v = scale * (2 * p.y*p.y / r3 - 1/r);
          density = 1 / (r + 0.1);
          break;
        case 'spin':
          // Spin density field
          const theta = Math.atan2(p.y, p.x);
          u = scale * Math.cos(theta) * Math.exp(-r);
          v = scale * Math.sin(theta) * Math.exp(-r);
          density = Math.exp(-r);
          break;
        case 'charge':
          // Charge density field
          u = scale * p.x * Math.exp(-r);
          v = scale * p.y * Math.exp(-r);
          density = Math.exp(-2*r);
          break;
        default:
          u = v = density = 0;
      }

      return { x: p.x, y: p.y, u, v, density };
    });
  }, []);

  // Update visualization data
  const updateVisualization = useCallback(() => {
    const points = generateGrid(gridSize);
    const fieldData = generateVectorField(observableType, points, fieldStrength);

    // Prepare vector field plot data
    const x = fieldData.map(p => p.x);
    const y = fieldData.map(p => p.y);
    const u = fieldData.map(p => p.u);
    const v = fieldData.map(p => p.v);

    const vectorFieldTrace = {
      type: 'cone',
      x,
      y,
      u,
      v,
      w: Array(x.length).fill(0),
      colorscale: 'Viridis',
      sizemode: 'absolute',
      sizeref: 0.5
    };

    const vectorFieldLayout = {
      title: `${observableType.charAt(0).toUpperCase() + observableType.slice(1)} Vector Field`,
      scene: {
        camera: {
          eye: {x: 0, y: 0, z: 2}
        },
        aspectmode: 'cube'
      },
      margin: {t: 50},
      autosize: true
    };

    // Prepare density plot data
    const densityTrace = {
      type: 'contour',
      x: Array.from(new Set(x)),
      y: Array.from(new Set(y)),
      z: Array(gridSize).fill().map(() => Array(gridSize).fill(0)),
      colorscale: 'Viridis',
      contours: {
        coloring: 'heatmap'
      }
    };

    // Fill density data
    let idx = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        densityTrace.z[i][j] = fieldData[idx].density;
        idx++;
      }
    }

    const densityLayout = {
      title: `${observableType.charAt(0).toUpperCase() + observableType.slice(1)} Density`,
      xaxis: {title: 'x (Bohr)'},
      yaxis: {title: 'y (Bohr)'},
      margin: {t: 50},
      autosize: true
    };

    setPlotData({
      vectorField: {
        data: [vectorFieldTrace],
        layout: vectorFieldLayout
      },
      density: {
        data: [densityTrace],
        layout: densityLayout
      }
    });
  }, [observableType, fieldStrength, gridSize, generateGrid, generateVectorField]);

  // Reset visualization
  const resetVisualization = useCallback(() => {
    setFieldStrength(100);
    setGridSize(20);
    setObservableType('dipole');
  }, []);

  // Update visualization when parameters change
  useEffect(() => {
    updateVisualization();
  }, [updateVisualization]);

  if (!plotData) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        FermiNet Observable Quantities Visualization
      </div>
      <div className={styles.controlPanel}>
        <select
          value={observableType}
          onChange={(e) => setObservableType(e.target.value)}
        >
          <option value="dipole">Dipole Moment</option>
          <option value="spin">Spin Density</option>
          <option value="charge">Charge Density</option>
        </select>
        <div className={styles.sliderContainer}>
          <label htmlFor="fieldStrength">
            Field Strength: {(fieldStrength / 100).toFixed(1)}
          </label>
          <input
            type="range"
            id="fieldStrength"
            min="0"
            max="200"
            value={fieldStrength}
            onChange={(e) => setFieldStrength(Number(e.target.value))}
          />
        </div>
        <div className={styles.sliderContainer}>
          <label htmlFor="gridSize">
            Grid Resolution: {gridSize}
          </label>
          <input
            type="range"
            id="gridSize"
            min="10"
            max="40"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </div>
        <button onClick={resetVisualization}>Reset View</button>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.plot}>
          <QuantityPlot
            data={plotData.vectorField.data}
            layout={plotData.vectorField.layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className={styles.plot}>
          <QuantityPlot
            data={plotData.density.data}
            layout={plotData.density.layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
