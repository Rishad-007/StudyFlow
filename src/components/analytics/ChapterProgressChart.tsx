import { memo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

export interface ChapterProgressItem {
  chapter: string
  subject: string
  progress: number
}

interface ChapterProgressChartProps {
  data: ChapterProgressItem[]
  subjectColors: Record<string, string>
}

export const ChapterProgressChart = memo(function ChapterProgressChart({
  data,
  subjectColors,
}: ChapterProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-gray-400">
        No chapters yet
      </div>
    )
  }

  const sorted = [...data].sort((a, b) => a.progress - b.progress)

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 40, left: 80, bottom: 4 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="chapter"
            type="category"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Bar dataKey="progress" radius={[0, 4, 4, 0]} maxBarSize={16}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={subjectColors[entry.subject] ?? '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
})
