import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, VStack } from '@chakra-ui/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <VStack width='100%' paddingX={{ base: '2.5vw', md: "5vw", lg: "10vw" }}>
        <Component {...pageProps} />
      </VStack>
    </ChakraProvider>
  );
}
