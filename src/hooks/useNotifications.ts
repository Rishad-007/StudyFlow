import { useCallback } from 'react'
import toast from 'react-hot-toast'

interface UseNotificationsReturn {
  permission: NotificationPermission
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, options?: NotificationOptions) => void
  sendTimerComplete: (sessionType: string, duration: string) => void
  sendBreakReminder: () => void
  sendDailyReminder: () => void
}

export function useNotifications(): UseNotificationsReturn {
  const permission = typeof Notification !== 'undefined' ? Notification.permission : 'denied'

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    try {
      new Notification(title, options)
    } catch {
      // Silently fail — some browsers block from non-secure contexts
    }
  }, [])

  const sendTimerComplete = useCallback(
    (sessionType: string, duration: string) => {
      const title = `${sessionType === 'pomodoro' ? 'Pomodoro' : 'Free Study'} Complete!`
      const body = `You studied for ${duration}. Great work!`
      sendNotification(title, { body, icon: '/favicon.svg' })
      toast.success(body)
    },
    [sendNotification],
  )

  const sendBreakReminder = useCallback(() => {
    sendNotification('Break time over!', { body: 'Time to focus and start your next session.', icon: '/favicon.svg' })
    toast('Break time over! Time to focus.', { icon: '⏰' })
  }, [sendNotification])

  const sendDailyReminder = useCallback(() => {
    sendNotification('Daily Study Reminder', {
      body: "Don't forget to update your study progress for today!",
      icon: '/favicon.svg',
    })
    toast('Time to update your daily progress!', { icon: '📚', duration: 8000 })
  }, [sendNotification])

  return {
    permission,
    requestPermission,
    sendNotification,
    sendTimerComplete,
    sendBreakReminder,
    sendDailyReminder,
  }
}
