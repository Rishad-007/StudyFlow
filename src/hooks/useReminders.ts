import { useRef, useCallback, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'

interface UseRemindersReturn {
  scheduleDailyReminder: (time: string) => void
  cancelDailyReminder: () => void
  checkForReminderTime: () => void
  requestEmailReminder: () => Promise<void>
}

export function useReminders(): UseRemindersReturn {
  const { sendDailyReminder } = useNotifications()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const notifiedTodayRef = useRef(false)

  const cancelDailyReminder = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const checkForReminderTime = useCallback(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return currentStr
  }, [])

  const scheduleDailyReminder = useCallback(
    (time: string) => {
      cancelDailyReminder()

      // Reset notified flag at midnight
      const now = new Date()
      const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime()

      setTimeout(() => {
        notifiedTodayRef.current = false
      }, msUntilMidnight)

      // Check every 30 seconds if it's reminder time
      intervalRef.current = setInterval(() => {
        const current = checkForReminderTime()
        if (current === time && !notifiedTodayRef.current) {
          sendDailyReminder()
          notifiedTodayRef.current = true
        }
      }, 30000)
    },
    [cancelDailyReminder, checkForReminderTime, sendDailyReminder],
  )

  const requestEmailReminder = useCallback(async () => {
    // Future: call Supabase Edge Function to schedule email
    console.log('Email reminder requested (not yet implemented)')
  }, [])

  useEffect(() => {
    return () => cancelDailyReminder()
  }, [cancelDailyReminder])

  return {
    scheduleDailyReminder,
    cancelDailyReminder,
    checkForReminderTime,
    requestEmailReminder,
  }
}
