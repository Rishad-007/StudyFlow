import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { usePlanStore } from '@/stores/planStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { PlanSummary } from '@/components/planning/PlanSummary'
import { CheckCircle, Circle, Minus } from 'lucide-react'

// Helper to convert DaisyUI-style accent colors to inline styles for the dots
function hexColor(color: string): string {
  return color.startsWith('#') ? color : '#6366f1'
}

export function DailyPlanner() {
  const dailyPlans = usePlanStore((s) => s.dailyPlans)
  const selectedDate = usePlanStore((s) => s.selectedDate)
  const setDailyPlan = usePlanStore((s) => s.setDailyPlan)
  const updateDailyPlanStatus = usePlanStore((s) => s.updateDailyPlanStatus)
  const updateDailyPlanActual = usePlanStore((s) => s.updateDailyPlanActual)

  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)

  // Group chapters by subject
  const chaptersBySubject = useMemo(() => {
    const map: Record<string, { id: string; name: string; subjectId: string; subjectName: string; subjectColor: string }[]> = {}
    for (const ch of chapters) {
      const sub = subjects.find((s) => s.id === ch.subject_id)
      if (!sub) continue
      if (!map[sub.id]) map[sub.id] = []
      map[sub.id].push({
        id: ch.id,
        name: ch.name,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectColor: sub.color,
      })
    }
    return map
  }, [chapters, subjects])

  const planMap = useMemo(() => {
    const map: Record<string, { planned: number; actual: number; status: string; id?: string }> = {}
    for (const p of dailyPlans) {
      map[p.chapter_id] = {
        planned: p.planned_minutes,
        actual: p.actual_minutes,
        status: p.status,
        id: p.id,
      }
    }
    return map
  }, [dailyPlans])

  const totalPlanned = dailyPlans.reduce((s, p) => s + p.planned_minutes, 0)
  const totalActual = dailyPlans.reduce((s, p) => s + p.actual_minutes, 0)
  const doneChapters = dailyPlans.filter((p) => p.status === 'done').length
  const totalChapters = dailyPlans.length
  const completionRate = totalChapters > 0 ? (doneChapters / totalChapters) * 100 : 0

  const statusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'partial':
        return <Circle className="h-5 w-5 text-amber-400" />
      default:
        return <Minus className="h-5 w-5 text-gray-300" />
    }
  }

  const allChaptersList = Object.values(chaptersBySubject).flat()

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-700">
          {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>

      {allChaptersList.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          No subjects or chapters yet. Add them in the Subjects page.
        </p>
      ) : (
        <>
          {Object.entries(chaptersBySubject).map(([subjectId, chs]) => (
            <div key={subjectId} className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-4 py-2">
                <span className="text-sm font-semibold text-gray-700">{chs[0].subjectName}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {chs.map((ch) => {
                  const plan = planMap[ch.id]
                  return (
                    <div key={ch.id} className="flex items-center gap-3 px-4 py-3">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: hexColor(ch.subjectColor) }}
                      />
                      <span className="flex-1 text-sm text-gray-800">{ch.name}</span>
                      <input
                        type="number"
                        min={0}
                        className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs outline-none focus:border-indigo-500"
                        placeholder="min"
                        value={plan?.planned ?? ''}
                        onChange={async (e) => {
                          const val = Number(e.target.value)
                          if (!isNaN(val)) await setDailyPlan(ch.id, val)
                        }}
                      />
                      <input
                        type="number"
                        min={0}
                        className="w-16 rounded border border-gray-200 px-2 py-1 text-center text-xs outline-none focus:border-indigo-500"
                        placeholder="min"
                        value={plan?.actual ?? ''}
                        onChange={async (e) => {
                          const val = Number(e.target.value)
                          if (!isNaN(val) && plan?.id) await updateDailyPlanActual(plan.id, val)
                        }}
                      />
                      <div className="flex items-center gap-0.5">
                        {(['not_started', 'partial', 'done'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={async () => {
                              if (plan?.id) await updateDailyPlanStatus(plan.id, st)
                            }}
                            className={`rounded-lg p-1.5 transition-colors ${
                              plan?.status === st ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                            }`}
                            title={st.replace('_', ' ')}
                          >
                            {statusIcon(st)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Mark all as done */}
      {dailyPlans.length > 0 && (
        <button
          onClick={async () => {
            for (const p of dailyPlans) {
              await updateDailyPlanStatus(p.id, 'done')
            }
          }}
          className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Mark all as done
        </button>
      )}

      <PlanSummary
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        completionRate={completionRate}
        totalChapters={totalChapters}
        doneChapters={doneChapters}
      />
    </div>
  )
}
