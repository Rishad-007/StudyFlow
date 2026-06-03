import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Subject, Chapter } from '@/types'

interface SubjectState {
  subjects: Subject[]
  chapters: Chapter[]
  loading: boolean
  fetchSubjects: () => Promise<void>
  addSubject: (name: string, color: string) => Promise<void>
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  addChapter: (subjectId: string, name: string) => Promise<void>
  updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
  deleteChapter: (id: string) => Promise<void>
  updateChapterProgress: (id: string, progressPct: number, checkpointText?: string) => Promise<void>
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subjects: [],
  chapters: [],
  loading: true,

  fetchSubjects: async () => {
    const user = useAuthStore.getState().user
    if (!user) return

    set({ loading: true })

    const [subjectsRes, chaptersRes] = await Promise.all([
      supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('chapters')
        .select('*')
        .eq('user_id', user.id),
    ])

    set({
      subjects: (subjectsRes.data as Subject[]) ?? [],
      chapters: (chaptersRes.data as Chapter[]) ?? [],
      loading: false,
    })
  },

  addSubject: async (name, color) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { data } = await supabase
      .from('subjects')
      .insert({ user_id: user.id, name, color })
      .select()
      .single()

    if (data) {
      set((s) => ({ subjects: [...s.subjects, data as Subject] }))
    }
  },

  updateSubject: async (id, data) => {
    await supabase.from('subjects').update(data).eq('id', id)
    set((s) => ({
      subjects: s.subjects.map((sub) => (sub.id === id ? { ...sub, ...data } : sub)),
    }))
  },

  deleteSubject: async (id) => {
    await supabase.from('subjects').delete().eq('id', id)
    set((s) => ({
      subjects: s.subjects.filter((sub) => sub.id !== id),
      chapters: s.chapters.filter((ch) => ch.subject_id !== id),
    }))
  },

  addChapter: async (subjectId, name) => {
    const user = useAuthStore.getState().user
    if (!user) return

    const { data } = await supabase
      .from('chapters')
      .insert({ subject_id: subjectId, user_id: user.id, name })
      .select()
      .single()

    if (data) {
      set((s) => ({ chapters: [...s.chapters, data as Chapter] }))
    }
  },

  updateChapter: async (id, data) => {
    await supabase.from('chapters').update(data).eq('id', id)
    set((s) => ({
      chapters: s.chapters.map((ch) => (ch.id === id ? { ...ch, ...data } : ch)),
    }))
  },

  deleteChapter: async (id) => {
    await supabase.from('chapters').delete().eq('id', id)
    set((s) => ({
      chapters: s.chapters.filter((ch) => ch.id !== id),
    }))
  },

  updateChapterProgress: async (id, progressPct, checkpointText) => {
    const payload: Record<string, unknown> = { progress_pct: progressPct }
    if (checkpointText !== undefined) payload.checkpoint_text = checkpointText

    await supabase.from('chapters').update(payload).eq('id', id)
    set((s) => ({
      chapters: s.chapters.map((ch) =>
        ch.id === id ? { ...ch, ...payload } as Chapter : ch,
      ),
    }))
  },
}))
