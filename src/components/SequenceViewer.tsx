import React from 'react';
import 'molstar/build/viewer/molstar.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SequenceViewer: React.FC<{sequence: string;}> = ({ sequence }) => {    
    const charsPerLine = 90; // Adjust this to match your desired line length
    const numberingInterval = 10; // Show a number every 10 positions

    const PROTEIN_CODING_SEQUENCE_INDICES = [
        {
            "start": 0, // Adjusted to 0-based index
            "end": 612
        }
    ];
  
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
  
    const isProteinCoding = (index: number) => {
      return PROTEIN_CODING_SEQUENCE_INDICES.some(range => index >= range.start && index <= range.end);
    };
  
    return (
      <TooltipProvider>
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
                  const highlight = isProteinCoding(index);
                  return (
                    <React.Fragment key={index}>
                      {charIndex !== 0 && charIndex % 10 === 0 && <span style={{ padding: '0 5px' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                      {highlight ? (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <span
                              key={index}
                              style={{ 
                                padding: '2px',
                                transition: 'background-color 0.3s',
                                backgroundColor: 'yellow'
                              }}
                            >
                              {aminoAcid}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Protein coding sequence</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span
                          key={index}
                          style={{ 
                            padding: '2px',
                            transition: 'background-color 0.3s',
                            backgroundColor: 'transparent'
                          }}
                        >
                          {aminoAcid}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>
    );
  };