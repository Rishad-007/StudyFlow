import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Subject } from '@/types'

interface AddSubjectModalProps {
  open: boolean
  subjects: Subject[]
  onClose: () => void
  onSave: (subjectId: string, plannedMinutes: number) => Promise<void>
}

export function AddSubjectModal({ open, subjects, onClose, onSave }: AddSubjectModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [plannedMinutes, setPlannedMinutes] = useState(60)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleSave = async () => {
    if (!selectedSubjectId) return
    setSaving(true)
    await onSave(selectedSubjectId, plannedMinutes)
    setSaving(false)
    setSelectedSubjectId(null)
    setPlannedMinutes(60)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-in zoom-in-95 relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Subject</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Choose a subject and set planned minutes</p>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Subject</label>
          <div className="max-h-44 space-y-0.5 overflow-y-auto">
            {subjects.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No subjects yet. Add them in the Subjects page first.
              </p>
            ) : (
              subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    selectedSubjectId === sub.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="flex-1 text-sm font-medium">{sub.name}</span>
                  {selectedSubjectId === sub.id && (
                    <span className="text-xs text-indigo-500">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Planned minutes</label>
          <input
            type="number"
            min={1}
            value={plannedMinutes}
            onChange={(e) => setPlannedMinutes(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedSubjectId || saving}
            className="flex-1 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add to Plan'}
          </button>
        </div>
      </div>
    </div>
  )
}
