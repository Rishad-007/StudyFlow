import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { WeeklyPlan, DailyPlan } from '@/types'
import { startOfWeek, format } from 'date-fns'

function getMonday(d: Date): string {
  return format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

interface PlanState {
  weeklyPlans: WeeklyPlan[]
  dailyPlans: DailyPlan[]
  currentWeekStart: string
  selectedDate: string
  loading: boolean

  setWeekStart: (date: string) => void
  setSelectedDate: (date: string) => void
  fetchWeeklyPlan: (weekStart: string) => Promise<void>
  fetchDailyPlan: (date: string) => Promise<void>
  addToWeeklyPlan: (dayOfWeek: number, chapterId: string) => Promise<void>
  removeFromWeeklyPlan: (planId: string) => Promise<void>
  setDailyPlan: (chapterId: string, plannedMinutes: number) => Promise<void>
  updateDailyPlanStatus: (planId: string, status: 'not_started' | 'partial' | 'done') => Promise<void>
  updateDailyPlanActual: (planId: string, actualMinutes: number) => Promise<void>
}

export const usePlanStore = create<PlanState>((set, get) => ({
  weeklyPlans: [],
  dailyPlans: [],
  currentWeekStart: getMonday(new Date()),
  selectedDate: todayStr(),
  loading: false,

  setWeekStart: (date) => set({ currentWeekStart: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  fetchWeeklyPlan: async (weekStart) => {
    const user = useAuthStore.getState().user
    if (!user) return
    set({ loading: true })
    const { data } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
    set({ weeklyPlans: (data as WeeklyPlan[]) ?? [], loading: false })
  },

  fetchDailyPlan: async (date) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const { data } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_date', date)
    set({ dailyPlans: (data as DailyPlan[]) ?? [] })
  },

  addToWeeklyPlan: async (dayOfWeek, chapterId) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const weekStart = get().currentWeekStart

    const { data } = await supabase
      .from('weekly_plans')
      .insert({ user_id: user.id, week_start: weekStart, day_of_week: dayOfWeek, chapter_id: chapterId })
      .select()
      .single()

    if (data) {
      set((s) => ({ weeklyPlans: [...s.weeklyPlans, data as WeeklyPlan] }))
    }
  },

  removeFromWeeklyPlan: async (planId) => {
    await supabase.from('weekly_plans').delete().eq('id', planId)
    set((s) => ({ weeklyPlans: s.weeklyPlans.filter((p) => p.id !== planId) }))
  },

  setDailyPlan: async (chapterId, plannedMinutes) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const date = get().selectedDate

    const existing = get().dailyPlans.find((p) => p.chapter_id === chapterId && p.plan_date === date)
    if (existing) {
      await supabase.from('daily_plans').update({ planned_minutes: plannedMinutes }).eq('id', existing.id)
      set((s) => ({
        dailyPlans: s.dailyPlans.map((p) =>
          p.id === existing.id ? { ...p, planned_minutes: plannedMinutes } : p,
        ),
      }))
    } else {
      const { data } = await supabase
        .from('daily_plans')
        .insert({ user_id: user.id, plan_date: date, chapter_id: chapterId, planned_minutes: plannedMinutes })
        .select()
        .single()
      if (data) {
        set((s) => ({ dailyPlans: [...s.dailyPlans, data as DailyPlan] }))
      }
    }
  },

  updateDailyPlanStatus: async (planId, status) => {
    await supabase.from('daily_plans').update({ status }).eq('id', planId)
    set((s) => ({
      dailyPlans: s.dailyPlans.map((p) => (p.id === planId ? { ...p, status } : p)),
    }))
  },

  updateDailyPlanActual: async (planId, actualMinutes) => {
    await supabase.from('daily_plans').update({ actual_minutes: actualMinutes }).eq('id', planId)
    set((s) => ({
      dailyPlans: s.dailyPlans.map((p) => (p.id === planId ? { ...p, actual_minutes: actualMinutes } : p)),
    }))
  },
}))
