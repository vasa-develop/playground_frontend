'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react';
import { MatrixInput } from './components/MatrixInput';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ResultDisplay } from './components/ResultDisplay';

interface Matrix {
  rows: number;
  cols: number;
  values: number[][];
}

export default function AlphaTensorPage() {
  const [matrixA, setMatrixA] = useState<Matrix | null>(null);
  const [matrixB, setMatrixB] = useState<Matrix | null>(null);
  const [useModular, setUseModular] = useState(false);
  const [result, setResult] = useState<{
    matrix: number[][];
    algorithm: string;
    operations: number;
  } | null>(null);

  const handleCalculate = async () => {
    if (!matrixA || !matrixB) {
      return;
    }

    // TODO: Add API call to backend here
    // For now, just show a placeholder result
    setResult({
      matrix: [[1, 0], [0, 1]],
      algorithm: 'Standard',
      operations: 8,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction="column" gap={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            AlphaTensor Matrix Multiplication Demo
          </Heading>
          <Text color="gray.600">
            Explore efficient matrix multiplication algorithms discovered by AlphaTensor
          </Text>
        </Box>

        <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
          <MatrixInput
            label="Matrix A"
            onMatrixChange={setMatrixA}
            matrix={matrixA}
          />
          <MatrixInput
            label="Matrix B"
            onMatrixChange={setMatrixB}
            matrix={matrixB}
          />
        </Flex>

        <AlgorithmSelector
          onModularChange={setUseModular}
          useModular={useModular}
        />

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleCalculate}
          isDisabled={!matrixA || !matrixB}
        >
          Calculate
        </Button>

        {result && (
          <ResultDisplay
            result={result.matrix}
            algorithmUsed={result.algorithm}
            operationsCount={result.operations}
            modularArithmetic={useModular}
          />
        )}
      </Flex>
    </Container>
  );
}
