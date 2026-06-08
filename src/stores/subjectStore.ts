import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'
import type { Subject, Chapter } from '@/types'

interface SubjectState {
  subjects: Subject[]
  chapters: Chapter[]
  loading: boolean
  fetched: boolean
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
  loading: false,
  fetched: false,

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
      supabase.from('chapters').select('*').eq('user_id', user.id),
    ])

    if (subjectsRes.error) {
      console.error('Failed to fetch subjects:', subjectsRes.error)
    }
    if (chaptersRes.error) {
      console.error('Failed to fetch chapters:', chaptersRes.error)
    }

    set({
      subjects: (subjectsRes.data as Subject[]) ?? [],
      chapters: (chaptersRes.data as Chapter[]) ?? [],
      loading: false,
      fetched: true,
    })
  },

  addSubject: async (name, color) => {
    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('You must be signed in to add a subject')
      return
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert({ user_id: user.id, name, color })
      .select()
      .single()

    if (error) {
      console.error('Failed to add subject:', error)
      toast.error(error.message)
      return
    }

    if (data) {
      set((s) => ({ subjects: [...s.subjects, data as Subject] }))
      toast.success('Subject added')
    }
  },

  updateSubject: async (id, data) => {
    const { error } = await supabase.from('subjects').update(data).eq('id', id)
    if (error) {
      console.error('Failed to update subject:', error)
      toast.error(error.message)
      return
    }
    set((s) => ({
      subjects: s.subjects.map((sub) => (sub.id === id ? { ...sub, ...data } : sub)),
    }))
    toast.success('Subject updated')
  },

  deleteSubject: async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete subject:', error)
      toast.error(error.message)
      return
    }
    set((s) => ({
      subjects: s.subjects.filter((sub) => sub.id !== id),
      chapters: s.chapters.filter((ch) => ch.subject_id !== id),
    }))
    toast.success('Subject deleted')
  },

  addChapter: async (subjectId, name) => {
    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('You must be signed in to add a chapter')
      return
    }

    const { data, error } = await supabase
      .from('chapters')
      .insert({ subject_id: subjectId, user_id: user.id, name })
      .select()
      .single()

    if (error) {
      console.error('Failed to add chapter:', error)
      toast.error(error.message)
      return
    }

    if (data) {
      set((s) => ({ chapters: [...s.chapters, data as Chapter] }))
      toast.success('Chapter added')
    }
  },

  updateChapter: async (id, data) => {
    const { error } = await supabase.from('chapters').update(data).eq('id', id)
    if (error) {
      console.error('Failed to update chapter:', error)
      toast.error(error.message)
      return
    }
    set((s) => ({
      chapters: s.chapters.map((ch) => (ch.id === id ? { ...ch, ...data } : ch)),
    }))
    toast.success('Chapter updated')
  },

  deleteChapter: async (id) => {
    const { error } = await supabase.from('chapters').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete chapter:', error)
      toast.error(error.message)
      return
    }
    set((s) => ({
      chapters: s.chapters.filter((ch) => ch.id !== id),
    }))
    toast.success('Chapter deleted')
  },

  updateChapterProgress: async (id, progressPct, checkpointText) => {
    const payload: Record<string, unknown> = { progress_pct: progressPct }
    if (checkpointText !== undefined) payload.checkpoint_text = checkpointText

    const { error } = await supabase.from('chapters').update(payload).eq('id', id)
    if (error) {
      console.error('Failed to update chapter progress:', error)
      toast.error(error.message)
      return
    }
    set((s) => ({
      chapters: s.chapters.map((ch) => (ch.id === id ? ({ ...ch, ...payload } as Chapter) : ch)),
    }))
    toast.success('Progress updated')
  },
}))
