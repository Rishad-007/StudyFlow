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
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <stat.icon className={`mx-auto h-5 w-5 ${stat.color}`} />
            <div className="mt-1 text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {totalChapters > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(completionRate)}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
