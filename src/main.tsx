import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

function Root() {
  const initialize = useAuthStore((s) => s.initialize)
  const initialized = useAuthStore((s) => s.initialized)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) return null

  return (
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
