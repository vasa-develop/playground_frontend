'use client'
// a normal page displyaing text: "evo playground"

import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { SAMPLE_PDB_STR } from '../constants';

const DynamicMoleculeViewer = dynamic(() => import('../../components/MoleculeViewer'), {
  ssr: false,
  loading: () => <p>Loading viewer...</p>
});


const EvoPlayground: NextPage = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>3D Protein Structure Viewer</title>
        <meta name="description" content="Visualize 3D protein structures using Molstar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center' }}>3D Protein Structure Viewer</h1>
        <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
          <DynamicMoleculeViewer pdbStr={SAMPLE_PDB_STR} />
        </div>
      </main>
    </div>
  );
};

export default EvoPlayground;