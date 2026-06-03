import { Play, Pause, Square, RotateCcw, SkipForward } from 'lucide-react'

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused'
  pomodoroSession?: 'work' | 'break'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSkipBreak?: () => void
  onReset?: () => void
}

export function TimerControls({
  status,
  pomodoroSession,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkipBreak,
  onReset,
}: TimerControlsProps) {
  const isBreak = pomodoroSession === 'break'

  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-xl active:scale-95 sm:px-8 sm:py-4 sm:text-base"
        >
          <Play className="h-5 w-5 fill-white shrink-0" />
          Start Session
        </button>
        <p className="text-xs text-gray-400 text-center px-2">
          Focus for {25} min, then take a {5} min break
        </p>
      </div>
    )
  }

  if (isBreak && status === 'paused') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-500 hover:shadow-lg active:scale-95 sm:px-6 sm:py-3"
          >
            <Play className="h-4 w-4 fill-white shrink-0" />
            Resume Break
          </button>
          <button
            onClick={onSkipBreak}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95 sm:px-5 sm:py-3"
          >
            <SkipForward className="h-4 w-4 shrink-0" />
            Skip Break
          </button>
          <button
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-sm transition-all hover:bg-red-50 hover:shadow-md active:scale-95 sm:px-5 sm:py-3"
          >
            <Square className="h-4 w-4 shrink-0" />
            End
          </button>
        </div>
        <p className="text-xs text-amber-600 font-medium text-center px-2">
          Break paused — resume to continue or skip to start next focus session
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {status === 'running' && (
          <>
            <button
              onClick={onPause}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-500 hover:shadow-lg active:scale-95 sm:px-6 sm:py-3"
            >
              <Pause className="h-4 w-4 fill-white shrink-0" />
              Pause
            </button>
            <button
              onClick={onStop}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-sm transition-all hover:bg-red-50 hover:shadow-md active:scale-95 sm:px-5 sm:py-3"
            >
              <Square className="h-4 w-4 shrink-0" />
              End
            </button>
          </>
        )}
        {status === 'paused' && !isBreak && (
          <>
            <button
              onClick={onResume}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-600 hover:shadow-lg active:scale-95 sm:px-6 sm:py-3"
            >
              <Play className="h-4 w-4 fill-white shrink-0" />
              Resume
            </button>
            <button
              onClick={onStop}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-sm transition-all hover:bg-red-50 hover:shadow-md active:scale-95 sm:px-5 sm:py-3"
            >
              <Square className="h-4 w-4 shrink-0" />
              End
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:scale-95 sm:px-4 sm:py-3"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                Reset
              </button>
            )}
          </>
        )}
        {status === 'running' && isBreak && (
          <>
            <button
              onClick={onPause}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-amber-500 hover:shadow-lg active:scale-95 sm:px-6 sm:py-3"
            >
              <Pause className="h-4 w-4 fill-white shrink-0" />
              Pause Break
            </button>
            <button
              onClick={onStop}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 shadow-sm transition-all hover:bg-red-50 hover:shadow-md active:scale-95 sm:px-5 sm:py-3"
            >
              <Square className="h-4 w-4 shrink-0" />
              End
            </button>
          </>
        )}
      </div>
      {status === 'running' && (
        <p className="text-xs text-gray-400 text-center">Timer is running</p>
      )}
      {status === 'paused' && !isBreak && (
        <p className="text-xs text-gray-400 text-center">Session paused — resume anytime</p>
      )}
    </div>
  )
}
