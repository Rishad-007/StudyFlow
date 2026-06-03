import { Clock, Target, CheckCircle } from 'lucide-react'

interface PlanSummaryProps {
  totalPlanned: number
  totalActual: number
  completionRate: number
  totalChapters: number
  doneChapters: number
}

export function PlanSummary({
  totalPlanned,
  totalActual,
  completionRate,
  totalChapters,
  doneChapters,
}: PlanSummaryProps) {
  const stats = [
    { icon: Clock, label: 'Planned', value: `${Math.round(totalPlanned / 60)}h ${totalPlanned % 60}m`, color: 'text-indigo-500' },
    { icon: Target, label: 'Studied', value: `${Math.round(totalActual / 60)}h ${totalActual % 60}m`, color: 'text-emerald-500' },
    { icon: CheckCircle, label: 'Done', value: `${doneChapters}/${totalChapters}`, color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
            <stat.icon className={`mx-auto h-5 w-5 ${stat.color}`} />
            <div className="mt-1 text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {totalChapters > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-gray-100" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.5" fill="none"
                  className="stroke-indigo-500"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={Math.PI * 31}
                  strokeDashoffset={Math.PI * 31 * (1 - Math.min(completionRate, 100) / 100)}
                />
              </svg>
              <span className="absolute text-xs font-bold text-gray-700">{Math.round(completionRate)}%</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Completion</div>
              <div className="text-xs text-gray-500">{doneChapters} of {totalChapters} chapters done</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
