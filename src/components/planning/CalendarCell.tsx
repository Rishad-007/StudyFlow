import { cn } from '@/lib/utils'
import type { DailyPlan } from '@/types'

const STATUS_RING = {
  done: 'ring-green-500',
  partial: 'ring-amber-400',
  not_started: 'ring-gray-300',
}

interface CalendarCellProps {
  date: number
  dateStr: string
  isToday: boolean
  isCurrentMonth: boolean
  isPast: boolean
  isSelected: boolean
  plans: DailyPlan[]
  subjectNames: Record<string, string>
  subjectColors: Record<string, string>
  onSelect: (dateStr: string) => void
}

export function CalendarCell({
  date,
  dateStr,
  isToday,
  isCurrentMonth,
  isPast,
  isSelected,
  plans,
  subjectNames,
  subjectColors,
  onSelect,
}: CalendarCellProps) {
  return (
    <button
      onClick={() => !isPast && onSelect(dateStr)}
      disabled={isPast}
      className={cn(
        'relative flex min-h-[90px] flex-col rounded-lg border p-1.5 text-left transition-all duration-150 sm:min-h-[100px] sm:p-2',
        isPast && 'cursor-default opacity-40',
        !isPast && 'cursor-pointer hover:shadow-sm',
        isToday && !isSelected && 'border-indigo-300 bg-indigo-50/40 ring-1 ring-indigo-100',
        isSelected && 'border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-200',
        !isToday && !isSelected && !isPast && 'border-gray-200 bg-white',
        !isCurrentMonth && !isPast && 'border-gray-100 bg-gray-50/50',
      )}
    >
      <span
        className={cn(
          'mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
          isToday ? 'bg-indigo-500 text-white' : 'text-gray-700',
          !isCurrentMonth && 'text-gray-400',
        )}
      >
        {date}
      </span>

      {plans.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1">
          {plans.map((plan) => {
            const color = subjectColors[plan.subject_id] ?? '#6366f1'
            const name = subjectNames[plan.subject_id] ?? '?'
            const initial = name.charAt(0).toUpperCase()
            return (
              <div key={plan.id} className="relative inline-flex">
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2',
                    STATUS_RING[plan.status],
                  )}
                  style={{ backgroundColor: color }}
                  title={name}
                >
                  {initial}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </button>
  )
}
