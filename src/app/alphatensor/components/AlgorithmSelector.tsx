'use client';

import React from 'react';
import {
  Box,
  Stack,
  Switch,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';

interface AlgorithmSelectorProps {
  onModularChange: (useModular: boolean) => void;
  useModular: boolean;
}

export function AlgorithmSelector({ onModularChange, useModular }: AlgorithmSelectorProps) {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
      <Stack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">
          Algorithm Settings
        </Text>

        <Stack direction="row" align="center" justify="space-between">
          <Tooltip label="Use modular arithmetic (operations in F2) instead of standard arithmetic">
            <Text>Use Modular Arithmetic</Text>
          </Tooltip>
          <Switch
            isChecked={useModular}
            onChange={(e) => onModularChange(e.target.checked)}
            colorScheme="blue"
          />
        </Stack>
      </Stack>
    </Box>
  );
}
