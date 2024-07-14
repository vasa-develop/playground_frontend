'use client'

import { useEffect, useRef } from 'react';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';
import 'molstar/build/viewer/molstar.css';

interface MoleculeViewerProps {
  pdbUrl: string;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ pdbUrl }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plugin = useRef<PluginContext | null>(null);

  useEffect(() => {
    if (!parentRef.current || !canvasRef.current) return;

    const initViewer = async () => {
      plugin.current = new PluginContext(DefaultPluginSpec());
      await plugin.current.init();

      // Check if canvasRef.current is not null before initializing the viewer
      if (canvasRef.current && parentRef.current) {
        plugin.current.initViewer(canvasRef.current, parentRef.current);

        // Remove axes and set background transparent
        plugin.current.canvas3d?.setProps({
          camera: {
            helper: {
              axes: {
                name: 'off',
                params: {},
              },
            },
          },
        });

        // Load the structure
        const data = await plugin.current.builders.data.download({ url: pdbUrl });
        const trajectory = await plugin.current.builders.structure.parseTrajectory(data, 'pdb');
        await plugin.current.builders.structure.hierarchy.applyPreset(trajectory, 'default');
      }
    };

    initViewer();

    return () => {
      plugin.current?.dispose();
    };
  }, [pdbUrl]);

  return (
    <div ref={parentRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
      />
    </div>
  );
};

export default MoleculeViewer;