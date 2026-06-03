import { useState } from 'react'
import { Bell, X } from 'lucide-react'

interface NotificationPromptProps {
  onEnable: () => Promise<boolean>
  onDismiss: () => void
  onNeverAsk: () => void
}

export function NotificationPrompt({ onEnable, onDismiss, onNeverAsk }: NotificationPromptProps) {
  const [enabling, setEnabling] = useState(false)

  const handleEnable = async () => {
    setEnabling(true)
    await onEnable()
    setEnabling(false)
    onDismiss()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-2 flex items-start justify-between">
          <Bell className="h-8 w-8 text-indigo-500" />
          <button onClick={onDismiss} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-2 text-lg font-semibold text-gray-900">Enable Notifications?</h2>
        <p className="mt-1 text-sm text-gray-500">
          StudyFlow will send you notifications for:
        </p>

        <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
          <li className="flex items-center gap-2">• Timer session complete</li>
          <li className="flex items-center gap-2">• Break reminders</li>
          <li className="flex items-center gap-2">• Daily study reminders</li>
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleEnable}
            disabled={enabling}
            className="w-full rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {enabling ? 'Requesting...' : 'Enable Notifications'}
          </button>
          <button
            onClick={onDismiss}
            className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Not now
          </button>
          <button
            onClick={onNeverAsk}
            className="text-center text-xs text-gray-400 hover:text-gray-600"
          >
            Don't ask again
          </button>
        </div>
      </div>
    </div>
  )
}
