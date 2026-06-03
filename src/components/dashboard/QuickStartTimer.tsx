import { useNavigate } from 'react-router-dom'
import { useTimerStore } from '@/stores/timerStore'
import { Play, Timer, Coffee } from 'lucide-react'

interface QuickStartTimerProps {
  recentSubjects: { subjectId: string; subjectName: string }[]
}

export function QuickStartTimer({ recentSubjects }: QuickStartTimerProps) {
  const navigate = useNavigate()
  const setSubject = useTimerStore((s) => s.setSubject)
  const setMode = useTimerStore((s) => s.setMode)

  const startWith = (
    subjectId: string | null,
    mode: 'free' | 'pomodoro',
  ) => {
    if (subjectId) setSubject(subjectId)
    setMode(mode)
    navigate('/timer')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Quick Start</h3>

      {recentSubjects.length > 0 && (
        <div className="mb-3 space-y-1.5">
          <p className="text-xs text-gray-400">Study again</p>
          {recentSubjects.map((item, i) => (
            <button
              key={i}
              onClick={() => startWith(item.subjectId, 'free')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Play className="h-3.5 w-3.5 text-indigo-400" />
              <span>{item.subjectName}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => startWith(null, 'free')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-500 py-3 text-sm font-medium text-white hover:bg-indigo-600"
        >
          <Timer className="h-4 w-4" />
          Free Study
        </button>
        <button
          onClick={() => startWith(null, 'pomodoro')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600"
        >
          <Coffee className="h-4 w-4" />
          Pomodoro
        </button>
      </div>
    </div>
  )
}
