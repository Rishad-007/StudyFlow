import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    const { data } = await supabase.auth.getSession()
    set({ user: data?.session?.user ?? null, loading: false, initialized: true })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (data.user && !error) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      })
    }
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
