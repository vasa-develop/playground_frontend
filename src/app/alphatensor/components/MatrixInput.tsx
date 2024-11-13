'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Text,
  Input,
  Grid,
  GridItem,
  Select,
  type SelectProps,
} from '@chakra-ui/react';
import { type MatrixDimensions } from '../api/matrix';

interface MatrixInputProps {
  label: string;
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
  supportedDimensions?: MatrixDimensions[];
}

export function MatrixInput({
  label,
  matrix: externalMatrix,
  onChange,
  supportedDimensions = []
}: MatrixInputProps) {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [internalMatrix, setInternalMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const newMatrix = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
    setInternalMatrix(newMatrix);
    onChange(newMatrix);
  }, [rows, cols]);

  useEffect(() => {
    if (externalMatrix && externalMatrix.length > 0) {
      setInternalMatrix(externalMatrix);
      setRows(externalMatrix.length);
      setCols(externalMatrix[0]?.length || 0);
    }
  }, [externalMatrix]);

  const handleValueChange = (rowIndex: number, colIndex: number, value: string) => {
    const newMatrix = internalMatrix.map((row, i) =>
      i === rowIndex ? row.map((cell, j) => (j === colIndex ? Number(value) : cell)) : row
    );
    setInternalMatrix(newMatrix);
    onChange(newMatrix);
  };

  const handleDimensionChange = (dimension: 'rows' | 'cols', value: string) => {
    const numValue = parseInt(value);
    const currentMatrix = [...internalMatrix];

    if (dimension === 'rows') {
      setRows(numValue);
      if (numValue > currentMatrix.length) {
        while (currentMatrix.length < numValue) {
          currentMatrix.push(Array(cols).fill(0));
        }
      } else {
        currentMatrix.splice(numValue);
      }
    } else {
      setCols(numValue);
      currentMatrix.forEach((row, i) => {
        if (numValue > row.length) {
          currentMatrix[i] = [...row, ...Array(numValue - row.length).fill(0)];
        } else {
          currentMatrix[i] = row.slice(0, numValue);
        }
      });
    }

    setInternalMatrix(currentMatrix);
    onChange(currentMatrix);
  };

  const getDimensionOptions = () => {
    const options = new Set<number>();
    if (label === 'Matrix A') {
      supportedDimensions?.forEach(dim => {
        options.add(dim.rows_a);
        options.add(dim.cols_a);
      });
    } else {
      supportedDimensions?.forEach(dim => {
        options.add(dim.rows_b);
        options.add(dim.cols_b);
      });
    }
    return Array.from(options).sort((a, b) => a - b);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" flex="1">
      <Stack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          {label}
        </Text>

        <Stack direction="row" spacing={4}>
          <Box>
            <Text mb={2}>Rows</Text>
            <Select
              value={rows}
              onChange={(e) => handleDimensionChange('rows', e.target.value)}
              data-testid="rows-select"
            >
              {getDimensionOptions().map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text mb={2}>Columns</Text>
            <Select
              value={cols}
              onChange={(e) => handleDimensionChange('cols', e.target.value)}
              data-testid="cols-select"
            >
              {getDimensionOptions().map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
        </Stack>

        <Box overflowX="auto">
          <Grid
            templateColumns={`repeat(${cols}, 1fr)`}
            gap={2}
            p={2}
            bg="gray.50"
            borderRadius="md"
          >
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) =>
                Array(cols)
                  .fill(0)
                  .map((_, colIndex) => (
                    <GridItem key={`${rowIndex}-${colIndex}`}>
                      <Input
                        type="number"
                        value={internalMatrix[rowIndex]?.[colIndex] || 0}
                        onChange={(e) =>
                          handleValueChange(rowIndex, colIndex, e.target.value)
                        }
                        size="sm"
                      />
                    </GridItem>
                  ))
              )}
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
