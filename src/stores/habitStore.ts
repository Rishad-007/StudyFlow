import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import { format } from 'date-fns'
import type { Habit } from '@/types'

interface HabitState {
  habits: Habit[]
  loading: boolean
  fetchHabits: () => Promise<void>
  addHabit: (name: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  completeToday: (id: string) => Promise<void>
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  loading: true,

  fetchHabits: async () => {
    const user = useAuthStore.getState().user
    if (!user) return
    set({ loading: true })
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    set({ habits: (data as Habit[]) ?? [], loading: false })
  },

  addHabit: async (name) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const { data } = await supabase
      .from('habits')
      .insert({ user_id: user.id, name })
      .select()
      .single()
    if (data) {
      set((s) => ({ habits: [data as Habit, ...s.habits] }))
    }
  },

  deleteHabit: async (id) => {
    await supabase.from('habits').delete().eq('id', id)
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }))
  },

  completeToday: async (id) => {
    const user = useAuthStore.getState().user
    if (!user) return
    const today = format(new Date(), 'yyyy-MM-dd')
    const habit = get().habits.find((h) => h.id === id)
    if (!habit) return

    const lastDate = habit.last_completed_date
    let newStreak = 1
    if (lastDate === today) {
      return // already done today
    }
    if (lastDate) {
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
      if (lastDate === yesterday) {
        newStreak = (habit.streak_count ?? 0) + 1
      }
    }

    await supabase
      .from('habits')
      .update({ last_completed_date: today, streak_count: newStreak })
      .eq('id', id)

    set((s) => ({
      habits: s.habits.map((h) =>
        h.id === id ? { ...h, last_completed_date: today, streak_count: newStreak } : h,
      ),
    }))
  },
}))
