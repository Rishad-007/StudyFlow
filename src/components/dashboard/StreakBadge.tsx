import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const tier =
    streak === 0 ? 'gray' : streak <= 6 ? 'amber' : streak <= 29 ? 'orange' : 'red'

  const colors = {
    gray: 'text-gray-400 border-gray-200',
    amber: 'text-amber-600 border-amber-200 bg-amber-50',
    orange: 'text-orange-600 border-orange-200 bg-orange-50',
    red: 'text-red-600 border-red-200 bg-red-50 shadow-[0_0_12px_rgba(220,38,38,0.3)]',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border p-4',
        colors[tier],
      )}
    >
      <span className="text-3xl">🔥</span>
      <span className="mt-1 text-2xl font-bold">{streak}</span>
      <span className="text-xs font-medium">day streak</span>
    </div>
  )
}
