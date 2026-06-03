import { Play, Pause, Square } from 'lucide-react'

interface TimerControlsProps {
  status: 'idle' | 'running' | 'paused'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {status === 'idle' && (
        <button
          onClick={onStart}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-600 active:scale-95"
        >
          <Play className="ml-0.5 h-7 w-7 fill-white" />
        </button>
      )}

      {status === 'running' && (
        <>
          <button
            onClick={onPause}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition-transform hover:scale-105 hover:bg-amber-500 active:scale-95"
          >
            <Pause className="h-6 w-6 fill-white" />
          </button>
          <button
            onClick={onStop}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-400 text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-500 active:scale-95"
          >
            <Square className="h-5 w-5 fill-white" />
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <button
            data-resume-timer
            onClick={onResume}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-600 active:scale-95"
          >
            <Play className="ml-0.5 h-6 w-6 fill-white" />
          </button>
          <button
            onClick={onStop}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-400 text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-500 active:scale-95"
          >
            <Square className="h-5 w-5 fill-white" />
          </button>
        </>
      )}
    </div>
  )
}
