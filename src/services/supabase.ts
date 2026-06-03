import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createNoopQueryBuilder() {
  return new Proxy(
    {},
    {
      get: () => createNoopQueryBuilder,
      apply: () => createNoopQueryBuilder(),
    },
  )
}

function createNoopSupabaseClient() {
  const noopBuilder = createNoopQueryBuilder()

  return {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null }
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async signInWithPassword() {
        return {
          data: { user: null, session: null },
          error: {
            message:
              'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
          },
        }
      },
      async signUp() {
        return {
          data: { user: null, session: null },
          error: {
            message:
              'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
          },
        }
      },
      async signOut() {
        return { error: null }
      },
      async resetPasswordForEmail() {
        return {
          data: {},
          error: {
            message:
              'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.',
          },
        }
      },
    },
    from() {
      return noopBuilder
    },
    rpc() {
      return noopBuilder
    },
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (createNoopSupabaseClient() as ReturnType<typeof createClient>)
