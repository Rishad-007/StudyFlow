import { useState } from 'react'
import { Plus, Check, Trash2, ListTodo, ChevronDown, ChevronRight } from 'lucide-react'
import type { Todo } from '@/hooks/useTodos'
import { cn } from '@/lib/utils'

interface QuickTodoProps {
  todos: Todo[]
  onAdd: (text: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  sessionId?: string | null
  onLinkToSession?: (todoId: string, sessionId: string) => void
}

export function QuickTodo({ todos, onAdd, onToggle, onDelete, sessionId, onLinkToSession }: QuickTodoProps) {
  const [input, setInput] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  const pending = todos.filter((t) => !t.done)
  const done = todos.filter((t) => t.done)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input)
    setInput('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700"
      >
        <ListTodo className="h-4 w-4 text-indigo-500" />
        <span>Todo ({pending.length})</span>
        {collapsed ? <ChevronRight className="ml-auto h-4 w-4 text-gray-400" /> : <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="border-t border-gray-100 px-4 pb-3 pt-2">
          {todos.length === 0 && (
            <p className="py-3 text-center text-xs text-gray-400">No tasks yet. Add one below.</p>
          )}

          <div className="space-y-1">
            {pending.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                sessionId={sessionId}
                onLinkToSession={onLinkToSession}
              />
            ))}
            {done.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                sessionId={sessionId}
                onLinkToSession={onLinkToSession}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a task..."
              className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function TodoRow({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  sessionId?: string | null
  onLinkToSession?: (todoId: string, sessionId: string) => void
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50',
        todo.done && 'opacity-50',
      )}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 transition-colors',
          todo.done
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-gray-300 hover:border-indigo-400',
        )}
      >
        {todo.done && <Check className="h-4 w-4" />}
      </button>
      <span className={cn('flex-1 text-sm', todo.done && 'text-gray-400 line-through')}>{todo.text}</span>
      <button
        onClick={() => onDelete(todo.id)}
        className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
