import { SOUND_OPTIONS } from '@/hooks/useAmbientSound'
import { cn } from '@/lib/utils'
import { Volume2, VolumeX } from 'lucide-react'

interface AmbientSoundSelectorProps {
  currentSound: string | null
  volume: number
  isPlaying: boolean
  onSelect: (soundId: string | null) => void
  onVolumeChange: (volume: number) => void
  onStop: () => void
}

export function AmbientSoundSelector({
  currentSound,
  volume,
  isPlaying,
  onSelect,
  onVolumeChange,
  onStop,
}: AmbientSoundSelectorProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ambient Sounds</h3>
        {currentSound && (
          <button
            onClick={onStop}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Stop
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SOUND_OPTIONS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onSelect(currentSound === sound.id ? null : sound.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors sm:p-2.5',
              currentSound === sound.id
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
            )}
            title={sound.label}
          >
            <span className="text-xl sm:text-lg">{sound.emoji}</span>
            <span className="text-xs font-medium leading-tight sm:text-[10px]">{sound.label}</span>
          </button>
        ))}
      </div>

      {currentSound && (
        <div className="mt-3 flex items-center gap-2">
          {isPlaying && volume === 0 ? (
            <VolumeX className="h-4 w-4 text-gray-400" />
          ) : (
            <Volume2 className="h-4 w-4 text-gray-400" />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-500 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-sm"
          />
        </div>
      )}
    </div>
  )
}
