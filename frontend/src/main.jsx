import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import {ColorModeProvider } from "./components/ui/color-mode";
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { queryClient } from '../utils/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster }  from 'react-hot-toast';


const system = createSystem(defaultConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={system}>

      <ColorModeProvider>
      
        <QueryClientProvider client={queryClient}>

          <Toaster position='top-center'/>
          <App />
          
        </QueryClientProvider>
        
      </ColorModeProvider>

    </ChakraProvider>
  </StrictMode>,
)


