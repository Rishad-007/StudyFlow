import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ProgressBar({
  value,
  color = '#6366f1',
  size = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  const heights = { sm: 'h-2', md: 'h-3', lg: 'h-4' }

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex-1 rounded-full bg-gray-100 shadow-inner', heights[size])}>
        <div
          className={cn('rounded-full transition-all duration-500', heights[size])}
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500">{Math.round(clamped)}%</span>
      )}
    </div>
  )
}
