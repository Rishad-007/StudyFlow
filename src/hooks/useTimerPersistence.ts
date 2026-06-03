import { useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'

export function useTimerPersistence() {
  const loadTimerState = useTimerStore((s) => s.loadTimerState)

  useEffect(() => {
    loadTimerState()
  }, [loadTimerState])
}
