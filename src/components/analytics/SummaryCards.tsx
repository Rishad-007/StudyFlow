import { Clock, PlayCircle, Sun } from 'lucide-react'
import { formatDuration } from '@/utils/analytics'

interface SummaryCardsProps {
  totalTime: number
  totalSessions: number
  productiveHour: number
}

export function SummaryCards({ totalTime, totalSessions, productiveHour }: SummaryCardsProps) {
  const cards = [
    {
      icon: Clock,
      label: 'Total Time',
      value: formatDuration(totalTime),
      color: 'text-indigo-500',
    },
    {
      icon: PlayCircle,
      label: 'Sessions',
      value: String(totalSessions),
      color: 'text-emerald-500',
    },
    {
      icon: Sun,
      label: 'Most Productive',
      value: `${productiveHour}:00`,
      sub: 'on average',
      color: 'text-amber-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">{card.value}</div>
          <div className="text-sm text-gray-500">{card.label}</div>
          {card.sub && <div className="text-xs text-gray-400">{card.sub}</div>}
        </div>
      ))}
    </div>
  )
}
