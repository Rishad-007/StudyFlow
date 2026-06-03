import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'
import type { UserSettings } from '@/types'

interface SettingsState {
  settings: UserSettings | null
  loading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<UserSettings>) => Promise<void>
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>
  exportData: () => Promise<void>
  deleteAccount: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: true,

  fetchSettings: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    set({ loading: true })

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data && !error) {
      // Create default settings
      const { data: created } = await supabase
        .from('user_settings')
        .insert({ user_id: user.id })
        .select()
        .single()
      set({ settings: created as UserSettings, loading: false })
      return
    }

    set({ settings: data as UserSettings, loading: false })
  },

  updateSettings: async (data) => {
    const user = useAuthStore.getState().user
    if (!user) return

    await supabase.from('user_settings').update(data).eq('user_id', user.id)
    set((s) => ({
      settings: s.settings ? { ...s.settings, ...data } : s.settings,
    }))
    toast.success('Settings saved')
  },

  updateProfile: async ({ fullName, avatarUrl }) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const updates: Record<string, string> = {}
    if (fullName !== undefined) updates.full_name = fullName
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl

    await supabase.from('profiles').update(updates).eq('id', user.id)
    toast.success('Profile updated')
  },

  exportData: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    const tables = ['subjects', 'chapters', 'study_sessions', 'daily_targets', 'daily_plans', 'weekly_plans', 'user_settings', 'habits', 'session_notes'] as const
    const results: Record<string, unknown> = {}

    for (const table of tables) {
      const { data } = await supabase.from(table).select('*').eq('user_id', user.id)
      results[table] = data ?? []
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `studyflow-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported')
  },

  deleteAccount: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { error } = await supabase.rpc('delete_user')
    if (error) {
      // Fallback: delete user via admin API requires server function
      // For now, sign out and let the user handle through Supabase dashboard
      toast.error('Account deletion requires admin. Please contact support.')
    }
  },
}))
