'use client';

import React from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/theme-utils';
import { ReactNode } from 'react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Select: {
      baseStyle: {},
      defaultProps: {
        size: 'md',
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
