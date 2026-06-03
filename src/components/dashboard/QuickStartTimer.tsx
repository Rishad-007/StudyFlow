import { useNavigate } from 'react-router-dom'
import { useTimerStore } from '@/stores/timerStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { Timer, Coffee, Play } from 'lucide-react'

interface QuickStartTimerProps {
  recentSubjects: { subjectId: string; subjectName: string }[]
}

export function QuickStartTimer({ recentSubjects }: QuickStartTimerProps) {
  const navigate = useNavigate()
  const setSubject = useTimerStore((s) => s.setSubject)
  const setMode = useTimerStore((s) => s.setMode)
  const subjects = useSubjectStore((s) => s.subjects)

  const startWith = (subjectId: string | null, mode: 'free' | 'pomodoro') => {
    if (subjectId) setSubject(subjectId)
    setMode(mode)
    navigate('/timer')
  }

  const subjectColor = (id: string) => subjects.find((s) => s.id === id)?.color ?? '#6366f1'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Quick Start</h3>

      {recentSubjects.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Study again</p>
          {recentSubjects.map((item, i) => (
            <button
              key={i}
              onClick={() => startWith(item.subjectId, 'free')}
              className="flex w-full items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 text-sm text-gray-700 transition-all hover:border-gray-200 hover:bg-gray-50 active:scale-[0.99]"
            >
              <div className="flex h-4 w-4 items-center justify-center">
                <Play className="h-3 w-3" style={{ color: subjectColor(item.subjectId) }} />
              </div>
              <span>{item.subjectName}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => startWith(null, 'free')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-500 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-600 active:scale-[0.98]"
        >
          <Timer className="h-5 w-5" />
          Free Study
        </button>
        <button
          onClick={() => startWith(null, 'pomodoro')}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-[0.98]"
        >
          <Coffee className="h-5 w-5" />
          Pomodoro
        </button>
      </div>
    </div>
  )
}
