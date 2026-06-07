import { Flame, Target, Calendar } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { calculateStreak } from '@/utils/analytics'
import type { DailyTarget } from '@/types'

interface StreakCardProps {
  dailyTargets: DailyTarget[]
}

export function StreakCard({ dailyTargets }: StreakCardProps) {
  const streak = calculateStreak(dailyTargets)

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const target = dailyTargets.find((t) => t.target_date === dateStr)
    const met = target ? target.achieved_minutes >= target.target_minutes * 0.5 : false
    return { date: dateStr, met, label: format(d, 'EEE') }
  })

  const totalDays = new Set(dailyTargets.map((t) => t.target_date)).size
  const metDays = dailyTargets.filter((t) => t.achieved_minutes >= t.target_minutes * 0.5).length
  const completionRate = totalDays > 0 ? Math.round((metDays / totalDays) * 100) : 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{streak}</div>
            <div className="text-sm text-gray-500">Day streak</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{completionRate}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {metDays}/{totalDays} days
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end gap-1">
        {days.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-3 w-full rounded-sm ${day.met ? 'bg-emerald-400' : 'bg-gray-200'}`}
              title={`${day.date}: ${day.met ? 'Met' : 'Missed'}`}
            />
            <span className="text-[10px] text-gray-400">{day.label[0]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
