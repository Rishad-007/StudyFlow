import { Download } from 'lucide-react'
import { usePWAInstall } from '@/hooks/usePWAInstall'

export function PWAInstallButton() {
  const { canInstall, isInstalled, dismissed, install } = usePWAInstall()

  if (!canInstall || isInstalled || dismissed) return null

  return (
    <>
      {/* Mobile: floating bottom-center button */}
      <button
        onClick={install}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-lg shadow-gray-200/50 hover:bg-gray-50 active:scale-95 sm:hidden"
      >
        <Download className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-700">Get App</span>
      </button>

      {/* Desktop: inline minimal button */}
      <button
        onClick={install}
        className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 sm:inline-flex"
        title="Install app"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install</span>
      </button>
    </>
  )
}
