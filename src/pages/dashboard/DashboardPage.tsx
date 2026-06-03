import { useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useGreeting } from '@/hooks/useGreeting'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { DailyProgressRing } from '@/components/dashboard/DailyProgressRing'
import { StreakBadge } from '@/components/dashboard/StreakBadge'
import { QuickStartTimer } from '@/components/dashboard/QuickStartTimer'
import { TodaysPlans } from '@/components/dashboard/TodaysPlans'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import { MotivationalQuote } from '@/components/dashboard/MotivationalQuote'
import { HabitSection } from '@/pages/dashboard/HabitSection'
import { SkeletonCard } from '@/components/shared/Skeleton'

export default function DashboardPage() {
  const { user } = useAuth()
  const { greeting } = useGreeting()
  const { todayTarget, todayPlans, recentSessions, streak, loading, fetchDashboardData } =
    useDashboardStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)
  const fetchSubjects = useSubjectStore((s) => s.fetchSubjects)

  useEffect(() => {
    fetchDashboardData()
    if (subjects.length === 0) fetchSubjects()
  }, [])

  // Map chapter IDs to names and subject colors for todayPlans
  const enrichedPlans = useMemo(
    () =>
      todayPlans.map((plan) => {
        const ch = chapters.find((c) => c.id === plan.chapter_id)
        const sub = subjects.find((s) => s.id === ch?.subject_id)
        return {
          ...plan,
          chapterName: ch?.name ?? 'Unknown',
          subjectColor: sub?.color ?? '#6366f1',
        }
      }),
    [todayPlans, chapters, subjects],
  )

  // Map subject IDs to names for recent sessions
  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  )

  // Last 3 unique subjects for quick start
  const recentQuickStart = useMemo(() => {
    const seen = new Set<string>()
    const items: { subjectId: string; subjectName: string }[] = []
    for (const session of recentSessions) {
      if (!session.subject_id) continue
      if (seen.has(session.subject_id)) continue
      seen.add(session.subject_id)
      const sub = subjects.find((s) => s.id === session.subject_id)
      items.push({
        subjectId: session.subject_id,
        subjectName: sub?.name ?? 'Unknown',
      })
      if (items.length >= 3) break
    }
    return items
  }, [recentSessions, subjects])

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'there'

  if (loading) return (
    <div className="space-y-6 p-4 md:p-6">
      <SkeletonCard />
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {displayName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">Let's make today productive.</p>
      </div>

      {/* Top Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-6">
          <DailyProgressRing
            achievedMinutes={todayTarget?.achieved_minutes ?? 0}
            targetMinutes={todayTarget?.target_minutes ?? 120}
          />
        </div>
        <div className="flex items-center justify-center">
          <StreakBadge streak={streak} />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <QuickStartTimer recentSubjects={recentQuickStart} />
        <TodaysPlans plans={enrichedPlans} />
      </div>

      {/* Habit Tracker */}
      <div className="grid gap-4 md:grid-cols-2">
        <HabitSection />
        <MotivationalQuote />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentSessions sessions={recentSessions} subjectNames={subjectNames} />
      </div>
    </div>
  )
}
