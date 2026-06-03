import { cn } from '@/lib/utils'

interface CircularTimerProps {
  elapsedSeconds: number
  totalSeconds: number
  mode: 'free' | 'pomodoro'
  pomodoroSession: 'work' | 'break'
  status: 'idle' | 'running' | 'paused'
  size?: number
}

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatLong(totalSec: number): string {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export function CircularTimer({
  elapsedSeconds,
  totalSeconds,
  mode,
  pomodoroSession,
  status,
  size = 280,
}: CircularTimerProps) {
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0
  const dashOffset = circumference * (1 - Math.min(progress, 1))
  const center = size / 2
  const strokeWidth = 8

  const isBreak = mode === 'pomodoro' && pomodoroSession === 'break'
  const trackColor = isBreak
    ? 'stroke-amber-200'
    : mode === 'pomodoro'
      ? 'stroke-emerald-200'
      : 'stroke-indigo-200'
  const progressColor = isBreak
    ? 'stroke-amber-500'
    : mode === 'pomodoro'
      ? 'stroke-emerald-500'
      : 'stroke-indigo-500'

  const display =
    mode === 'free' ? formatLong(elapsedSeconds) : formatTime(elapsedSeconds)

  const label = isBreak ? 'Break' : mode === 'pomodoro' ? 'Focus' : 'Study'

  return (
    <div className="relative flex w-full max-w-[280px] items-center justify-center">
      <svg
        width={size}
        height={size}
        className={cn(
          'h-auto w-full drop-shadow-sm transition-transform',
          status === 'running' && 'scale-[1.02]',
        )}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={cn(progressColor, 'transition-all duration-700 ease-linear')}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-medium uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <span className="mt-1 text-4xl font-bold text-gray-900 tabular-nums">
          {display}
        </span>
        {mode === 'free' && status === 'idle' && (
          <span className="mt-1 text-xs text-gray-400">Ready</span>
        )}
        {status === 'paused' && (
          <span className="mt-1 text-xs font-medium text-amber-500">Paused</span>
        )}
      </div>
    </div>
  )
}
