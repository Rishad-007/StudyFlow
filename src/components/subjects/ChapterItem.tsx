import { Pencil, Trash2, RefreshCw } from 'lucide-react'
import type { Chapter } from '@/types'
import { ProgressBar } from '@/components/shared/ProgressBar'

interface ChapterItemProps {
  chapter: Chapter
  subjectColor: string
  onEdit: () => void
  onDelete: () => void
  onUpdateProgress: () => void
}

export function ChapterItem({
  chapter,
  subjectColor,
  onEdit,
  onDelete,
  onUpdateProgress,
}: ChapterItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-3 shadow-sm ring-1 ring-gray-100">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800 truncate">{chapter.name}</span>
          <span className="text-xs font-semibold text-gray-500 ml-2">
            {chapter.progress_pct}%
          </span>
        </div>
        <div className="mt-1.5">
          <ProgressBar value={chapter.progress_pct} color={subjectColor} size="sm" />
        </div>
        {chapter.checkpoint_text && (
          <p className="mt-1.5 text-xs italic text-gray-400 leading-relaxed">{chapter.checkpoint_text}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUpdateProgress}
          className="rounded-lg p-2 text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
          title="Update progress"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
