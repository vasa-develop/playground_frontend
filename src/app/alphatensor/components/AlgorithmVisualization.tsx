import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Progress,
  Grid,
  GridItem,
  useColorModeValue,
  Button,
  HStack,
} from '@chakra-ui/react';

interface Step {
  description: string;
  matrices: number[][][];
  operations: string[];
  efficiency: number;
}

const DEMO_STEPS: Step[] = [
  {
    description: "Initial Algorithm State",
    matrices: [
      [[1, 1], [1, 0]],
      [[1, 0], [0, 1]],
    ],
    operations: ["Standard matrix multiplication"],
    efficiency: 25,
  },
  {
    description: "Learning Optimal Patterns",
    matrices: [
      [[1, 1], [1, 0]],
      [[1, 0], [1, 1]],
    ],
    operations: ["Identifying efficient patterns", "Reducing operations"],
    efficiency: 50,
  },
  {
    description: "Optimization Phase",
    matrices: [
      [[1, 0], [1, 1]],
      [[1, 1], [0, 1]],
    ],
    operations: ["Optimizing operation count", "Refining patterns"],
    efficiency: 75,
  },
  {
    description: "Final Optimized Algorithm",
    matrices: [
      [[1, 0], [0, 1]],
      [[1, 1], [1, 0]],
    ],
    operations: ["Minimized operation count", "Optimal pattern discovered"],
    efficiency: 100,
  },
];

const MatrixDisplay: React.FC<{ matrix: number[][] }> = ({ matrix }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Grid
      templateColumns={`repeat(${matrix[0].length}, 1fr)`}
      gap={2}
      p={4}
      bg={bgColor}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
    >
      {matrix.map((row, i) =>
        row.map((value, j) => (
          <GridItem
            key={`${i}-${j}`}
            p={2}
            textAlign="center"
            fontWeight="bold"
            color={value === 1 ? 'green.500' : 'gray.500'}
          >
            {value}
          </GridItem>
        ))
      )}
    </Grid>
  );
};

export const AlgorithmVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= DEMO_STEPS.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const step = DEMO_STEPS[currentStep];

  return (
    <VStack spacing={6} w="full" p={4}>
      <Text fontSize="xl" fontWeight="bold">
        Algorithm Discovery Visualization
      </Text>

      <Progress
        value={(currentStep / (DEMO_STEPS.length - 1)) * 100}
        w="full"
        colorScheme="green"
        hasStripe
        isAnimated
      />

      <Text fontSize="lg" color="blue.500">
        Step {currentStep + 1}: {step.description}
      </Text>

      <HStack spacing={8} alignItems="flex-start">
        <VStack spacing={4}>
          <Text fontWeight="bold">Matrix A</Text>
          <MatrixDisplay matrix={step.matrices[0]} />
        </VStack>
        <VStack spacing={4}>
          <Text fontWeight="bold">Matrix B</Text>
          <MatrixDisplay matrix={step.matrices[1]} />
        </VStack>
      </HStack>

      <VStack spacing={2} alignItems="flex-start">
        <Text fontWeight="bold">Operations:</Text>
        {step.operations.map((op, index) => (
          <Text key={index} color="gray.600">
            • {op}
          </Text>
        ))}
      </VStack>

      <Text>
        Efficiency: {step.efficiency}%
      </Text>

      <HStack spacing={4}>
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          isDisabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          colorScheme={isPlaying ? 'red' : 'green'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(DEMO_STEPS.length - 1, prev + 1))}
          isDisabled={currentStep === DEMO_STEPS.length - 1}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  );
};

export default AlgorithmVisualization;
