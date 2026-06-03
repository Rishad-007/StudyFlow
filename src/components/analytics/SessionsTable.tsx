import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { Search, Timer, Coffee } from 'lucide-react'
import type { StudySession } from '@/types'

interface SessionsTableProps {
  sessions: StudySession[]
  subjectNames: Record<string, string>
  chapterNames: Record<string, string>
}

export function SessionsTable({ sessions, subjectNames, chapterNames }: SessionsTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const perPage = 10

  const filtered = useMemo(() => {
    if (!search.trim()) return sessions
    const q = search.toLowerCase()
    return sessions.filter((s) => {
      const sub = subjectNames[s.subject_id ?? '']?.toLowerCase() ?? ''
      const ch = chapterNames[s.chapter_id ?? '']?.toLowerCase() ?? ''
      return sub.includes(q) || ch.includes(q)
    })
  }, [sessions, search])

  const pageCount = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice(page * perPage, (page + 1) * perPage)

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">
        No completed sessions in this period
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
            placeholder="Search by subject or chapter..."
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-500">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Chapter</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">
                  {session.started_at ? format(parseISO(session.started_at), 'MMM d, HH:mm') : '—'}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {session.duration_seconds
                    ? `${Math.floor(session.duration_seconds / 60)}m`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {session.subject_id ? subjectNames[session.subject_id] ?? 'Unknown' : '—'}
                </td>
                <td className="hidden px-4 py-3 text-gray-500 md:table-cell">
                  {session.chapter_id ? chapterNames[session.chapter_id] ?? '—' : '—'}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {session.session_type === 'pomodoro' ? (
                      <Coffee className="h-3 w-3" />
                    ) : (
                      <Timer className="h-3 w-3" />
                    )}
                    {session.session_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {pageCount}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
              disabled={page >= pageCount - 1}
              className="rounded px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
