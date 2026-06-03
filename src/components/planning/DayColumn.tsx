import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChapterPill } from '@/components/planning/ChapterPill'
import type { WeeklyPlan } from '@/types'

interface DayColumnProps {
  day: string
  date: number
  isToday: boolean
  plans: WeeklyPlan[]
  chapterNames: Record<string, string>
  chapterColors: Record<string, string>
  onAddChapter: () => void
  onRemoveChapter: (planId: string) => void
}

export function DayColumn({
  day,
  date,
  isToday,
  plans,
  chapterNames,
  chapterColors,
  onAddChapter,
  onRemoveChapter,
}: DayColumnProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border bg-white p-3',
        isToday ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-100' : 'border-gray-200',
      )}
    >
      <div className="mb-3 text-center">
        <div className="text-xs font-medium text-gray-500">{day}</div>
        <div
          className={cn(
            'mx-auto mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
            isToday ? 'bg-indigo-500 text-white' : 'text-gray-900',
          )}
        >
          {date}
        </div>
      </div>

      <div className="flex min-h-[100px] flex-col gap-1.5">
        {plans.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-4">
            <p className="text-xs text-gray-300">No topics</p>
          </div>
        ) : (
          plans.map((plan) => (
            <ChapterPill
              key={plan.id}
              name={chapterNames[plan.chapter_id] ?? 'Unknown'}
              subjectColor={chapterColors[plan.chapter_id] ?? '#6366f1'}
              onRemove={() => onRemoveChapter(plan.id)}
            />
          ))
        )}
      </div>

      <button
        onClick={onAddChapter}
        className="mt-3 flex items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-2 text-xs font-medium text-indigo-500 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add chapter
      </button>
    </div>
  )
}
