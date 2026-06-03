import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { useOfflineSync } from '@/hooks/useOfflineSync'
import { PWAInstallPrompt } from '@/components/shared/PWAInstallPrompt'
import { OfflineBanner } from '@/components/shared/OfflineBanner'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

function Root() {
  const initialize = useAuthStore((s) => s.initialize)
  const initialized = useAuthStore((s) => s.initialized)
  const { canInstall, isInstalled, dismissed, install, dismiss } = usePWAInstall()
  const { isOnline, pendingChanges } = useOfflineSync()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) return null

  return (
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <OfflineBanner isOnline={isOnline} pendingChanges={pendingChanges} onDismiss={() => {}} />
          <App />
          <Toaster position="top-right" />
          {canInstall && !dismissed && !isInstalled && (
            <PWAInstallPrompt
              onInstall={install}
              onDismiss={dismiss}
              onNeverAsk={() => {
                localStorage.setItem('studyflow-pwa-dismissed', 'true')
                dismiss()
              }}
            />
          )}
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
