"use client";

import React from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/card";

export default function WaveNetDemo(): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>WaveNet Demo</h1>
        <p className={styles.description}>
          Experiment with WaveNet, a deep generative model for raw audio developed by DeepMind.
          Generate realistic-sounding human speech and explore different generation parameters.
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <Card className="p-6">
            <h2 className={styles.sectionTitle}>Audio Generation</h2>
            <p>Coming soon: Interactive audio generation controls and playback.</p>
          </Card>
        </section>
      </div>
    </div>
  );
}
