import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import toast from 'react-hot-toast'
import type { User } from '@supabase/supabase-js'

async function ensureProfile(user: User) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!existing) {
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
    })
    if (error) console.error('Failed to create profile:', error)
  }
}

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
    const user = data?.session?.user ?? null

    if (user) await ensureProfile(user)

    set({ user, loading: false, initialized: true })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null
      if (u) await ensureProfile(u)
      set({ user: u, loading: false })
    })
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (data.user && !error) await ensureProfile(data.user)
    return { error }
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (data.user && !error) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
      })
      if (profileError) {
        console.error('Profile insert during signup failed:', profileError)
        // Fallback: try ensureProfile
        await ensureProfile(data.user)
      }
    }
    if (error) toast.error(error.message)
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
