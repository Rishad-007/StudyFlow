import { useNavigate } from 'react-router-dom'
import { useSubjectStore } from '@/stores/subjectStore'
import { Timer, Coffee, Target } from 'lucide-react'
import type { StudySession } from '@/types'

interface RecentSessionsProps {
  sessions: StudySession[]
  subjectNames: Record<string, string>
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function RecentSessions({ sessions, subjectNames }: RecentSessionsProps) {
  const navigate = useNavigate()
  const subjects = useSubjectStore((s) => s.subjects)

  const subjectColor = (id: string | null) => subjects.find((s) => s.id === id)?.color ?? '#6366f1'

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <h3 className="mb-2 text-base font-semibold text-gray-900">Recent Sessions</h3>
        <div className="flex flex-col items-center py-4 text-center">
          <Target className="mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">No sessions yet.</p>
          <button
            onClick={() => navigate('/timer')}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Start studying
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <h3 className="mb-3 text-base font-semibold text-gray-900">Recent Sessions</h3>
      <div className="space-y-1">
        {sessions.map((session) => {
          const Icon = session.session_type === 'pomodoro' ? Coffee : Timer
          return (
            <button
              key={session.id}
              onClick={() => navigate('/analytics')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-50"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${subjectColor(session.subject_id)}15` }}
              >
                <Icon className="h-4 w-4" style={{ color: subjectColor(session.subject_id) }} />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-700">
                {session.subject_id
                  ? (subjectNames[session.subject_id] ?? 'Unknown')
                  : 'No subject'}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {session.duration_seconds ? formatDuration(session.duration_seconds) : '—'}
              </span>
              <span className="text-xs text-gray-400">
                {session.ended_at ? timeAgo(session.ended_at) : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
