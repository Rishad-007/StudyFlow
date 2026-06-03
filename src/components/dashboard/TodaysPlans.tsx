import { CheckCircle, Circle, Minus } from 'lucide-react'
import type { DailyPlan } from '@/types'

interface TodaysPlansProps {
  plans: (DailyPlan & { chapterName: string; subjectColor: string })[]
}

const STATUS_ICONS = {
  done: CheckCircle,
  partial: Circle,
  not_started: Minus,
} as const

const STATUS_COLORS = {
  done: 'text-emerald-500',
  partial: 'text-amber-400',
  not_started: 'text-gray-300',
} as const

export function TodaysPlans({ plans }: TodaysPlansProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Today's Plan</h3>
        <p className="text-sm text-gray-400">No plans for today. Create one in the Plan page!</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        Today's Plan ({plans.filter((p) => p.status === 'done').length}/{plans.length})
      </h3>
      <div className="space-y-2">
        {plans.map((plan) => {
          const Icon = STATUS_ICONS[plan.status]
          const iconColor = STATUS_COLORS[plan.status]
          return (
            <div key={plan.id} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: plan.subjectColor }}
              />
              <span className="flex-1 truncate text-sm text-gray-700">
                {plan.chapterName}
              </span>
              <span className="text-xs text-gray-400">
                {Math.round(plan.actual_minutes / 60)}h{plan.actual_minutes % 60}m / {Math.round(plan.planned_minutes / 60)}h{plan.planned_minutes % 60}m
              </span>
              <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
