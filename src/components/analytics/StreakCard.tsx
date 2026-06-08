import { useMemo } from 'react'
import { Flame, Calendar } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { calculateStreak } from '@/utils/analytics'
import type { DailyTarget } from '@/types'

interface StreakCardProps {
  dailyTargets: DailyTarget[]
}

export function StreakCard({ dailyTargets }: StreakCardProps) {
  const streak = calculateStreak(dailyTargets)
  const months = Math.floor(streak / 30)
  const remaining = streak % 30
  const isComplete = streak > 0 && remaining === 0

  const totalLoginDays = useMemo(
    () => new Set(dailyTargets.map((t) => t.target_date)).size,
    [dailyTargets],
  )

  const last14Days = useMemo(() => {
    const dateSet = new Set(dailyTargets.map((t) => t.target_date))
    return Array.from({ length: 14 }, (_, i) => {
      const d = subDays(new Date(), 13 - i)
      return {
        date: format(d, 'yyyy-MM-dd'),
        loggedIn: dateSet.has(format(d, 'yyyy-MM-dd')),
        label: format(d, 'EEE'),
      }
    })
  }, [dailyTargets])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            {streak === 0 ? (
              <>
                <div className="text-3xl font-bold text-gray-300">0</div>
                <div className="text-sm text-gray-500">day streak</div>
              </>
            ) : isComplete ? (
              <>
                <div className="text-3xl font-bold text-indigo-600">{months}</div>
                <div className="text-sm text-gray-500">month{months > 1 ? 's' : ''} complete</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-gray-900">{streak}</div>
                <div className="text-sm text-gray-500">day streak</div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{totalLoginDays} total days</span>
        </div>
      </div>

      {/* 30-day cycle progress bar */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {isComplete ? (
            <span className="font-medium text-indigo-600">Month complete! 🎉</span>
          ) : (
            <>
              <span className="text-gray-400">
                {streak === 0 ? 'No activity' : `${remaining}/30 days`}
              </span>
              {months > 0 && <span className="text-gray-400">Month {months + 1}</span>}
            </>
          )}
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
            style={{ width: `${isComplete ? 100 : streak === 0 ? 0 : (remaining / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* 14-day activity mini-chart */}
      <div className="mt-5">
        <div className="mb-2 flex items-end gap-1">
          {last14Days.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`h-3 w-full rounded-sm transition-colors ${day.loggedIn ? 'bg-indigo-400' : 'bg-gray-200'}`}
                title={`${day.date}: ${day.loggedIn ? 'Active' : 'Inactive'}`}
              />
              <span className="text-[10px] text-gray-400">{day.label[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
