import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

interface TimerState {
  mode: 'free' | 'pomodoro'
  status: 'idle' | 'running' | 'paused'
  elapsedSeconds: number
  pomodoroWorkMinutes: number
  pomodoroBreakMinutes: number
  pomodoroSession: 'work' | 'break'
  pomodoroCount: number
  selectedSubjectId: string | null
  selectedChapterId: string | null
  sessionId: string | null
  startTime: string | null

  setMode: (mode: 'free' | 'pomodoro') => void
  setSubject: (id: string | null) => void
  setChapter: (id: string | null) => void
  setPomodoroWork: (minutes: number) => void
  setPomodoroBreak: (minutes: number) => void
  startTimer: () => Promise<void>
  pauseTimer: () => Promise<void>
  resumeTimer: () => Promise<void>
  stopTimer: () => Promise<void>
  tick: () => void
  resetTimer: () => void
  loadTimerState: () => void
  skipBreak: () => void
}

const STORAGE_KEY = 'studyflow-timer-state'

function saveToLocal(state: TimerState) {
  const data = {
    mode: state.mode,
    status: state.status,
    elapsedSeconds: state.elapsedSeconds,
    sessionId: state.sessionId,
    selectedSubjectId: state.selectedSubjectId,
    selectedChapterId: state.selectedChapterId,
    startTime: state.startTime,
    pomodoroSession: state.pomodoroSession,
    pomodoroCount: state.pomodoroCount,
    pomodoroWorkMinutes: state.pomodoroWorkMinutes,
    pomodoroBreakMinutes: state.pomodoroBreakMinutes,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'free',
  status: 'idle',
  elapsedSeconds: 0,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  pomodoroSession: 'work',
  pomodoroCount: 0,
  selectedSubjectId: null,
  selectedChapterId: null,
  sessionId: null,
  startTime: null,

  setMode: (mode) => set({ mode }),
  setSubject: (id) => set({ selectedSubjectId: id, selectedChapterId: null }),
  setChapter: (id) => set({ selectedChapterId: id }),
  setPomodoroWork: (minutes) => set({ pomodoroWorkMinutes: minutes }),
  setPomodoroBreak: (minutes) => set({ pomodoroBreakMinutes: minutes }),

  startTimer: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    const s = get()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        subject_id: s.selectedSubjectId,
        chapter_id: s.selectedChapterId,
        started_at: now,
        session_type: s.mode,
      })
      .select()
      .single()

    if (error || !data) {
      toast.error('Failed to start session')
      return
    }

    set({
      status: 'running',
      sessionId: data.id,
      startTime: now,
      elapsedSeconds: 0,
    })
  },

  pauseTimer: async () => {
    const s = get()
    if (!s.sessionId) return

    await supabase
      .from('study_sessions')
      .update({ duration_seconds: s.elapsedSeconds })
      .eq('id', s.sessionId)

    set({ status: 'paused' })
  },

  resumeTimer: async () => {
    const s = get()
    if (!s.sessionId) return

    const now = new Date().toISOString()
    await supabase
      .from('study_sessions')
      .update({ started_at: now })
      .eq('id', s.sessionId)

    set({ status: 'running', startTime: now })
  },

  stopTimer: async () => {
    const s = get()
    if (!s.sessionId) return

    const now = new Date().toISOString()
    await supabase
      .from('study_sessions')
      .update({
        ended_at: now,
        duration_seconds: s.elapsedSeconds,
      })
      .eq('id', s.sessionId)

    set({ status: 'idle', sessionId: null, startTime: null })
    localStorage.removeItem(STORAGE_KEY)
  },

  tick: () => {
    const s = get()
    if (s.status !== 'running') return

    const newElapsed = s.elapsedSeconds + 1
    set({ elapsedSeconds: newElapsed })

    // Pomodoro auto-switch logic
    if (s.mode === 'pomodoro') {
      if (s.pomodoroSession === 'work' && newElapsed >= s.pomodoroWorkMinutes * 60) {
        set({ status: 'paused', pomodoroSession: 'break', elapsedSeconds: 0 })
        toast('Break time! Take a breather.', { icon: '☕' })
      } else if (s.pomodoroSession === 'break' && newElapsed >= s.pomodoroBreakMinutes * 60) {
        const newCount = s.pomodoroCount + 1
        set({
          status: 'paused',
          pomodoroSession: 'work',
          pomodoroCount: newCount,
          elapsedSeconds: 0,
        })
        toast(`Session ${newCount} — time to focus!`, { icon: '🎯' })
      }
    }
  },

  resetTimer: () => {
    set({
      status: 'idle',
      elapsedSeconds: 0,
      sessionId: null,
      startTime: null,
      pomodoroSession: 'work',
      pomodoroCount: 0,
    })
    localStorage.removeItem(STORAGE_KEY)
  },

  loadTimerState: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      // Discard sessions older than 24 hours
      if (saved.startTime) {
        const age = Date.now() - new Date(saved.startTime).getTime()
        if (age > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(STORAGE_KEY)
          return
        }
      }
      set({
        mode: saved.mode ?? 'free',
        status: saved.status ?? 'idle',
        elapsedSeconds: saved.elapsedSeconds ?? 0,
        sessionId: saved.sessionId ?? null,
        selectedSubjectId: saved.selectedSubjectId ?? null,
        selectedChapterId: saved.selectedChapterId ?? null,
        startTime: saved.startTime ?? null,
        pomodoroSession: saved.pomodoroSession ?? 'work',
        pomodoroCount: saved.pomodoroCount ?? 0,
        pomodoroWorkMinutes: saved.pomodoroWorkMinutes ?? 25,
        pomodoroBreakMinutes: saved.pomodoroBreakMinutes ?? 5,
      })
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  },

  skipBreak: () => {
    set({
      status: 'idle',
      pomodoroSession: 'work',
      elapsedSeconds: 0,
    })
  },
}))

// Auto-save to localStorage on every change via subscribe
useTimerStore.subscribe((state) => {
  saveToLocal(state)
})
