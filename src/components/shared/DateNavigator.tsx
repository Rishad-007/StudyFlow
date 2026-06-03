import { format, parseISO, startOfWeek, endOfWeek, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Period = 'day' | 'week' | 'month'

interface DateNavigatorProps {
  date: string
  period: Period
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

function formatRange(dateStr: string, period: Period): string {
  const d = parseISO(dateStr)
  switch (period) {
    case 'day':
      return format(d, 'MMM d, yyyy')
    case 'week': {
      const start = startOfWeek(d, { weekStartsOn: 1 })
      const end = endOfWeek(d, { weekStartsOn: 1 })
      return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
    }
    case 'month':
      return format(d, 'MMMM yyyy')
  }
}

export function DateNavigator({ date, period, onPrev, onNext, onToday }: DateNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="min-w-[140px] text-center text-sm font-medium text-gray-700">
        {formatRange(date, period)}
      </span>
      <button onClick={onNext} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={onToday}
        className="ml-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        Today
      </button>
    </div>
  )
}

export function navigateDate(date: string, period: Period, direction: 'prev' | 'next'): string {
  const d = parseISO(date)
  switch (period) {
    case 'day': {
      const f = direction === 'prev' ? subDays : addDays
      return format(f(d, 1), 'yyyy-MM-dd')
    }
    case 'week': {
      const f = direction === 'prev' ? subWeeks : addWeeks
      return format(f(d, 1), 'yyyy-MM-dd')
    }
    case 'month': {
      const f = direction === 'prev' ? subMonths : addMonths
      return format(f(d, 1), 'yyyy-MM-dd')
    }
  }
}
