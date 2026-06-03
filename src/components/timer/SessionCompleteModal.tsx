import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SessionCompleteModalProps {
  open: boolean
  durationSeconds: number
  subjectName: string | null
  onSave: (notes: string) => Promise<void>
  onDiscard: () => void
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function SessionCompleteModal({
  open,
  durationSeconds,
  subjectName,
  onSave,
  onDiscard,
}: SessionCompleteModalProps) {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setNotes('')
  }, [open])

  if (!open) return null

  const handleSave = async () => {
    setSaving(true)
    await onSave(notes)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full rounded-t-xl bg-white p-6 shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-lg">🎉</span>
            </span>
            <h2 className="text-lg font-semibold text-gray-900">Session Complete</h2>
          </div>
          <button onClick={onDiscard} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium text-gray-900">
              {formatDuration(durationSeconds)}
            </span>
          </div>
          {subjectName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subject</span>
              <span className="font-medium text-gray-900">{subjectName}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Session notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this session go?"
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onDiscard}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
