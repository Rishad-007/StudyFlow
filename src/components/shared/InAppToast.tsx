import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface InAppToastProps {
  type: ToastType
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
}

const COLORS = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-indigo-500',
  warning: 'text-amber-500',
}

export function showInAppToast({ type, title, description, action }: InAppToastProps) {
  const Icon = ICONS[type]
  const duration = type === 'warning' ? 8000 : 5000

  toast.custom(
    (t) => (
      <div
        className={cn(
          'flex w-80 items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg',
          t.visible ? 'animate-in slide-in-from-right' : 'animate-out slide-out-to-right',
        )}
      >
        <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', COLORS[type])} />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          {action && (
            <button
              onClick={() => {
                action.onClick()
                toast.dismiss(t.id)
              }}
              className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    ),
    { duration },
  )
}
