import { WifiOff, X } from 'lucide-react'

interface OfflineBannerProps {
  isOnline: boolean
  pendingChanges: number
  onDismiss: () => void
}

export function OfflineBanner({ isOnline, pendingChanges, onDismiss }: OfflineBannerProps) {
  if (isOnline) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-amber-500 px-4 py-2 text-sm text-white">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>
          You're offline{pendingChanges > 0 ? `. ${pendingChanges} change${pendingChanges > 1 ? 's' : ''} pending sync.` : '. Changes will sync when you reconnect.'}
        </span>
      </div>
      <button onClick={onDismiss} className="rounded p-0.5 hover:bg-amber-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
