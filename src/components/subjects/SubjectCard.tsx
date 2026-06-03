import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import type { Subject, Chapter } from '@/types'
import { ChapterItem } from '@/components/subjects/ChapterItem'
import { ProgressBar } from '@/components/shared/ProgressBar'

interface SubjectCardProps {
  subject: Subject
  chapters: Chapter[]
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
  onEditChapter: (chapter: Chapter) => void
  onDeleteChapter: (chapter: Chapter) => void
  onUpdateProgress: (chapter: Chapter) => void
}

export function SubjectCard({
  subject,
  chapters,
  onEdit,
  onDelete,
  onEditChapter,
  onDeleteChapter,
  onUpdateProgress,
}: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const subjectChapters = chapters.filter((ch) => ch.subject_id === subject.id)
  const avgProgress =
    subjectChapters.length > 0
      ? Math.round(subjectChapters.reduce((sum, ch) => sum + ch.progress_pct, 0) / subjectChapters.length)
      : 0

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex cursor-pointer items-stretch"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-1 shrink-0"
          style={{ backgroundColor: subject.color }}
        />
        <div className="flex flex-1 items-center gap-4 px-4 py-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{subject.name}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {subjectChapters.length}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={avgProgress} color={subject.color} size="sm" showLabel />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(subject)
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(subject)
              }}
              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
          {subjectChapters.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-400">No chapters yet</p>
          ) : (
            <div className="space-y-2">
              {subjectChapters.map((chapter) => (
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  subjectColor={subject.color}
                  onEdit={() => onEditChapter(chapter)}
                  onDelete={() => onDeleteChapter(chapter)}
                  onUpdateProgress={() => onUpdateProgress(chapter)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
