import { useState, useCallback } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { useTimer } from '@/hooks/useTimer'
import { useTodos } from '@/hooks/useTodos'
import { useAmbientSound } from '@/hooks/useAmbientSound'
import { supabase } from '@/services/supabase'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SubjectChapterSelector } from '@/components/timer/SubjectChapterSelector'
import { SessionCompleteModal } from '@/components/timer/SessionCompleteModal'
import { AmbientSoundSelector } from '@/components/timer/AmbientSoundSelector'
import { SessionReflection } from '@/components/shared/SessionReflection'
import { QuickTodo } from '@/components/shared/QuickTodo'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function TimerPage() {
  useTimer()
  useSubjects()

  const s = useTimerStore()
  const subjects = useSubjectStore((s) => s.subjects)
  const chapters = useSubjectStore((s) => s.chapters)

  const { todos, addTodo, toggleTodo, deleteTodo, linkToSession } = useTodos()
  const { currentSound, volume, isPlaying, play, stop, setVolume } = useAmbientSound()

  const [completeOpen, setCompleteOpen] = useState(false)
  const [reflectionOpen, setReflectionOpen] = useState(false)
  const [sessionNotes, setSessionNotes] = useState('')
  const [showTodo, setShowTodo] = useState(false)

  const chapter = chapters.find((ch) => ch.id === s.selectedChapterId)
  const subject = subjects.find((sub) => sub.id === (chapter?.subject_id ?? s.selectedSubjectId))

  const totalSeconds =
    s.mode === 'free'
      ? 0
      : s.pomodoroSession === 'work'
        ? s.pomodoroWorkMinutes * 60
        : s.pomodoroBreakMinutes * 60

  const handleStop = useCallback(async () => {
    if (s.elapsedSeconds > 0) {
      setCompleteOpen(true)
    } else {
      await s.stopTimer()
    }
  }, [s.elapsedSeconds, s.stopTimer])

  const handleSaveNotes = useCallback(async (notes: string) => {
    setSessionNotes(notes)
    const sessionId = useTimerStore.getState().sessionId
    if (sessionId) {
      await supabase.from('study_sessions').update({ notes }).eq('id', sessionId)
    }
    await s.stopTimer()
    setCompleteOpen(false)
    setReflectionOpen(true)
  }, [s.stopTimer])

  const handleDiscard = useCallback(async () => {
    await s.stopTimer()
    setCompleteOpen(false)
  }, [s.stopTimer])

  const handleSaveReflection = useCallback(async (data: { rating: number; mood: string; takeaways: string; difficulties: string; tomorrowFocus: string }) => {
    const reflectionText = JSON.stringify({
      rating: data.rating,
      mood: data.mood,
      takeaways: data.takeaways,
      difficulties: data.difficulties,
      tomorrowFocus: data.tomorrowFocus,
      notes: sessionNotes,
    })
    const sessionId = useTimerStore.getState().sessionId
    if (sessionId) {
      await supabase.from('study_sessions').update({ notes: reflectionText }).eq('id', sessionId)
    }
    setReflectionOpen(false)
    toast.success('Reflection saved!')
  }, [sessionNotes])

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

      {/* Ambient Sounds */}
      <div className="mt-8 w-full max-w-md">
        <AmbientSoundSelector
          currentSound={currentSound}
          volume={volume}
          isPlaying={isPlaying}
          onSelect={(id) => (id ? play(id) : stop())}
          onVolumeChange={setVolume}
          onStop={stop}
        />
      </div>

      {/* Todo Toggle */}
      <div className="mt-4 w-full max-w-md">
        <button
          onClick={() => setShowTodo(!showTodo)}
          className="flex w-full items-center gap-2 text-sm text-gray-400 hover:text-gray-600"
        >
          {showTodo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showTodo ? 'Hide todo list' : 'Show todo list'}
        </button>
        {showTodo && (
          <div className="mt-2">
            <QuickTodo
              todos={todos}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              sessionId={s.sessionId}
              onLinkToSession={linkToSession}
            />
          </div>
        )}
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

      {/* Session Reflection */}
      <SessionReflection
        open={reflectionOpen}
        subjectName={subject?.name ?? null}
        chapterName={chapter?.name ?? null}
        onSave={handleSaveReflection}
        onSkip={() => {
          setReflectionOpen(false)
          toast.success('Session saved!')
        }}
        onClose={() => {
          setReflectionOpen(false)
          toast.success('Session saved!')
        }}
      />
    </div>
  )
}
