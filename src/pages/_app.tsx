import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
        <DndProvider backend={HTML5Backend}>
          <Component {...pageProps} />
        </DndProvider>
    </ChakraProvider>  
  )
}

export default MyApp
