import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isPast,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePlanStore } from '@/stores/planStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { CalendarCell } from '@/components/planning/CalendarCell'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface MonthCalendarProps {
  onDateSelect: (dateStr: string) => void
}

export function MonthCalendar({ onDateSelect }: MonthCalendarProps) {
  const selectedMonth = usePlanStore((s) => s.selectedMonth)
  const selectedYear = usePlanStore((s) => s.selectedYear)
  const setSelectedMonth = usePlanStore((s) => s.setSelectedMonth)
  const setSelectedYear = usePlanStore((s) => s.setSelectedYear)
  const selectedDate = usePlanStore((s) => s.selectedDate)
  const monthPlans = usePlanStore((s) => s.monthPlans)

  const subjects = useSubjectStore((s) => s.subjects)

  const subjectNames = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  )
  const subjectColors = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.color])),
    [subjects],
  )

  const plansByDate = useMemo(() => {
    const map: Record<string, typeof monthPlans> = {}
    for (const plan of monthPlans) {
      if (!map[plan.plan_date]) map[plan.plan_date] = []
      map[plan.plan_date].push(plan)
    }
    return map
  }, [monthPlans])

  const monthDate = new Date(selectedYear, selectedMonth)
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(monthDate), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(monthDate), { weekStartsOn: 0 }),
  })

  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setSelectedMonth(now.getMonth())
    setSelectedYear(now.getFullYear())
    onDateSelect(format(now, 'yyyy-MM-dd'))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={goToPrevMonth}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-800">{format(monthDate, 'MMMM yyyy')}</h2>
          <button
            onClick={goToToday}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Today
          </button>
        </div>
        <button
          onClick={goToNextMonth}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names header */}
      <div className="mb-1 grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-[11px] font-semibold tracking-wider text-gray-400 uppercase"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          return (
            <CalendarCell
              key={dateStr}
              date={day.getDate()}
              dateStr={dateStr}
              isToday={isToday(day)}
              isCurrentMonth={isSameMonth(day, monthDate)}
              isPast={isPast(day) && !isToday(day)}
              isSelected={isSameDay(day, parseISO(selectedDate))}
              plans={plansByDate[dateStr] ?? []}
              subjectNames={subjectNames}
              subjectColors={subjectColors}
              onSelect={onDateSelect}
            />
          )
        })}
      </div>
    </div>
  )
}
