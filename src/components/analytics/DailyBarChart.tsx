import { memo, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { DailyTotal } from '@/utils/analytics'
import { generateUniqueColors } from '@/utils/colors'

interface DailyBarChartProps {
  data: DailyTotal[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-indigo-600">{payload[0].value}m studied</div>
    </div>
  )
}

export const DailyBarChart = memo(function DailyBarChart({ data }: DailyBarChartProps) {
  const colors = useMemo(() => generateUniqueColors(data.length), [data.length])

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
        No data for this period
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'MMM d'),
  }))

  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            unit="m"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
