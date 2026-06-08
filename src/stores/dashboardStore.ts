import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { format } from 'date-fns'
import type { DailyTarget, DailyPlan, StudySession } from '@/types'

interface DashboardState {
  todayTarget: DailyTarget | null
  todayPlans: DailyPlan[]
  recentSessions: StudySession[]
  streak: number
  loading: boolean
  fetchDashboardData: () => Promise<void>
}

export const useDashboardStore = create<DashboardState>((set) => ({
  todayTarget: null,
  todayPlans: [],
  recentSessions: [],
  streak: 0,
  loading: true,

  fetchDashboardData: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    set({ loading: true })
    const today = format(new Date(), 'yyyy-MM-dd')

    // Fetch in parallel
    const [targetRes, plansRes, sessionsRes, loginDaysRes] = await Promise.all([
      supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', user.id)
        .eq('target_date', today)
        .maybeSingle(),
      supabase.from('daily_plans').select('*').eq('user_id', user.id).eq('plan_date', today),
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false })
        .limit(5),
      supabase
        .from('daily_targets')
        .select('target_date')
        .eq('user_id', user.id)
        .order('target_date', { ascending: false })
        .limit(365),
    ])

    let target = targetRes.data as DailyTarget | null

    // Auto-create today's target if missing (marks this as a login day)
    if (!target) {
      const settingsRes = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      const defaultTarget = (settingsRes.data as any)?.daily_target_minutes ?? 120

      const { data: newTarget } = await supabase
        .from('daily_targets')
        .insert({
          user_id: user.id,
          target_date: today,
          target_minutes: defaultTarget,
          achieved_minutes: 0,
        })
        .select()
        .single()

      target = (newTarget as DailyTarget) ?? null
    }

    // Calculate today's total study minutes from all completed sessions
    if (target) {
      const { data: todaySessions } = await supabase
        .from('study_sessions')
        .select('duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', `${today}T00:00:00`)
        .lte('started_at', `${today}T23:59:59`)
        .not('ended_at', 'is', null)

      const achieved = Math.round(
        (todaySessions ?? []).reduce(
          (sum: number, s: any) => sum + (s.duration_seconds ?? 0) / 60,
          0,
        ),
      )

      if (achieved !== target.achieved_minutes) {
        await supabase
          .from('daily_targets')
          .update({ achieved_minutes: achieved })
          .eq('id', target.id)
        target.achieved_minutes = achieved
      }
    }

    // Calculate login streak: consecutive days going backward where a daily_target exists
    const loginDates = new Set(
      ((loginDaysRes.data ?? []) as { target_date: string }[]).map((d) => d.target_date),
    )

    let streak = 0
    const d = new Date()
    while (true) {
      const dateStr = format(d, 'yyyy-MM-dd')
      if (loginDates.has(dateStr)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else {
        break
      }
    }

    set({
      todayTarget: target,
      todayPlans: (plansRes.data as DailyPlan[]) ?? [],
      recentSessions: (sessionsRes.data as StudySession[]) ?? [],
      streak,
      loading: false,
    })
  },
}))
