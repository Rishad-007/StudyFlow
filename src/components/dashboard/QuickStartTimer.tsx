import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'

export function QuickStartTimer() {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate('/timer')}
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-12 py-5 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98]"
      >
        <Play className="h-6 w-6 fill-white" />
        Start Study
      </button>
    </div>
  )
}
