import { useState, useEffect } from 'react'
import { Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionReflectionProps {
  open: boolean
  subjectName: string | null
  chapterName: string | null
  onSave: (data: ReflectionData) => Promise<void>
  onSkip: () => void
  onClose: () => void
}

export interface ReflectionData {
  rating: number
  mood: string
  takeaways: string
  difficulties: string
  tomorrowFocus: string
}

const MOODS = [
  { emoji: '🔥', label: 'Focused' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Tired' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '💪', label: 'Motivated' },
]

export function SessionReflection({ open, subjectName, chapterName, onSave, onSkip, onClose }: SessionReflectionProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [mood, setMood] = useState('')
  const [takeaways, setTakeaways] = useState('')
  const [difficulties, setDifficulties] = useState('')
  const [tomorrowFocus, setTomorrowFocus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setRating(0)
      setMood('')
      setTakeaways('')
      setDifficulties('')
      setTomorrowFocus('')
    }
  }, [open])

  const handleSave = async () => {
    setSaving(true)
    await onSave({ rating, mood, takeaways, difficulties, tomorrowFocus })
    setSaving(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full rounded-t-xl bg-white p-6 shadow-xl sm:mx-auto sm:max-w-md sm:rounded-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Session Reflection</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {(subjectName || chapterName) && (
          <p className="mb-4 text-sm text-gray-500">
            {subjectName}{chapterName ? ` — ${chapterName}` : ''}
          </p>
        )}

        {/* Rating */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">How was this session?</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="rounded p-1 transition-colors hover:bg-yellow-50"
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition-colors',
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300',
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">How are you feeling?</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition-colors',
                  mood === m.label
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300',
                )}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Takeaways */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Key takeaways</label>
          <textarea
            value={takeaways}
            onChange={(e) => setTakeaways(e.target.value)}
            placeholder="What did you learn?"
            rows={2}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Difficulties */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Difficulties faced</label>
          <textarea
            value={difficulties}
            onChange={(e) => setDifficulties(e.target.value)}
            placeholder="What was challenging?"
            rows={2}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Tomorrow's focus */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Tomorrow's focus</label>
          <textarea
            value={tomorrowFocus}
            onChange={(e) => setTomorrowFocus(e.target.value)}
            placeholder="What to study next?"
            rows={2}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onSkip}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Reflection'}
          </button>
        </div>
      </div>
    </div>
  )
}
