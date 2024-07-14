// a normal page displyaing text: "evo playground"

import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const MoleculeViewer = dynamic(() => import('../../components/MoleculeViewer'), { ssr: false });

const EvoPlayground: NextPage = () => {
  const pdbUrl = 'https://files.rcsb.org/download/1CRN.pdb';

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
          <MoleculeViewer pdbUrl={pdbUrl} />
        </div>
      </main>
    </div>
  );
};

export default EvoPlayground;