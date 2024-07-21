'use client'

import React, { useEffect, useRef, useState } from 'react';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';

import { ElementIndex, StructureElement, StructureProperties } from 'molstar/lib/mol-model/structure';
import { StateSelection } from 'molstar/lib/mol-state';
import { PluginStateObject as PSO } from 'molstar/lib/mol-plugin-state/objects';
import { Vec3 } from 'molstar/lib/mol-math/linear-algebra';
import { Sphere3D } from 'molstar/lib/mol-math/geometry';
import { Loci } from 'molstar/lib/mol-model/loci';
import { ColorNames } from 'molstar/lib/mol-util/color/names';
// import { ElementIndex } from 'molstar/lib/mol-model/structure/structure/element';

import 'molstar/build/viewer/molstar.css';
import { SequenceViewerWithControls } from './SequenceViewerWithControls';
import { OrderedSet } from 'molstar/lib/mol-data/int';
import { UnitIndex } from 'molstar/lib/mol-model/structure/structure/element/util';

interface MoleculeViewerProps {
  pdbStr: string;
  sequence: string;
}

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ pdbStr, sequence }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plugin = useRef<PluginContext | null>(null);
  const [clickedResidue, setClickedResidue] = useState<number | null>(null);
  const [hoveredResidue, setHoveredResidue] = useState<number | null>(null);

  useEffect(() => {
    if (!parentRef.current || !canvasRef.current) return;

    const initViewer = async () => {
      plugin.current = new PluginContext(DefaultPluginSpec());
      await plugin.current.init();

      if (canvasRef.current && parentRef.current) {
        plugin.current.initViewer(canvasRef.current, parentRef.current);

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

        // const data = await plugin.current.builders.data.rawData({
        //   data: pdbStr,
        //   label: undefined,
        // });
        const url = 'https://files.rcsb.org/view/1CRN.pdb';
        const data = await plugin.current.builders.data.download({ url }, { state: { isGhost: true } });
        const trajectory = await plugin.current.builders.structure.parseTrajectory(data, 'pdb');
        await plugin.current.builders.structure.hierarchy.applyPreset(trajectory, 'default');
      }

      // Add hover event listener
      plugin.current.behaviors.interaction.hover.subscribe((event) => {
        if (event.current.loci.kind === 'element-loci') {
          const loci = event.current.loci as StructureElement.Loci;
          const elements = loci.elements[0];
          const unit = elements.unit;
          const element = OrderedSet.getAt(elements.indices, 0);
          
          // Get the structure from the plugin's state
          const structureCell = plugin.current!.state.data.select(StateSelection.Generators.rootsOfType(PSO.Molecule.Structure))[0];
          const structure = structureCell?.obj?.data;
          if (!structure) return;

          const location = StructureElement.Location.create(structure, unit, element as unknown as ElementIndex);
          const seqId = StructureProperties.residue.label_seq_id(location);
          setHoveredResidue(seqId - 1);
        } else {
          setHoveredResidue(null);
        }
      });
    };

    initViewer();

    return () => {
      plugin.current?.dispose();
    };
  }, [pdbStr]);

  const focusOnResidue = (residueIndex: number) => {
    if (!plugin.current) return;

    // Select the first structure in the state
    const structureCell = plugin.current.state.data.select(StateSelection.Generators.rootsOfType(PSO.Molecule.Structure))[0];
    if (!structureCell) return;

    const structure = structureCell.obj?.data;
    if (!structure) return;

    const location = StructureElement.Location.create(structure);
    const position = Vec3();

    let found = false;

    structure.units.forEach(unit => {
      const elements = unit.elements;
      for (let i = 0; i < elements.length; i++) {
        location.unit = unit;
        location.element = elements[i];

        const seqId = StructureProperties.residue.label_seq_id(location);
        if (seqId === residueIndex + 1) {
          StructureElement.Location.position(position, location);
          found = true;
          break;
        }
      }
      if (found) return false; // Stop iterating over units
      return true; // Continue to next unit
    });

    if (found) {
      const sphere = Sphere3D.create(position, 5); // radius of 5 Angstroms, adjust as needed
      // Focus on the residue
      plugin.current.managers.camera.focusSphere(sphere, { durationMs: 250 });
    }
  };

  const handleAminoAcidClick = (index: number) => {
    setClickedResidue(index);
    focusOnResidue(index);
  };

  const highlightResidue = (residueIndex: number | null) => {
    if (!plugin.current) return;

    const structureCell = plugin.current.state.data.select(StateSelection.Generators.rootsOfType(PSO.Molecule.Structure))[0];
    if (!structureCell) return;

    const structure = structureCell.obj?.data;
    if (!structure) return;

    if (residueIndex === null && clickedResidue === null) {
      // Clear highlight
      plugin.current.managers.interactivity.lociHighlights.clearHighlights();
      plugin.current.managers.structure.focus.clear();
      return;
    }

    const location = StructureElement.Location.create(structure);
    const elements: Array<StructureElement.Loci['elements'][0]> = [];

    structure.units.forEach(unit => {
      const unitElements = unit.elements;
      for (let i = 0; i < unitElements.length; i++) {
        location.unit = unit;
        location.element = unitElements[i];

        const seqId = StructureProperties.residue.label_seq_id(location);
        if (seqId === (residueIndex !== null ? residueIndex + 1 : clickedResidue! + 1)) {
          elements.push({ 
            unit, 
            indices: OrderedSet.ofSingleton(unitElements[i] as unknown as UnitIndex)
          });
        }
      }
    });

    const loci = StructureElement.Loci(structure, elements);
    // Highlight the residue
    plugin.current.managers.interactivity.lociHighlights.highlightOnly({ loci });
    // Show atomic details for the residue
    plugin.current.managers.structure.focus.setFromLoci(loci);
  };

  const handleAminoAcidHover = (index: number | null) => {
    if (index !== null) {
      setClickedResidue(null); // Clear the clicked residue when hovering over a new character
    }
    highlightResidue(index);
  };

  return (
    <div>
      <SequenceViewerWithControls 
        sequence={sequence} 
        onAminoAcidClick={handleAminoAcidClick} 
        onAminoAcidHover={handleAminoAcidHover}
        clickedResidue={clickedResidue}
        hoveredResidue={hoveredResidue}
      />
      <div ref={parentRef} style={{ position: 'relative', width: '100%', height: '400px' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default MoleculeViewer;