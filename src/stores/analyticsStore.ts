import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth } from 'date-fns'
import type { StudySession, DailyTarget } from '@/types'
import {
  aggregateBySubject,
  aggregateByDate,
  findPeakHour,
  findPeakDay,
  type SubjectTime,
  type DailyTotal,
} from '@/utils/analytics'

export type AnalyticsPeriod = 'day' | 'week' | 'month'

interface AnalyticsState {
  period: AnalyticsPeriod
  selectedDate: string
  sessions: StudySession[]
  subjectTimeDistribution: SubjectTime[]
  dailyTotals: DailyTotal[]
  dailyTargets: DailyTarget[]
  chapterProgress: { chapter: string; subject: string; progress: number }[]
  mostProductiveHour: number
  mostProductiveDay: number
  totalTime: number
  totalSessions: number
  loading: boolean

  setPeriod: (period: AnalyticsPeriod) => void
  setSelectedDate: (date: string) => void
  fetchAnalytics: () => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  period: 'week',
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  sessions: [],
  subjectTimeDistribution: [],
  dailyTotals: [],
  dailyTargets: [],
  chapterProgress: [],
  mostProductiveHour: 9,
  mostProductiveDay: 1,
  totalTime: 0,
  totalSessions: 0,
  loading: true,

  setPeriod: (period) => set({ period }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchAnalytics: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    const { period, selectedDate } = get()
    set({ loading: true })

    const dateObj = new Date(selectedDate)
    let gte: string
    let lte: string

    if (period === 'day') {
      gte = selectedDate
      lte = selectedDate
    } else if (period === 'week') {
      const start = startOfWeek(dateObj, { weekStartsOn: 1 })
      const end = endOfWeek(dateObj, { weekStartsOn: 1 })
      gte = format(start, 'yyyy-MM-dd')
      lte = format(end, 'yyyy-MM-dd')
    } else {
      const start = startOfMonth(dateObj)
      const end = endOfMonth(dateObj)
      gte = format(start, 'yyyy-MM-dd')
      lte = format(end, 'yyyy-MM-dd')
    }

    const [sessionsRes, allTargetsRes] = await Promise.all([
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', gte)
        .lte('started_at', `${lte}T23:59:59`)
        .not('ended_at', 'is', null)
        .order('started_at', { ascending: false }),
      supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', user.id)
        .order('target_date', { ascending: false })
        .limit(365),
    ])

    const sessions = (sessionsRes.data as StudySession[]) ?? []
    const dailyTargets = (allTargetsRes.data as DailyTarget[]) ?? []

    const totalTime = Math.round(
      sessions.reduce((sum, s) => sum + (s.duration_seconds ?? 0) / 60, 0),
    )

    const { subjects, chapters, fetched } = useSubjectStore.getState()

    const subjectNames: Record<string, string> = {}
    const subjectColors: Record<string, string> = {}
    for (const sub of subjects) {
      subjectNames[sub.id] = sub.name
      subjectColors[sub.id] = sub.color
    }

    const subjectTimeDistribution = aggregateBySubject(sessions, subjectNames, subjectColors)
    const dailyTotals = aggregateByDate(sessions)
    const peakHour = findPeakHour(sessions)
    const peakDay = findPeakDay(sessions)

    const chapterProgress = fetched
      ? chapters.map((ch) => {
          const sub = subjects.find((s) => s.id === ch.subject_id)
          return {
            chapter: ch.name,
            subject: sub?.name ?? 'Unknown',
            progress: ch.progress_pct,
          }
        })
      : []

    set({
      sessions,
      subjectTimeDistribution,
      dailyTotals,
      dailyTargets,
      chapterProgress,
      mostProductiveHour: peakHour,
      mostProductiveDay: peakDay,
      totalTime,
      totalSessions: sessions.length,
      loading: false,
    })
  },
}))
