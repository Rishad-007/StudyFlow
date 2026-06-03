import { useEffect, useState } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { Check, Flame, Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function HabitSection() {
  const { habits, loading, fetchHabits, addHabit, deleteHabit, completeToday } = useHabitStore()
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    fetchHabits()
  }, [])

  const today = format(new Date(), 'yyyy-MM-dd')
  const visible = habits.slice(0, 5)
  const doneToday = visible.filter((h) => h.last_completed_date === today).length

  const handleAdd = async () => {
    if (!name.trim()) return
    await addHabit(name.trim())
    setName('')
    setShowInput(false)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Habits</h3>
          {visible.length > 0 && (
            <p className="text-xs text-gray-400">
              {doneToday}/{visible.length} done today
            </p>
          )}
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {showInput && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Habit name..."
            className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <p className="text-sm text-gray-400">No habits yet.</p>
          <p className="text-xs text-gray-400">Build your first habit.</p>
          <button
            onClick={() => setShowInput(true)}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Habit
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {visible.map((habit) => {
            const isDone = habit.last_completed_date === today
            return (
              <div
                key={habit.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 transition-colors',
                  isDone ? 'bg-indigo-50' : 'hover:bg-gray-50',
                )}
              >
                <button
                  onClick={() => completeToday(habit.id)}
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 transition-all',
                    isDone
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 hover:border-indigo-400',
                  )}
                >
                  {isDone && <Check className="h-5 w-5" />}
                </button>
                <span className={cn('flex-1 text-sm font-medium', isDone && 'text-gray-400 line-through')}>
                  {habit.name}
                </span>
                <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-600">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="font-semibold">{habit.streak_count ?? 0}</span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {habits.length > 5 && (
        <p className="mt-3 text-center text-xs text-gray-400">+{habits.length - 5} more habits</p>
      )}
    </div>
  )
}
