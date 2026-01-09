import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { AuthProvider } from "@/features/auth";
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
