import { X } from 'lucide-react'

interface ChapterPillProps {
  name: string
  subjectColor: string
  onRemove?: () => void
}

export function ChapterPill({ name, subjectColor, onRemove }: ChapterPillProps) {
  return (
    <span
      className="group inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
      style={{
        backgroundColor: `${subjectColor}1A`,
        color: subjectColor,
      }}
    >
      <span className="max-w-[100px] truncate">{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full p-0.5 transition-opacity hover:bg-black/10 opacity-60 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
