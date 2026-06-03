import { useEffect, useState } from 'react'
import { usePlanStore } from '@/stores/planStore'
import { useSubjects } from '@/hooks/useSubjects'
import { WeeklyPlanner } from '@/components/planning/WeeklyPlanner'
import { DailyPlanner } from '@/components/planning/DailyPlanner'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'

export default function PlanningPage() {
  useSubjects()

  const selectedDate = usePlanStore((s) => s.selectedDate)
  const setSelectedDate = usePlanStore((s) => s.setSelectedDate)
  const fetchDailyPlan = usePlanStore((s) => s.fetchDailyPlan)
  const [tab, setTab] = useState<'weekly' | 'daily'>('weekly')

  useEffect(() => {
    if (tab === 'daily') {
      fetchDailyPlan(selectedDate)
    }
  }, [tab, selectedDate])

  return (
    <div className="p-4 md:p-6">
      <PageHeader title="Plan" description="Plan your study sessions" />

      {/* Tab Switcher */}
      <div className="mt-4 mb-6 flex overflow-hidden rounded-lg border border-gray-200 w-fit">
        <button
          onClick={() => setTab('weekly')}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            tab === 'weekly'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Weekly
        </button>
        <button
          onClick={() => setTab('daily')}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            tab === 'daily'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Daily
        </button>
      </div>

      {tab === 'weekly' && <WeeklyPlanner />}

      {tab === 'daily' && (
        <div>
          <div className="mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <DailyPlanner />
        </div>
      )}
    </div>
  )
}
