'use client';

import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Grid,
  Button,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface Matrix {
  rows: number;
  cols: number;
  values: number[][];
}

interface MatrixInputProps {
  label: string;
  onMatrixChange: (matrix: Matrix | null) => void;
  matrix: Matrix | null;
}

export function MatrixInput({ label, onMatrixChange, matrix }: MatrixInputProps) {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [values, setValues] = useState<number[][]>([]);

  useEffect(() => {
    // Initialize matrix with zeros
    const newValues = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
    setValues(newValues);
    onMatrixChange({ rows, cols, values: newValues });
  }, [rows, cols]);

  const handleValueChange = (rowIndex: number, colIndex: number, value: string) => {
    const newValues = [...values];
    newValues[rowIndex][colIndex] = parseFloat(value) || 0;
    setValues(newValues);
    onMatrixChange({ rows, cols, values: newValues });
  };

  const handleDimensionChange = (dimension: 'rows' | 'cols', value: number) => {
    const newValue = Math.max(1, Math.min(5, value));
    if (dimension === 'rows') {
      setRows(newValue);
    } else {
      setCols(newValue);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" flex="1">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          {label}
        </Text>

        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Rows (1-5)</FormLabel>
            <NumberInput
              min={1}
              max={5}
              value={rows}
              onChange={(_, value) => handleDimensionChange('rows', value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Columns (1-5)</FormLabel>
            <NumberInput
              min={1}
              max={5}
              value={cols}
              onChange={(_, value) => handleDimensionChange('cols', value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>

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
                    <NumberInput
                      key={`${rowIndex}-${colIndex}`}
                      value={values[rowIndex]?.[colIndex] || 0}
                      onChange={(valueString) =>
                        handleValueChange(rowIndex, colIndex, valueString)
                      }
                      size="sm"
                    >
                      <NumberInputField />
                    </NumberInput>
                  ))
              )}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
}
