'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button,
  useToast,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { MatrixInput } from './components/MatrixInput';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { AlgorithmVisualization } from './components/AlgorithmVisualization';
import { multiplyMatrices, getSupportedDimensions, type MatrixDimensions } from './api/matrix';

export default function AlphaTensorPage() {
  const toast = useToast();
  const [matrixA, setMatrixA] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[0, 0], [0, 0]]);
  const [useModular, setUseModular] = useState(false);
  const [supportedDimensions, setSupportedDimensions] = useState<MatrixDimensions[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    result: number[][];
    algorithm_used: string;
    operations_count: number;
  } | null>(null);

  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        const dimensions = await getSupportedDimensions();
        setSupportedDimensions(dimensions);
      } catch (error) {
        toast({
          title: 'Error fetching supported dimensions',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchDimensions();
  }, [toast]);

  const handleCalculate = async () => {
    if (!matrixA || !matrixB) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await multiplyMatrices({
        matrix_a: matrixA,
        matrix_b: matrixB,
        use_modular: useModular,
      });

      setResult({
        result: response.result,
        algorithm_used: response.algorithm_used,
        operations_count: response.operations_count,
      });
    } catch (error) {
      toast({
        title: 'Error calculating result',
        description: 'Please check your input and try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            AlphaTensor Matrix Multiplication Demo
          </Heading>
          <Text color="gray.600">
            Explore efficient matrix multiplication algorithms discovered by AlphaTensor
          </Text>
        </Box>

        <Button
          colorScheme="teal"
          variant="outline"
          onClick={() => setShowVisualization(!showVisualization)}
        >
          {showVisualization ? 'Hide Algorithm Discovery Process' : 'Show Algorithm Discovery Process'}
        </Button>

        {showVisualization && (
          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Algorithm Discovery Visualization
            </Heading>
            <AlgorithmVisualization />
          </Box>
        )}

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Interactive Matrix Multiplication
          </Heading>
          <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
            <MatrixInput
              label="Matrix A"
              matrix={matrixA}
              onChange={setMatrixA}
              supportedDimensions={supportedDimensions}
            />
            <MatrixInput
              label="Matrix B"
              matrix={matrixB}
              onChange={setMatrixB}
              supportedDimensions={supportedDimensions}
            />
          </Flex>
        </Box>

        <AlgorithmSelector
          onModularChange={setUseModular}
          useModular={useModular}
        />

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleCalculate}
          isDisabled={!matrixA || !matrixB}
          isLoading={isLoading}
        >
          Calculate
        </Button>

        {result && (
          <ResultDisplay
            result={result.result}
            algorithmUsed={result.algorithm_used}
            operationsCount={result.operations_count}
            modularArithmetic={useModular}
          />
        )}
      </VStack>
    </Container>
  );
}
