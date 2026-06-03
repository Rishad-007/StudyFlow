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

    // Fetch all in parallel
    const [targetRes, plansRes, sessionsRes, streakRes] = await Promise.all([
      supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', user.id)
        .eq('target_date', today)
        .maybeSingle(),
      supabase
        .from('daily_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan_date', today),
      supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false })
        .limit(5),
      supabase.rpc('get_streak', { p_user_id: user.id }),
    ])

    let target = targetRes.data as DailyTarget | null

    // Auto-create today's target if missing
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
        })
        .select()
        .single()

      target = (newTarget as DailyTarget) ?? null
    }

    set({
      todayTarget: target,
      todayPlans: (plansRes.data as DailyPlan[]) ?? [],
      recentSessions: (sessionsRes.data as StudySession[]) ?? [],
      streak: (streakRes.data as number) ?? 0,
      loading: false,
    })
  },
}))
