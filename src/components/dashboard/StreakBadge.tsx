interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const months = Math.floor(streak / 30)
  const remaining = streak % 30
  const isComplete = streak > 0 && remaining === 0

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔥</span>
        <div className="text-center">
          {streak === 0 ? (
            <>
              <span className="text-3xl font-bold text-gray-300">0</span>
              <span className="ml-1.5 text-base font-medium text-gray-400">day streak</span>
            </>
          ) : isComplete ? (
            <>
              <span className="text-3xl font-bold text-indigo-600">{months}</span>
              <span className="ml-1.5 text-base font-medium text-gray-500">
                month{months > 1 ? 's' : ''}
              </span>
            </>
          ) : months > 0 ? (
            <>
              <span className="text-3xl font-bold text-gray-900">{streak}</span>
              <span className="ml-1.5 text-base font-medium text-gray-500">day streak</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold text-gray-900">{streak}</span>
              <span className="ml-1.5 text-base font-medium text-gray-500">day streak</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-[200px]">
        <div className="mb-1 flex items-center justify-between text-xs">
          {isComplete ? (
            <span className="font-medium text-indigo-600">Month complete! 🎉</span>
          ) : (
            <>
              <span className="text-gray-400">{remaining}/30 days</span>
              {months > 0 && <span className="text-gray-400">Month {months + 1}</span>}
            </>
          )}
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
            style={{ width: `${isComplete ? 100 : (remaining / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
