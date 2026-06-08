import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const tier: Record<string, string> = {
    gray: 'border-gray-200 text-gray-400 bg-gray-50',
    amber: 'border-amber-200 text-amber-600 bg-amber-50',
    orange: 'border-orange-200 text-orange-600 bg-orange-50',
    red: 'border-red-200 text-red-600 bg-red-50 shadow-[0_0_12px_rgba(220,38,38,0.15)]',
  }

  const key = streak === 0 ? 'gray' : streak <= 6 ? 'amber' : streak <= 29 ? 'orange' : 'red'

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md',
        tier[key],
      )}
    >
      <span className="text-3xl">🔥</span>
      <div>
        <span className="text-3xl font-bold">{streak}</span>
        <span className="ml-1.5 text-base font-medium">day streak</span>
      </div>
    </div>
  )
}
