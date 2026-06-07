import { useEffect, useMemo } from 'react'
import { useAnalyticsStore } from '@/stores/analyticsStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { DateNavigator, navigateDate } from '@/components/shared/DateNavigator'
import { SummaryCards } from '@/components/analytics/SummaryCards'
import { SubjectPieChart } from '@/components/analytics/SubjectPieChart'
import { DailyBarChart } from '@/components/analytics/DailyBarChart'
import { ActivityHeatmap } from '@/components/analytics/ActivityHeatmap'
import { StreakCard } from '@/components/analytics/StreakCard'
import { ChapterProgressChart } from '@/components/analytics/ChapterProgressChart'
import { SessionsTable } from '@/components/analytics/SessionsTable'
import { ProductiveTimeCard } from '@/components/analytics/ProductiveTimeCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { cn } from '@/lib/utils'

export default function AnalyticsPage() {
  useSubjects()

  const period = useAnalyticsStore((s) => s.period)
  const setPeriod = useAnalyticsStore((s) => s.setPeriod)
  const selectedDate = useAnalyticsStore((s) => s.selectedDate)
  const setSelectedDate = useAnalyticsStore((s) => s.setSelectedDate)
  const sessions = useAnalyticsStore((s) => s.sessions)
  const subjectTimeDistribution = useAnalyticsStore((s) => s.subjectTimeDistribution)
  const dailyTotals = useAnalyticsStore((s) => s.dailyTotals)
  const dailyTargets = useAnalyticsStore((s) => s.dailyTargets)
  const chapterProgress = useAnalyticsStore((s) => s.chapterProgress)
  const mostProductiveHour = useAnalyticsStore((s) => s.mostProductiveHour)
  const mostProductiveDay = useAnalyticsStore((s) => s.mostProductiveDay)
  const totalTime = useAnalyticsStore((s) => s.totalTime)
  const totalSessions = useAnalyticsStore((s) => s.totalSessions)
  const loading = useAnalyticsStore((s) => s.loading)
  const fetchAnalytics = useAnalyticsStore((s) => s.fetchAnalytics)

  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)

  useEffect(() => {
    fetchAnalytics()
  }, [period, selectedDate])

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  )

  const subjectColors = useMemo(() => {
    const map: Record<string, string> = {}
    for (const ch of chapters) {
      const sub = subjects.find((s) => s.id === ch.subject_id)
      if (sub) map[sub.name] = sub.color
    }
    return map
  }, [subjects, chapters])

  const chapterNames = useMemo(
    () => Object.fromEntries(chapters.map((ch) => [ch.id, ch.name])),
    [chapters],
  )

  const periods = ['day', 'week', 'month'] as const

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Track your study patterns and progress" />

      {/* Period Selector & Date Nav */}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                period === p
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50',
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <DateNavigator
          date={selectedDate}
          period={period}
          onPrev={() => setSelectedDate(navigateDate(selectedDate, period, 'prev'))}
          onNext={() => setSelectedDate(navigateDate(selectedDate, period, 'next'))}
          onToday={() => setSelectedDate(new Date().toISOString().split('T')[0])}
        />
      </div>

      {/* Summary Cards */}
      <SummaryCards
        totalTime={totalTime}
        totalSessions={totalSessions}
        productiveHour={mostProductiveHour}
      />

      {/* Streak Card */}
      <StreakCard dailyTargets={dailyTargets} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Time by Subject</h3>
          <SubjectPieChart data={subjectTimeDistribution} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Daily Study Time</h3>
          </div>
          <DailyBarChart data={dailyTotals} />
          <div className="mt-3">
            <ActivityHeatmap data={dailyTotals} />
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Subject Progress</h3>
        <ChapterProgressChart data={chapterProgress} subjectColors={subjectColors} />
      </div>

      {/* Insights + Sessions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProductiveTimeCard
            productiveHour={mostProductiveHour}
            productiveDay={mostProductiveDay}
          />
        </div>
        <div className="lg:col-span-2">
          <SessionsTable
            sessions={sessions}
            subjectNames={subjectNames}
            chapterNames={chapterNames}
          />
        </div>
      </div>
    </div>
  )
}
