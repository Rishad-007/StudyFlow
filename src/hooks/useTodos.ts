import { useState, useEffect, useCallback } from 'react'

export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
  linkedSessionId?: string
}

const STORAGE_KEY = 'studyflow-todos'

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Todo[]
  } catch {
    return []
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const addTodo = useCallback((text: string) => {
    if (!text.trim()) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: text.trim(), done: false, createdAt: new Date().toISOString() },
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const linkToSession = useCallback((todoId: string, sessionId: string) => {
    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, linkedSessionId: sessionId } : t)))
  }, [])

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  return { todos, addTodo, toggleTodo, deleteTodo, linkToSession, clearDone }
}
