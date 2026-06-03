import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'

const QUEUE_KEY = 'studyflow-offline-queue'

interface QueuedMutation {
  id: number
  type: string
  table: string
  data: Record<string, unknown>
  timestamp: number
}

interface OfflineSyncState {
  isOnline: boolean
  pendingChanges: number
  syncNow: () => Promise<void>
}

export function useOfflineSync(): OfflineSyncState {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingChanges, setPendingChanges] = useState(0)

  const updatePendingCount = useCallback(() => {
    try {
      const raw = localStorage.getItem(QUEUE_KEY)
      const queue: QueuedMutation[] = raw ? JSON.parse(raw) : []
      setPendingChanges(queue.length)
    } catch {
      setPendingChanges(0)
    }
  }, [])

  const syncNow = useCallback(async () => {
    if (!navigator.onLine) return

    let raw: string | null
    try {
      raw = localStorage.getItem(QUEUE_KEY)
    } catch {
      return
    }
    if (!raw) return

    const queue: QueuedMutation[] = JSON.parse(raw)
    const remaining: QueuedMutation[] = []

    for (const mutation of queue) {
      const { error } = await supabase
        .from(mutation.table)
        .insert(mutation.data as any)

      if (error) {
        remaining.push(mutation)
      }
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining))
    updatePendingCount()
  }, [updatePendingCount])

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true)
      await syncNow()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    updatePendingCount()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncNow, updatePendingCount])

  return { isOnline, pendingChanges, syncNow }
}

export function enqueueMutation(table: string, data: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    const queue: QueuedMutation[] = raw ? JSON.parse(raw) : []
    queue.push({
      id: Date.now(),
      type: 'insert',
      table,
      data,
      timestamp: Date.now(),
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    // Silently fail — localStorage might be full
  }
}
