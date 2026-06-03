import { BookOpen, X } from 'lucide-react'

interface PWAInstallPromptProps {
  onInstall: () => void
  onDismiss: () => void
  onNeverAsk: () => void
}

export function PWAInstallPrompt({ onInstall, onDismiss, onNeverAsk }: PWAInstallPromptProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-4 shadow-lg md:bottom-auto md:right-4 md:top-4 md:w-80 md:rounded-xl md:border md:shadow-xl">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 h-8 w-8 shrink-0 text-indigo-500" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Install StudyFlow</p>
          <p className="text-xs text-gray-500">
            Install for the best experience — use it offline, track anywhere.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onInstall}
              className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Install
            </button>
            <button
              onClick={onDismiss}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Not now
            </button>
            <button
              onClick={onNeverAsk}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600"
            >
              Don't show again
            </button>
          </div>
        </div>
        <button onClick={onDismiss} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
