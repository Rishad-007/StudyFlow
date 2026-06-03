import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addWeeks, subWeeks, eachDayOfInterval, endOfWeek } from 'date-fns'
import { usePlanStore } from '@/stores/planStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { DayColumn } from '@/components/planning/DayColumn'
import { AddToWeekModal } from '@/components/planning/AddToWeekModal'
import type { WeeklyPlan } from '@/types'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WeeklyPlanner() {
  const weeklyPlans = usePlanStore((s) => s.weeklyPlans)
  const fetchWeeklyPlan = usePlanStore((s) => s.fetchWeeklyPlan)
  const addToWeeklyPlan = usePlanStore((s) => s.addToWeeklyPlan)
  const removeFromWeeklyPlan = usePlanStore((s) => s.removeFromWeeklyPlan)
  const currentWeekStart = usePlanStore((s) => s.currentWeekStart)
  const setWeekStart = usePlanStore((s) => s.setWeekStart)

  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)
  const fetchSubjects = useSubjectStore((s) => s.fetchSubjects)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalDay, setModalDay] = useState(0)

  const weekStartDate = new Date(currentWeekStart)
  const days = eachDayOfInterval({
    start: weekStartDate,
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  })

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    fetchWeeklyPlan(currentWeekStart)
    if (subjects.length === 0) fetchSubjects()
  }, [currentWeekStart])

  const chapterNames: Record<string, string> = useMemo(
    () => Object.fromEntries(chapters.map((ch) => [ch.id, ch.name])),
    [chapters],
  )

  const chapterColors: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {}
    for (const ch of chapters) {
      const sub = subjects.find((s) => s.id === ch.subject_id)
      map[ch.id] = sub?.color ?? '#6366f1'
    }
    return map
  }, [chapters, subjects])

  const plansByDay = useMemo(() => {
    const grouped: Record<number, WeeklyPlan[]> = {}
    for (let i = 0; i < 7; i++) grouped[i] = []
    for (const plan of weeklyPlans) {
      if (grouped[plan.day_of_week]) grouped[plan.day_of_week].push(plan)
    }
    return grouped
  }, [weeklyPlans])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setWeekStart(format(subWeeks(weekStartDate, 1), 'yyyy-MM-dd'))}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-semibold text-gray-700">
          Week of {format(weekStartDate, 'MMM d, yyyy')}
        </h2>
        <button
          onClick={() => setWeekStart(format(addWeeks(weekStartDate, 1), 'yyyy-MM-dd'))}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[700px] grid-cols-7 gap-3 sm:min-w-0">
          {days.map((day, i) => {
            const dayStr = format(day, 'yyyy-MM-dd')
            return (
              <DayColumn
                key={dayStr}
                day={DAY_NAMES[i]}
                date={day.getDate()}
                isToday={dayStr === todayStr}
                plans={plansByDay[i] ?? []}
                chapterNames={chapterNames}
                chapterColors={chapterColors}
                onAddChapter={() => {
                  setModalDay(i)
                  setModalOpen(true)
                }}
                onRemoveChapter={(planId) => removeFromWeeklyPlan(planId)}
              />
            )
          })}
        </div>
      </div>

      <AddToWeekModal
        open={modalOpen}
        subjects={subjects}
        chapters={chapters}
        preselectedDay={modalDay}
        onClose={() => setModalOpen(false)}
        onSave={async (dayOfWeek, chapterId) => {
          await addToWeeklyPlan(dayOfWeek, chapterId)
        }}
      />
    </div>
  )
}
