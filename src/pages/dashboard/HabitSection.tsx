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
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Habits</h3>
          {visible.length > 0 && (
            <p className="text-xs text-gray-400">
              {doneToday}/{visible.length} done today
            </p>
          )}
        </div>
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {showInput && (
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Habit name..."
            className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            autoFocus
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="rounded-lg bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="py-4 text-center text-xs text-gray-400">No habits yet. Add your first one!</p>
      ) : (
        <div className="space-y-1">
          {visible.map((habit) => {
            const isDone = habit.last_completed_date === today
            return (
              <div
                key={habit.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isDone ? 'bg-indigo-50' : 'hover:bg-gray-50',
                )}
              >
                <button
                  onClick={() => completeToday(habit.id)}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    isDone
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 hover:border-indigo-400',
                  )}
                >
                  {isDone && <Check className="h-4 w-4" />}
                </button>
                <span className={cn('flex-1 text-sm', isDone && 'text-gray-400 line-through')}>
                  {habit.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-orange-500">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="font-medium">{habit.streak_count ?? 0}</span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {habits.length > 5 && (
        <p className="mt-2 text-center text-xs text-gray-400">+{habits.length - 5} more habits</p>
      )}
    </div>
  )
}
