import type { Subject, Chapter } from '@/types'

interface SubjectChapterSelectorProps {
  subjects: Subject[]
  chapters: Chapter[]
  selectedSubjectId: string | null
  selectedChapterId: string | null
  onSubjectChange: (id: string | null) => void
  onChapterChange: (id: string | null) => void
  disabled: boolean
}

export function SubjectChapterSelector({
  subjects,
  chapters,
  selectedSubjectId,
  selectedChapterId,
  onSubjectChange,
  onChapterChange,
  disabled,
}: SubjectChapterSelectorProps) {
  const filteredChapters = chapters.filter(
    (ch) => ch.subject_id === selectedSubjectId,
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500">Subject</label>
        <select
          value={selectedSubjectId ?? ''}
          onChange={(e) => onSubjectChange(e.target.value || null)}
          disabled={disabled}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">No subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500">Chapter</label>
        <select
          value={selectedChapterId ?? ''}
          onChange={(e) => onChapterChange(e.target.value || null)}
          disabled={disabled || !selectedSubjectId}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">No chapter</option>
          {filteredChapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
