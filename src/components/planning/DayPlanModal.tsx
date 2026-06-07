import { useMemo, useState, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { X, BookOpen, Plus, Loader2, Check, Minus, Clock, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePlanStore } from '@/stores/planStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { cn } from '@/lib/utils'

function hexColor(color: string): string {
  return color.startsWith('#') ? color : '#6366f1'
}

const STATUS_LABELS = { not_started: 'Not Started', partial: 'Partial', done: 'Done' } as const
const STATUS_ORDER: ('not_started' | 'partial' | 'done')[] = ['not_started', 'partial', 'done']

interface DayPlanModalProps {
  open: boolean
  dateStr: string
  onClose: () => void
}

export function DayPlanModal({ open, dateStr, onClose }: DayPlanModalProps) {
  const monthPlans = usePlanStore((s) => s.monthPlans)
  const setDailyPlan = usePlanStore((s) => s.setDailyPlan)
  const updateDailyPlanStatus = usePlanStore((s) => s.updateDailyPlanStatus)
  const updateDailyPlanActual = usePlanStore((s) => s.updateDailyPlanActual)
  const fetchPlansForMonth = usePlanStore((s) => s.fetchPlansForMonth)
  const selectedMonth = usePlanStore((s) => s.selectedMonth)
  const selectedYear = usePlanStore((s) => s.selectedYear)

  const subjects = useSubjectStore((s) => s.subjects)
  const [addMinutes, setAddMinutes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const dayPlans = useMemo(
    () => monthPlans.filter((p) => p.plan_date === dateStr),
    [monthPlans, dateStr],
  )

  const planMap = useMemo(() => {
    const map: Record<string, (typeof dayPlans)[0]> = {}
    for (const p of dayPlans) {
      map[p.subject_id] = p
    }
    return map
  }, [dayPlans])

  const totalPlanned = dayPlans.reduce((s, p) => s + p.planned_minutes, 0)
  const totalActual = dayPlans.reduce((s, p) => s + p.actual_minutes, 0)
  const doneSubjects = dayPlans.filter((p) => p.status === 'done').length
  const completionRate = dayPlans.length > 0 ? (doneSubjects / dayPlans.length) * 100 : 0

  const refresh = useCallback(
    () => fetchPlansForMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth, fetchPlansForMonth],
  )

  const cycleStatus = async (planId: string, currentStatus: string) => {
    const idx = STATUS_ORDER.indexOf(currentStatus as (typeof STATUS_ORDER)[number])
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length]
    await updateDailyPlanStatus(planId, next)
    await refresh()
  }

  const handleAdd = async (subjectId: string) => {
    const val = Number(addMinutes[subjectId])
    if (isNaN(val) || val <= 0) return
    setSaving((prev) => ({ ...prev, [subjectId]: true }))
    try {
      await setDailyPlan(subjectId, val, dateStr)
      setAddMinutes((prev) => ({ ...prev, [subjectId]: '' }))
      await refresh()
      toast.success('Plan added')
    } catch {
      toast.error('Failed to add plan')
    } finally {
      setSaving((prev) => ({ ...prev, [subjectId]: false }))
    }
  }

  const handleUpdatePlanned = async (subjectId: string, val: number) => {
    if (isNaN(val)) return
    try {
      await setDailyPlan(subjectId, val, dateStr)
      await refresh()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleUpdateActual = async (planId: string, val: number) => {
    if (isNaN(val)) return
    try {
      await updateDailyPlanActual(planId, val)
      await refresh()
    } catch {
      toast.error('Failed to update')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className={cn(
          'relative flex w-full flex-col bg-white shadow-2xl',
          'rounded-t-2xl sm:rounded-2xl',
          'max-h-[85vh] sm:max-h-[80vh] sm:max-w-lg',
          'animate-in slide-in-from-bottom sm:zoom-in-95',
        )}
      >
        {/* Drag handle (mobile) */}
        <div className="mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-gray-300 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 sm:py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {format(parseISO(dateStr), 'EEEE, MMM d')}
            </h2>
            {dayPlans.length > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                {doneSubjects}/{dayPlans.length} subjects done
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          {subjects.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <BookOpen className="mb-3 h-10 w-10 text-gray-200" />
              <h3 className="text-sm font-semibold text-gray-500">No subjects yet</h3>
              <p className="mt-1 text-xs text-gray-400">Add subjects in the Subjects page first</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-1">
              {subjects.map((sub) => {
                const plan = planMap[sub.id]
                return (
                  <div
                    key={sub.id}
                    className={cn(
                      'rounded-xl transition-all sm:rounded-lg',
                      plan
                        ? 'border border-gray-100 bg-white sm:border-transparent sm:hover:bg-gray-50/50'
                        : 'border border-dashed border-gray-200 bg-gray-50/50 sm:border-0 sm:bg-transparent',
                      saving[sub.id] && 'pointer-events-none opacity-60',
                    )}
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5 sm:px-2">
                      {/* Subject info */}
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div
                          className="h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-1"
                          style={{
                            backgroundColor: hexColor(sub.color),
                            ['--tw-ring-color' as string]: hexColor(sub.color),
                          }}
                        />
                        <span className="truncate text-sm font-medium text-gray-800">
                          {sub.name}
                        </span>
                      </div>

                      {plan ? (
                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                          {/* Planned input */}
                          <div className="flex items-center gap-0.5">
                            <input
                              type="number"
                              min={0}
                              inputMode="numeric"
                              className="w-12 rounded-lg border border-gray-200 px-1.5 py-1.5 text-center text-xs transition-colors outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 sm:w-14"
                              placeholder="--"
                              value={plan.planned_minutes}
                              onChange={(e) => {
                                const val = Number(e.target.value)
                                if (!isNaN(val)) handleUpdatePlanned(sub.id, val)
                              }}
                            />
                            <span className="hidden w-3 text-[9px] text-gray-400 sm:inline">P</span>
                          </div>

                          {/* Actual input */}
                          <div className="flex items-center gap-0.5">
                            <input
                              type="number"
                              min={0}
                              inputMode="numeric"
                              className="w-12 rounded-lg border border-gray-200 px-1.5 py-1.5 text-center text-xs transition-colors outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 sm:w-14"
                              placeholder="--"
                              value={plan.actual_minutes}
                              onChange={(e) => {
                                const val = Number(e.target.value)
                                if (!isNaN(val) && plan.id) handleUpdateActual(plan.id, val)
                              }}
                            />
                            <span className="hidden w-3 text-[9px] text-gray-400 sm:inline">A</span>
                          </div>

                          {/* Status toggle badge */}
                          <button
                            onClick={() => plan.id && cycleStatus(plan.id, plan.status)}
                            className={cn(
                              'flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all',
                              plan.status === 'done' && 'bg-emerald-50 text-emerald-600',
                              plan.status === 'partial' && 'bg-amber-50 text-amber-600',
                              plan.status === 'not_started' && 'bg-gray-100 text-gray-500',
                            )}
                            title="Click to change status"
                          >
                            {plan.status === 'done' && <Check className="h-3 w-3" />}
                            {plan.status === 'partial' && <Clock className="h-3 w-3" />}
                            {plan.status === 'not_started' && <Minus className="h-3 w-3" />}
                            <span className="hidden sm:inline">
                              {plan.status === 'not_started' ? 'Todo' : STATUS_LABELS[plan.status]}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex shrink-0 items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            placeholder="min"
                            value={addMinutes[sub.id] ?? ''}
                            onChange={(e) =>
                              setAddMinutes((prev) => ({ ...prev, [sub.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAdd(sub.id)
                            }}
                            className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-center text-xs transition-colors outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30"
                          />
                          <button
                            onClick={() => handleAdd(sub.id)}
                            disabled={
                              !addMinutes[sub.id] ||
                              Number(addMinutes[sub.id]) <= 0 ||
                              saving[sub.id]
                            }
                            className="flex items-center gap-1 rounded-lg bg-indigo-500 px-2.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                          >
                            {saving[sub.id] ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Plus className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {saving[sub.id] ? 'Adding...' : 'Add'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary section */}
          {dayPlans.length > 0 && (
            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
              {/* Stats row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs text-gray-500">
                    <strong className="text-gray-700">{totalPlanned}m</strong> planned
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-gray-500">
                    <strong className="text-gray-700">{totalActual}m</strong> studied
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(completionRate, 100)}%` }}
                />
              </div>

              {/* Mark all done + percentage */}
              <div className="flex items-center justify-between">
                <button
                  onClick={async () => {
                    for (const p of dayPlans) {
                      await updateDailyPlanStatus(p.id, 'done')
                    }
                    await refresh()
                    toast.success('All marked done!')
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  Mark all done
                </button>
                <span className="text-xs font-medium text-gray-500">
                  {Math.round(completionRate)}% complete
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
