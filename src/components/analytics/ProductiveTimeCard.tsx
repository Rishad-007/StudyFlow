import { Sun, Clock } from 'lucide-react'

interface ProductiveTimeCardProps {
  productiveHour: number
  productiveDay: number
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function ProductiveTimeCard({ productiveHour, productiveDay }: ProductiveTimeCardProps) {
  const isNight = productiveHour < 6 || productiveHour >= 18

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Productivity Insights</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Sun className={`h-5 w-5 ${isNight ? 'text-indigo-400' : 'text-amber-400'}`} />
          <div>
            <div className="text-sm font-medium text-gray-800">
              {productiveHour}:00
            </div>
            <div className="text-xs text-gray-500">Most active hour</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-indigo-400" />
          <div>
            <div className="text-sm font-medium text-gray-800">{DAYS[productiveDay]}</div>
            <div className="text-xs text-gray-500">Most active day</div>
          </div>
        </div>
      </div>
    </div>
  )
}
