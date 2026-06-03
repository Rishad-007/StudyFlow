import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTimerStore } from '@/stores/timerStore'
import { useNotifications } from '@/hooks/useNotifications'
import { useReminders } from '@/hooks/useReminders'
import { SettingCard } from '@/components/settings/SettingCard'
import { SettingToggle } from '@/components/settings/SettingToggle'
import { NotificationPrompt } from '@/components/shared/NotificationPrompt'
import { PageHeader } from '@/components/shared/PageHeader'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { MonitorSmartphone } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, loading, fetchSettings, updateSettings, updateProfile, exportData, deleteAccount } =
    useSettingsStore()
  const { setPomodoroWork, setPomodoroBreak } = useTimerStore()
  const { requestPermission, sendNotification } = useNotifications()
  const { scheduleDailyReminder, cancelDailyReminder } = useReminders()

  const [showPrompt, setShowPrompt] = useState(false)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [pomoWork, setPomoWork] = useState(25)
  const [pomoBreak, setPomoBreak] = useState(5)
  const [reminderTime, setReminderTime] = useState('18:00')
  const [emailReminders, setEmailReminders] = useState(true)
  const [browserNotifs, setBrowserNotifs] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const pwa = usePWAInstall()

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (settings && !loaded) {
      setFullName(user?.user_metadata?.full_name ?? '')
      setPomoWork(settings.pomodoro_work_min)
      setPomoBreak(settings.pomodoro_break_min)
      setReminderTime(settings.reminder_time ?? '18:00')
      setEmailReminders(settings.email_reminders)
      setBrowserNotifs(settings.browser_notifications)
      setPomodoroWork(settings.pomodoro_work_min)
      setPomodoroBreak(settings.pomodoro_break_min)
      setLoaded(true)

      if (settings.browser_notifications && Notification.permission === 'default') {
        setShowPrompt(true)
      }
    }
  }, [settings])

  const handleProfileSave = async () => {
    await updateProfile({ fullName: fullName || undefined, avatarUrl: avatarUrl || undefined })
  }

  const handleTimerSave = async () => {
    await updateSettings({
      pomodoro_work_min: pomoWork,
      pomodoro_break_min: pomoBreak,
    })
    setPomodoroWork(pomoWork)
    setPomodoroBreak(pomoBreak)
  }

  const handleNotificationSave = async () => {
    await updateSettings({
      reminder_time: reminderTime,
      email_reminders: emailReminders,
      browser_notifications: browserNotifs,
    })
    if (reminderTime) {
      cancelDailyReminder()
      scheduleDailyReminder(reminderTime)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Settings" description="Manage your profile, preferences, and data" />

      {/* Profile */}
      <SettingCard title="Profile" description="Your personal information">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Display name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Save Profile
          </button>
        </div>
      </SettingCard>

      {/* Timer Settings */}
      <SettingCard title="Timer Settings" description="Configure your Pomodoro timer">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Work duration: {pomoWork} min
            </label>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={pomoWork}
              onChange={(e) => setPomoWork(Number(e.target.value))}
              className="mt-1 w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>15m</span>
              <span>60m</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Break duration: {pomoBreak} min
            </label>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={pomoBreak}
              onChange={(e) => setPomoBreak(Number(e.target.value))}
              className="mt-1 w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>3m</span>
              <span>30m</span>
            </div>
          </div>
          <button
            onClick={handleTimerSave}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Save Timer Settings
          </button>
        </div>
      </SettingCard>

      {/* Notifications */}
      <SettingCard title="Notifications" description="Control how and when you get reminded">
        <div className="space-y-4">
          <SettingToggle
            label="Browser notifications"
            description="Get notifications for timer events and reminders"
            checked={browserNotifs}
            onChange={async (v) => {
              if (v && Notification.permission === 'default') {
                setShowPrompt(true)
              }
              setBrowserNotifs(v)
            }}
          />

          <SettingToggle
            label="Email reminders"
            description="Receive daily email summaries and reminders"
            checked={emailReminders}
            onChange={setEmailReminders}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Daily reminder time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleNotificationSave}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Save Notification Settings
          </button>

          <button
            onClick={() => sendNotification('Test Notification', { body: 'If you see this, notifications are working!' })}
            className="text-sm text-indigo-600 hover:underline"
          >
            Test Notification
          </button>
        </div>
      </SettingCard>

      {/* Appearance */}
      <SettingCard title="Appearance" description="Customize the look and feel">
        <div className="space-y-2">
          <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="theme" value="light" defaultChecked className="text-indigo-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Light</div>
              <div className="text-xs text-gray-500">Always light mode</div>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="theme" value="dark" className="text-indigo-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">Dark</div>
              <div className="text-xs text-gray-500">Always dark mode</div>
            </div>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="theme" value="system" className="text-indigo-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">System</div>
              <div className="text-xs text-gray-500">Follow your system preference</div>
            </div>
          </label>
        </div>
      </SettingCard>

      {/* Install App */}
      <SettingCard title="App" description="Install StudyFlow on your device">
        <div className="flex items-center gap-3">
          <MonitorSmartphone className="h-8 w-8 shrink-0 text-indigo-500" />
          <div className="flex-1">
            {pwa.isInstalled ? (
              <p className="text-sm font-medium text-emerald-600">App is installed</p>
            ) : pwa.canInstall && !pwa.dismissed ? (
              <>
                <p className="text-sm font-medium text-gray-800">Install StudyFlow</p>
                <p className="text-xs text-gray-500">Use it offline, track anywhere.</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={pwa.install}
                    className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-600"
                  >
                    Install
                  </button>
                  <button
                    onClick={pwa.dismiss}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Not now
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-800">Install StudyFlow</p>
                <p className="text-xs text-gray-500">
                  {/iphone|ipad|ipod/i.test(navigator.userAgent) && !pwa.isInstalled
                    ? 'Tap the Share button in Safari, then "Add to Home Screen".'
                    : 'Open in Chrome or Edge and look for "Install" in the menu.'}
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem('studyflow-pwa-dismissed')
                    window.location.reload()
                  }}
                  className="mt-2 text-xs text-indigo-500 hover:underline"
                >
                  Show install prompt again
                </button>
              </>
            )}
          </div>
        </div>
      </SettingCard>

      {/* Data */}
      <SettingCard title="Data" description="Export or delete your data">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={exportData}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Export Data (JSON)
          </button>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Are you sure?</span>
              <button
                onClick={async () => {
                  await deleteAccount()
                  setDeleteConfirm(false)
                }}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </SettingCard>

      {/* About */}
      <SettingCard title="About">
        <div className="space-y-1 text-sm text-gray-600">
          <p>StudyFlow v0.1.0</p>
          <p>Built with React + TypeScript + Supabase</p>
          <p className="text-xs text-gray-400">
            StudyFlow helps you track, plan, and analyze your daily study sessions.
          </p>
        </div>
      </SettingCard>

      {/* Notification Prompt */}
      {showPrompt && (
        <NotificationPrompt
          onEnable={async () => {
            const granted = await requestPermission()
            if (granted) {
              setBrowserNotifs(true)
              await updateSettings({ browser_notifications: true })
            }
            return granted
          }}
          onDismiss={() => setShowPrompt(false)}
          onNeverAsk={() => {
            setShowPrompt(false)
            setBrowserNotifs(false)
          }}
        />
      )}
    </div>
  )
}
