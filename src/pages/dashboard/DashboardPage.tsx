import { useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useGreeting } from '@/hooks/useGreeting'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { DailyProgressRing } from '@/components/dashboard/DailyProgressRing'
import { StreakBadge } from '@/components/dashboard/StreakBadge'
import { QuickStartTimer } from '@/components/dashboard/QuickStartTimer'
import { TodaysPlans } from '@/components/dashboard/TodaysPlans'
import { RecentSessions } from '@/components/dashboard/RecentSessions'
import { MotivationalQuote } from '@/components/dashboard/MotivationalQuote'
import { HabitSection } from '@/pages/dashboard/HabitSection'
import { SkeletonCard } from '@/components/shared/Skeleton'
import { PWAInstallButton } from '@/components/shared/PWAInstallButton'

export default function DashboardPage() {
  useSubjects()
  const { user } = useAuth()
  const { greeting } = useGreeting()
  const { todayTarget, todayPlans, recentSessions, streak, loading, fetchDashboardData } =
    useDashboardStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const enrichedPlans = useMemo(
    () =>
      todayPlans.map((plan) => {
        const sub = subjects.find((s) => s.id === plan.subject_id)
        return {
          ...plan,
          subjectName: sub?.name ?? 'Unknown',
          subjectColor: sub?.color ?? '#6366f1',
        }
      }),
    [todayPlans, subjects],
  )

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  )

  const chapterNames = useMemo(
    () => Object.fromEntries(chapters.map((ch) => [ch.id, ch.name])),
    [chapters],
  )

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'there'

  if (loading)
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {greeting}, {displayName}!
          </h1>
          <p className="mt-1.5 text-base text-gray-500">Let's make today productive.</p>
        </div>
        <PWAInstallButton />
      </div>

      {/* Hero Quote */}
      <MotivationalQuote />

      {/* Quick Start */}
      <QuickStartTimer />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <DailyProgressRing
            achievedMinutes={todayTarget?.achieved_minutes ?? 0}
            targetMinutes={todayTarget?.target_minutes ?? 120}
          />
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Plans + Sessions Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TodaysPlans plans={enrichedPlans} />
        <RecentSessions
          sessions={recentSessions}
          subjectNames={subjectNames}
          chapterNames={chapterNames}
        />
      </div>

      {/* Habits */}
      <HabitSection />
    </div>
  )
}
