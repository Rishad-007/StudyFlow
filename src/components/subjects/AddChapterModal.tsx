import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Subject } from '@/types'

interface AddChapterModalProps {
  open: boolean
  subjects: Subject[]
  preselectedSubjectId?: string
  onClose: () => void
  onSave: (subjectId: string, name: string) => Promise<void>
}

export function AddChapterModal({
  open,
  subjects,
  preselectedSubjectId,
  onClose,
  onSave,
}: AddChapterModalProps) {
  const [subjectId, setSubjectId] = useState(preselectedSubjectId ?? '')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setSubjectId(preselectedSubjectId ?? (subjects[0]?.id ?? ''))
      setName('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, preselectedSubjectId, subjects])

  if (!open) return null

  const handleSave = async () => {
    if (!name.trim() || !subjectId) return
    setSaving(true)
    await onSave(subjectId, name.trim())
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full rounded-t-xl bg-white p-6 shadow-xl sm:mx-auto sm:max-w-md sm:rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add Chapter</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {!preselectedSubjectId && subjects.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Chapter name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Limits & Continuity"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
            disabled={!name.trim() || saving}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
