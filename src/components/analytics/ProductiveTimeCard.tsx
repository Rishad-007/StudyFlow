import { memo } from 'react'
import { Sun, Clock } from 'lucide-react'

interface ProductiveTimeCardProps {
  productiveHour: number
  productiveDay: number
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const ProductiveTimeCard = memo(function ProductiveTimeCard({
  productiveHour,
  productiveDay,
}: ProductiveTimeCardProps) {
  const isNight = productiveHour < 6 || productiveHour >= 18

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Productivity Insights</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <Sun className={`h-5 w-5 ${isNight ? 'text-indigo-400' : 'text-amber-500'}`} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">
              {String(productiveHour).padStart(2, '0')}:00
            </div>
            <div className="text-xs text-gray-500">Most active hour</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <Clock className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">{DAYS[productiveDay]}</div>
            <div className="text-xs text-gray-500">Most active day</div>
          </div>
        </div>
      </div>
    </div>
  )
})
