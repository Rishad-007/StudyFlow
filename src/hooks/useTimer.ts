import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/timerStore'

export function useTimer() {
  const status = useTimerStore((s) => s.status)
  const tick = useTimerStore((s) => s.tick)
  const loadTimerState = useTimerStore((s) => s.loadTimerState)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore persistent state on mount
  useEffect(() => {
    loadTimerState()
  }, [loadTimerState])

  // Tick interval
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [status, tick])
}
