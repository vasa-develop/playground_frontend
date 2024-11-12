'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function FermiNetIndex() {
  return (
    <div className={styles.container}>
      <h1>FermiNet Visualizations</h1>
      <div className={styles.grid}>
        <Link href="/ferminet/electron_density" className={styles.card}>
          <h2>Electron Density</h2>
          <p>Visualize electron density distributions in quantum systems</p>
        </Link>
        <Link href="/ferminet/energy" className={styles.card}>
          <h2>Energy</h2>
          <p>Energy convergence and optimization visualization</p>
        </Link>
        <Link href="/ferminet/wavefunction" className={styles.card}>
          <h2>Wavefunction</h2>
          <p>Quantum wavefunction representation and analysis</p>
        </Link>
        <Link href="/ferminet/mcmc_sampling" className={styles.card}>
          <h2>MCMC Sampling</h2>
          <p>Monte Carlo sampling visualization for quantum states</p>
        </Link>
        <Link href="/ferminet/observable_quantities" className={styles.card}>
          <h2>Observable Quantities</h2>
          <p>Visualization of quantum mechanical observables</p>
        </Link>
      </div>
    </div>
  );
}
