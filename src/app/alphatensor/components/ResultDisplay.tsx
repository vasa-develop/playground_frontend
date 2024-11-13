'use client';

import React from 'react';
import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';

interface ResultDisplayProps {
  result: number[][];
  algorithmUsed: string;
  operationsCount: number;
  modularArithmetic: boolean;
}

export function ResultDisplay({
  result,
  algorithmUsed,
  operationsCount,
  modularArithmetic,
}: ResultDisplayProps) {
  const gridColumns = result[0]?.length || 1;

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" w="100%">
      <Flex direction="column" gap={4}>
        <Text fontSize="xl" fontWeight="bold">
          Result
        </Text>

        <Box>
          <Text fontWeight="semibold" mb={2}>
            Algorithm Details:
          </Text>
          <Badge colorScheme="blue" mr={2}>
            {algorithmUsed}
          </Badge>
          <Badge colorScheme="green" mr={2}>
            Operations: {operationsCount}
          </Badge>
          <Badge colorScheme={modularArithmetic ? 'purple' : 'orange'}>
            {modularArithmetic ? 'Modular (F2)' : 'Standard'}
          </Badge>
        </Box>

        <Box bg="gray.50" p={4} borderRadius="md">
          <SimpleGrid
            templateColumns={`repeat(${gridColumns}, 1fr)`}
            gap={2}
          >
            {result.map((row, i) =>
              row.map((value, j) => (
                <Box
                  key={`${i}-${j}`}
                  p={2}
                  textAlign="center"
                  borderWidth="1px"
                  borderRadius="md"
                >
                  {value}
                </Box>
              ))
            )}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
}
