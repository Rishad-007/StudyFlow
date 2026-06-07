import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { WeeklyPlan, DailyPlan } from '@/types'
import { startOfWeek, format, getYear, getMonth } from 'date-fns'

function getMonday(d: Date): string {
  return format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

interface PlanState {
  weeklyPlans: WeeklyPlan[]
  dailyPlans: DailyPlan[]
  monthPlans: DailyPlan[]
  currentWeekStart: string
  selectedDate: string
  selectedMonth: number
  selectedYear: number
  loading: boolean

  setWeekStart: (date: string) => void
  setSelectedDate: (date: string) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  fetchWeeklyPlan: (weekStart: string) => Promise<void>
  fetchDailyPlan: (date: string) => Promise<void>
  fetchPlansForMonth: (year: number, month: number) => Promise<void>
  addToWeeklyPlan: (dayOfWeek: number, subjectId: string) => Promise<void>
  removeFromWeeklyPlan: (planId: string) => Promise<void>
  setDailyPlan: (subjectId: string, plannedMinutes: number, date?: string) => Promise<void>
  updateDailyPlanStatus: (
    planId: string,
    status: 'not_started' | 'partial' | 'done',
  ) => Promise<void>
  updateDailyPlanActual: (planId: string, actualMinutes: number) => Promise<void>
}

const now = new Date()

export const usePlanStore = create<PlanState>((set, get) => ({
  weeklyPlans: [],
  dailyPlans: [],
  monthPlans: [],
  currentWeekStart: getMonday(new Date()),
  selectedDate: todayStr(),
  selectedMonth: getMonth(now),
  selectedYear: getYear(now),
  loading: false,

  setWeekStart: (date) => set({ currentWeekStart: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),

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

  fetchPlansForMonth: async (year, month) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd')
    const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('user_id', user.id)
      .gte('plan_date', startDate)
      .lte('plan_date', endDate)
    if (error) {
      console.error('Failed to fetch plans for month:', error)
      return
    }
    set({ monthPlans: (data as DailyPlan[]) ?? [] })
  },

  addToWeeklyPlan: async (dayOfWeek, subjectId) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const weekStart = get().currentWeekStart

    const { data } = await supabase
      .from('weekly_plans')
      .insert({
        user_id: user.id,
        week_start: weekStart,
        day_of_week: dayOfWeek,
        subject_id: subjectId,
      })
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

  setDailyPlan: async (subjectId, plannedMinutes, date) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const targetDate = date ?? get().selectedDate

    const existing = get().monthPlans.find(
      (p) => p.subject_id === subjectId && p.plan_date === targetDate,
    )
    if (existing) {
      const { error } = await supabase
        .from('daily_plans')
        .update({ planned_minutes: plannedMinutes })
        .eq('id', existing.id)
      if (error) {
        console.error('Failed to update daily plan:', error)
        return
      }
      set((s) => ({
        monthPlans: s.monthPlans.map((p) =>
          p.id === existing.id ? { ...p, planned_minutes: plannedMinutes } : p,
        ),
        dailyPlans: s.dailyPlans.map((p) =>
          p.id === existing.id ? { ...p, planned_minutes: plannedMinutes } : p,
        ),
      }))
    } else {
      const { data, error } = await supabase
        .from('daily_plans')
        .insert({
          user_id: user.id,
          plan_date: targetDate,
          subject_id: subjectId,
          planned_minutes: plannedMinutes,
        })
        .select()
        .single()
      if (error) {
        console.error('Failed to insert daily plan:', error)
        return
      }
      if (data) {
        const plan = data as DailyPlan
        set((s) => ({
          monthPlans: [...s.monthPlans, plan],
          dailyPlans: [...s.dailyPlans, plan],
        }))
      }
    }
  },

  updateDailyPlanStatus: async (planId, status) => {
    const { error } = await supabase.from('daily_plans').update({ status }).eq('id', planId)
    if (error) {
      console.error('Failed to update daily plan status:', error)
      return
    }
    set((s) => ({
      monthPlans: s.monthPlans.map((p) => (p.id === planId ? { ...p, status } : p)),
      dailyPlans: s.dailyPlans.map((p) => (p.id === planId ? { ...p, status } : p)),
    }))
  },

  updateDailyPlanActual: async (planId, actualMinutes) => {
    const { error } = await supabase
      .from('daily_plans')
      .update({ actual_minutes: actualMinutes })
      .eq('id', planId)
    if (error) {
      console.error('Failed to update daily plan actual minutes:', error)
      return
    }
    set((s) => ({
      monthPlans: s.monthPlans.map((p) =>
        p.id === planId ? { ...p, actual_minutes: actualMinutes } : p,
      ),
      dailyPlans: s.dailyPlans.map((p) =>
        p.id === planId ? { ...p, actual_minutes: actualMinutes } : p,
      ),
    }))
  },
}))
