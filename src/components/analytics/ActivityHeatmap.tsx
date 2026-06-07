import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import type { DailyTotal } from '@/utils/analytics'

interface ActivityHeatmapProps {
  data: DailyTotal[]
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const maxMinutes = useMemo(() => Math.max(...data.map((d) => d.minutes), 1), [data])

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
        No data for this period
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1.5">
        {data.map((day) => {
          const pct = Math.round((day.minutes / maxMinutes) * 100)
          const tiers = [0, 25, 50, 75]
          let level = 0
          for (let i = tiers.length - 1; i >= 0; i--) {
            if (pct >= tiers[i]) {
              level = i + 1
              break
            }
          }
          const colors = [
            'bg-gray-100',
            'bg-indigo-200',
            'bg-indigo-300',
            'bg-indigo-400',
            'bg-indigo-500',
          ]
          const dateLabel = format(parseISO(day.date), 'MMM d')

          return (
            <div key={day.date} className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-full rounded-md ${colors[level]} transition-colors`}
                title={`${dateLabel}: ${day.minutes}m`}
              />
              <span className="text-[10px] text-gray-400">{format(parseISO(day.date), 'd')}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-gray-100" />
        <div className="h-3 w-3 rounded-sm bg-indigo-200" />
        <div className="h-3 w-3 rounded-sm bg-indigo-300" />
        <div className="h-3 w-3 rounded-sm bg-indigo-400" />
        <div className="h-3 w-3 rounded-sm bg-indigo-500" />
        <span>More</span>
      </div>
    </div>
  )
}
