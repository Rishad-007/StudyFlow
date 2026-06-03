import { useState } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { useTimer } from '@/hooks/useTimer'
import { supabase } from '@/services/supabase'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SubjectChapterSelector } from '@/components/timer/SubjectChapterSelector'
import { SessionCompleteModal } from '@/components/timer/SessionCompleteModal'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Headphones } from 'lucide-react'

export default function TimerPage() {
  useTimer()
  useSubjects()

  const s = useTimerStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)

  const [completeOpen, setCompleteOpen] = useState(false)

  const chapter = chapters.find((ch) => ch.id === s.selectedChapterId)
  const subject = subjects.find((sub) => sub.id === (chapter?.subject_id ?? s.selectedSubjectId))

  const totalSeconds =
    s.mode === 'free'
      ? 0
      : s.pomodoroSession === 'work'
        ? s.pomodoroWorkMinutes * 60
        : s.pomodoroBreakMinutes * 60

  const handleStop = async () => {
    if (s.elapsedSeconds > 0) {
      setCompleteOpen(true)
    } else {
      await s.stopTimer()
    }
  }

  const handleSaveNotes = async (notes: string) => {
    const sessionId = useTimerStore.getState().sessionId
    if (sessionId) {
      await supabase.from('study_sessions').update({ notes }).eq('id', sessionId)
    }
    await s.stopTimer()
    setCompleteOpen(false)
    toast.success('Session saved!')
  }

  const handleDiscard = async () => {
    await s.stopTimer()
    setCompleteOpen(false)
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 md:py-12">
      {/* Mode Toggle */}
      <div className="mb-8 flex overflow-hidden rounded-lg border border-gray-200">
        <button
          onClick={() => s.setMode('free')}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            s.mode === 'free'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Free Study
        </button>
        <button
          onClick={() => s.setMode('pomodoro')}
          className={cn(
            'px-5 py-2 text-sm font-medium transition-colors',
            s.mode === 'pomodoro'
              ? 'bg-indigo-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50',
          )}
        >
          Pomodoro
        </button>
      </div>

      {/* Circular Timer */}
      <CircularTimer
        elapsedSeconds={s.elapsedSeconds}
        totalSeconds={totalSeconds}
        mode={s.mode}
        pomodoroSession={s.pomodoroSession}
        status={s.status}
      />

      {/* Pomodoro session counter */}
      {s.mode === 'pomodoro' && s.status !== 'idle' && (
        <p className="mt-2 text-sm text-gray-500">
          {s.pomodoroSession === 'work' ? 'Work' : 'Break'} session
          {s.pomodoroSession === 'work' && s.pomodoroCount > 0 && ` #${s.pomodoroCount + 1}`}
          {s.pomodoroSession === 'break' && ` break`}
        </p>
      )}

      {/* Controls */}
      <div className="mt-8">
        <TimerControls
          status={s.status}
          onStart={s.startTimer}
          onPause={s.pauseTimer}
          onResume={s.resumeTimer}
            onStop={handleStop}
        />
      </div>

      {/* Subject / Chapter selector */}
      <div className="mt-8 w-full max-w-md">
        <SubjectChapterSelector
          subjects={subjects}
          chapters={chapters}
          selectedSubjectId={s.selectedSubjectId}
          selectedChapterId={s.selectedChapterId}
          onSubjectChange={s.setSubject}
          onChapterChange={s.setChapter}
          disabled={s.status !== 'idle'}
        />
      </div>

      {/* Current session info */}
      {(s.selectedSubjectId || s.selectedChapterId) && s.status !== 'idle' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          {subject && <span>Studying: <strong>{subject.name}</strong></span>}
          {chapter && <span> — {chapter.name}</span>}
        </div>
      )}

      {/* Ambient sound selector (placeholder) */}
      <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
        <Headphones className="h-4 w-4" />
        <span>Ambient sounds coming soon</span>
      </div>

      {/* Session Complete Modal */}
      <SessionCompleteModal
        open={completeOpen}
        durationSeconds={s.elapsedSeconds}
        subjectName={subject?.name ?? null}
        chapterName={chapter?.name ?? null}
        onSave={handleSaveNotes}
        onDiscard={handleDiscard}
      />
    </div>
  )
}
