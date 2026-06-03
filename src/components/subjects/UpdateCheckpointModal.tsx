import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Chapter } from '@/types'

interface UpdateCheckpointModalProps {
  open: boolean
  chapter: Chapter | null
  onClose: () => void
  onSave: (id: string, progressPct: number, checkpointText?: string) => Promise<void>
}

export function UpdateCheckpointModal({
  open,
  chapter,
  onClose,
  onSave,
}: UpdateCheckpointModalProps) {
  const [progress, setProgress] = useState(0)
  const [checkpointText, setCheckpointText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (chapter) {
      setProgress(chapter.progress_pct)
      setCheckpointText(chapter.checkpoint_text ?? '')
    }
  }, [chapter])

  if (!open || !chapter) return null

  const handleSave = async () => {
    setSaving(true)
    await onSave(chapter.id, progress, checkpointText || undefined)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Update Progress</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">
          Chapter: <span className="font-medium text-gray-800">{chapter.name}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Progress: {progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="mt-2 w-full accent-indigo-500"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Checkpoint note
            </label>
            <textarea
              value={checkpointText}
              onChange={(e) => setCheckpointText(e.target.value)}
              placeholder="Completed 40%, Understood Derivatives, Struggling with Integration..."
              rows={3}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
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
