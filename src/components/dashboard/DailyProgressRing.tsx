import { cn } from '@/lib/utils'

interface DailyProgressRingProps {
  achievedMinutes: number
  targetMinutes: number
  size?: number
}

export function DailyProgressRing({
  achievedMinutes,
  targetMinutes,
  size = 220,
}: DailyProgressRingProps) {
  const pct = targetMinutes > 0 ? Math.min(achievedMinutes / targetMinutes, 1) : 0
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - pct)
  const center = size / 2
  const strokeWidth = 10

  const color =
    pct >= 0.75 ? 'stroke-emerald-500' : pct >= 0.5 ? 'stroke-amber-400' : 'stroke-red-400'

  const display =
    targetMinutes > 0
      ? `${Math.round(pct * 100)}%`
      : `${achievedMinutes}m`

  const sub =
    targetMinutes > 0
      ? `${achievedMinutes}m of ${targetMinutes}m goal`
      : 'No target set'

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="drop-shadow-sm">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-gray-100"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={cn(color, 'transition-all duration-700 ease-out')}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-gray-900">{display}</span>
        <span className="mt-1 text-xs text-gray-500">{sub}</span>
      </div>
    </div>
  )
}
