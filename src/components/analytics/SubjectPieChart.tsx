import { memo, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { SubjectTime } from '@/utils/analytics'
import { generateUniqueColors } from '@/utils/colors'

interface SubjectPieChartProps {
  data: SubjectTime[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload as SubjectTime
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <div className="text-sm font-medium" style={{ color: item.color }}>
        {item.subject}
      </div>
      <div className="text-xs text-gray-500">{Math.round(item.minutes)}m</div>
    </div>
  )
}

export const SubjectPieChart = memo(function SubjectPieChart({ data }: SubjectPieChartProps) {
  const colors = useMemo(() => {
    const subjectColors = data.map((d) => d.color)
    const allSame = subjectColors.length > 1 && subjectColors.every((c) => c === subjectColors[0])
    if (allSame) {
      return generateUniqueColors(data.length)
    }
    return subjectColors
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
        No data for this period
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="minutes"
            nameKey="subject"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})
