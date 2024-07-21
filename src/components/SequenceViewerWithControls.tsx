import React, { useState } from 'react';
import 'molstar/build/viewer/molstar.css';

interface SequenceViewerProps {
    sequence: string;
    onAminoAcidClick: (index: number) => void;
    onAminoAcidHover: (index: number | null) => void;
    clickedResidue: number | null;
    hoveredResidue: number | null;
}

export const SequenceViewerWithControls: React.FC<SequenceViewerProps> = ({ sequence, onAminoAcidClick, onAminoAcidHover, clickedResidue, hoveredResidue }) => {
    const charsPerLine = 60; // Adjust this to match your desired line length
    const numberingInterval = 10; // Show a number every 10 positions
  
    // Split the sequence into lines
    const lines = sequence.match(new RegExp(`.{1,${charsPerLine}}`, 'g')) || [];
  
    const renderNumbering = (lineIndex: number) => {
      const numbers = [];
      const startPosition = lineIndex * charsPerLine;
      const endPosition = Math.min((lineIndex + 1) * charsPerLine, sequence.length);
  
      for (let position = startPosition; position <= endPosition; position += numberingInterval) {
        if (position <= sequence.length && position != startPosition) {
          numbers.push(
            <span key={position} style={{ 
              position: 'absolute', 
              left: `${
                (((position - 1) % charsPerLine) * 11) + (Math.floor((position - 1 - startPosition) / 10) * 55) + 10/6 * (Math.floor((position - 1 - startPosition) / 10))
              }px`, 
              fontSize: '10px', 
              color: '#888',
              width: '30px',
              textAlign: 'center'
            }}>
              {position}
            </span>
          );
        }
      }
      return numbers;
    };
  
    return (
      <div style={{ 
        padding: '10px', 
        fontFamily: 'monospace', 
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} style={{ marginBottom: '5px', position: 'relative' }}>
            <div style={{ height: '15px', marginBottom: '2px', position: 'relative' }}>
              {renderNumbering(lineIndex)}
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              {line.split('').map((aminoAcid, charIndex) => {
                const index = lineIndex * charsPerLine + charIndex;
                return (
                  <React.Fragment key={index}>
                    {charIndex !== 0 && charIndex % 10 === 0 && <span style={{ padding: '0 5px' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                    <span
                      key={index}
                      onClick={() => onAminoAcidClick(index)}
                      onMouseEnter={() => onAminoAcidHover(index)}
                      onMouseLeave={() => onAminoAcidHover(null)}
                      style={{ 
                        cursor: 'pointer', 
                        padding: '2px', 
                        backgroundColor: hoveredResidue === index ? '#B280FF' : (index % 2 === 0 ? '#f0f0f0' : 'white'),
                        transition: 'background-color 0.3s'
                      }}
                    >
                      {aminoAcid}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };