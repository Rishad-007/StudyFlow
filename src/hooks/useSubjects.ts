import { useEffect } from 'react'
import { useSubjectStore } from '@/stores/subjectStore'

export function useSubjects() {
  const store = useSubjectStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const loading = useSubjectStore((s) => s.loading)
  const fetchSubjects = useSubjectStore((s) => s.fetchSubjects)

  useEffect(() => {
    if (subjects.length === 0 && !loading) {
      fetchSubjects()
    }
  }, [])

  return store
}

export function useSubjectChapters(subjectId: string) {
  const chapters = useSubjectStore((s) => s.chapters)
  return chapters.filter((ch) => ch.subject_id === subjectId)
}
