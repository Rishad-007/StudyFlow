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

export function CircularTimer({
  elapsedSeconds,
  totalSeconds,
  pomodoroSession,
  status,
  size = 320,
}: CircularTimerProps) {
  const radius = 130
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0
  const dashOffset = circumference * (1 - Math.min(progress, 1))
  const center = size / 2
  const strokeWidth = 10

  const isBreak = pomodoroSession === 'break'
  const trackColor = isBreak ? 'stroke-amber-200' : 'stroke-emerald-200'
  const progressColor = isBreak ? 'stroke-amber-500' : 'stroke-emerald-500'

  const display = formatTime(elapsedSeconds)
  const label = isBreak ? 'Break' : 'Focus Time'

  return (
    <div className="relative flex w-full max-w-[280px] items-center justify-center sm:max-w-[320px]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn(
          'h-auto w-full drop-shadow-sm transition-all duration-500',
          status === 'running' && 'scale-[1.03] drop-shadow-lg',
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
        <span className="mt-1 text-4xl font-bold text-gray-900 tabular-nums tracking-tight sm:text-5xl">
          {display}
        </span>
        {status === 'idle' && (
          <span className="mt-1.5 text-xs text-gray-400">Ready to focus</span>
        )}
        {status === 'paused' && (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Paused
          </span>
        )}
        {status === 'running' && pomodoroSession === 'work' && totalSeconds > 0 && (
          <span className="mt-1.5 text-xs font-medium text-emerald-600">
            {Math.max(0, Math.ceil((totalSeconds - elapsedSeconds) / 60))} min remaining
          </span>
        )}
      </div>
    </div>
  )
}
