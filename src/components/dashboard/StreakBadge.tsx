import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const tierColors: Record<string, string> = {
    gray: 'border-gray-200 text-gray-400 bg-gray-50',
    amber: 'border-amber-200 text-amber-600 bg-amber-50',
    orange: 'border-orange-200 text-orange-600 bg-orange-50',
    red: 'border-red-200 text-red-600 bg-red-50 shadow-[0_0_12px_rgba(220,38,38,0.15)]',
  }

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border px-5 py-4', tierColors[streak === 0 ? 'gray' : streak <= 6 ? 'amber' : streak <= 29 ? 'orange' : 'red'])}>
      <span className="text-2xl">🔥</span>
      <div>
        <span className="text-2xl font-bold">{streak}</span>
        <span className="ml-1 text-sm font-medium">day streak</span>
      </div>
    </div>
  )
}
