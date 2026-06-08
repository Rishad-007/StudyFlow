import { Link } from 'react-router-dom'
import { CheckCircle, Circle, Minus, Calendar } from 'lucide-react'
import type { DailyPlan } from '@/types'

interface TodaysPlansProps {
  plans: (DailyPlan & { subjectName: string; subjectColor: string })[]
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
  const done = plans.filter((p) => p.status === 'done').length
  const pct = plans.length > 0 ? (done / plans.length) * 100 : 0

  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Today's Plan</h3>
        </div>
        <div className="flex flex-col items-center py-4 text-center">
          <Calendar className="mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">No plans for today.</p>
          <Link
            to="/plan"
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create one in Plan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Today's Plan</h3>
        <span className="text-sm text-gray-500">
          {done}/{plans.length}
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-1">
        {plans.map((plan) => {
          const Icon = STATUS_ICONS[plan.status]
          const iconColor = STATUS_COLORS[plan.status]
          return (
            <div
              key={plan.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/5"
                style={{ backgroundColor: plan.subjectColor }}
              />
              <span className="flex-1 truncate text-sm font-medium text-gray-700">
                {plan.subjectName}
              </span>
              <span className="text-xs text-gray-400">
                {Math.round(plan.actual_minutes / 60)}h{plan.actual_minutes % 60}m
              </span>
              <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
