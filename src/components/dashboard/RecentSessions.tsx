import { useNavigate } from 'react-router-dom'
import { Timer, Coffee } from 'lucide-react'
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

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Recent Sessions</h3>
        <p className="text-sm text-gray-400">No sessions yet. Start studying!</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Recent Sessions</h3>
      <div className="space-y-2">
        {sessions.map((session) => {
          const Icon = session.session_type === 'pomodoro' ? Coffee : Timer
          return (
            <button
              key={session.id}
              onClick={() => navigate('/analytics')}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
            >
              <Icon className="h-4 w-4 text-indigo-400" />
              <span className="flex-1 text-left text-sm text-gray-700">
                {session.subject_id
                  ? subjectNames[session.subject_id] ?? 'Unknown'
                  : 'No subject'}
              </span>
              <span className="text-xs text-gray-400">
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
