import { useState, useCallback, useEffect } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useSubjectStore } from '@/stores/subjectStore'
import { useSubjects } from '@/hooks/useSubjects'
import { useTimer } from '@/hooks/useTimer'
import { useTodos } from '@/hooks/useTodos'
import { useAmbientSound } from '@/hooks/useAmbientSound'
import { supabase } from '@/services/supabase'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { SessionCompleteModal } from '@/components/timer/SessionCompleteModal'
import { AmbientSoundSelector } from '@/components/timer/AmbientSoundSelector'
import { SessionReflection } from '@/components/shared/SessionReflection'
import { QuickTodo } from '@/components/shared/QuickTodo'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { BookOpen, Headphones, X } from 'lucide-react'

export default function TimerPage() {
  useTimer()
  useSubjects()

  const s = useTimerStore()
  const subjects = useSubjectStore((s) => s.subjects)

  const { todos, addTodo, toggleTodo, deleteTodo, linkToSession } = useTodos()
  const { currentSound, volume, isPlaying, play, stop, setVolume } = useAmbientSound()

  const [completeOpen, setCompleteOpen] = useState(false)
  const [reflectionOpen, setReflectionOpen] = useState(false)
  const [sessionNotes, setSessionNotes] = useState('')
  const [subjectPromptOpen, setSubjectPromptOpen] = useState(false)
  const [promptSubjectId, setPromptSubjectId] = useState<string | null>(null)

  useEffect(() => {
    s.setMode('pomodoro')
  }, [])

  const subject = subjects.find((sub) => sub.id === s.selectedSubjectId)

  const totalSeconds =
    s.pomodoroSession === 'work'
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

  const handleStart = useCallback(() => {
    if (subjects.length === 0) {
      toast.error('Create a subject first in Subjects page')
      return
    }
    setPromptSubjectId(s.selectedSubjectId)
    setSubjectPromptOpen(true)
  }, [s.selectedSubjectId, subjects.length])

  const handleStartWithSubject = useCallback(async () => {
    if (!promptSubjectId) return
    s.setSubject(promptSubjectId)
    setSubjectPromptOpen(false)
    await s.startTimer()
  }, [promptSubjectId, s.setSubject, s.startTimer])

  return (
    <div className="mx-auto max-w-2xl">
      {/* Timer Hero Card */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5 sm:px-6 sm:py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 sm:h-8 sm:w-8">
            <span className="text-xs sm:text-sm">⏱</span>
          </span>
          <span className="text-sm font-semibold text-gray-700">Timer</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Pomodoro
          </span>
        </div>

        {/* Timer body */}
        <div className="flex flex-col items-center px-4 py-6 sm:px-6 sm:py-10">
          <CircularTimer
            elapsedSeconds={s.elapsedSeconds}
            totalSeconds={totalSeconds}
            mode={s.mode}
            pomodoroSession={s.pomodoroSession}
            status={s.status}
          />

          {/* Session counter */}
          {s.status !== 'idle' && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500">
              {s.pomodoroSession === 'work' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Focus session{s.pomodoroCount > 0 && ` #${s.pomodoroCount + 1}`}
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Break session
                </>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="mt-8 w-full">
            <TimerControls
              status={s.status}
              pomodoroSession={s.pomodoroSession}
              onStart={handleStart}
              onPause={s.pauseTimer}
              onResume={s.resumeTimer}
              onStop={handleStop}
              onSkipBreak={s.skipBreak}
              onReset={s.resetTimer}
            />
          </div>
        </div>
      </div>

      {/* Session info when active */}
      {s.status !== 'idle' && subject && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:mt-4 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: subject.color }}
              />
              <span className="text-sm text-gray-600 truncate">
                Studying: <strong className="text-gray-900">{subject.name}</strong>
              </span>
            </div>
            <span className="text-xs text-gray-400 sm:ml-auto">
              {s.pomodoroWorkMinutes}min focus / {s.pomodoroBreakMinutes}min break
            </span>
          </div>
        </div>
      )}

      {/* Session settings */}
      <div className="mt-4 space-y-3 sm:mt-6">
        {/* Subject selector */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            Subject
          </label>
          {subjects.length === 0 ? (
            <p className="text-sm text-gray-400">No subjects yet. Add them in the Subjects page.</p>
          ) : (
            <select
              value={s.selectedSubjectId ?? ''}
              onChange={(e) => s.setSubject(e.target.value || null)}
              disabled={s.status !== 'idle'}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}
          {s.status !== 'idle' && (
            <p className="mt-1.5 text-xs text-amber-500">
              Subject can't be changed while a session is running
            </p>
          )}
        </div>

        {/* Ambient Sounds + Quick Todo — side by side on desktop */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Headphones className="h-3.5 w-3.5" />
              Ambient Sounds
            </label>
            <AmbientSoundSelector
              currentSound={currentSound}
              volume={volume}
              isPlaying={isPlaying}
              onSelect={(id) => (id ? play(id) : stop())}
              onVolumeChange={setVolume}
              onStop={stop}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <QuickTodo
              todos={todos}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              sessionId={s.sessionId}
              onLinkToSession={linkToSession}
            />
          </div>
        </div>
      </div>

      {/* Subject prompt — bottom sheet */}
      {subjectPromptOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setSubjectPromptOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl bg-white p-6 pb-safe shadow-2xl animate-slide-up">
            <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-gray-300" />
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Select a subject</h2>
              <button
                onClick={() => setSubjectPromptOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Choose what you'd like to study this session</p>

            <div className="mt-4 -mx-2 max-h-48 space-y-1 overflow-y-auto px-2">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setPromptSubjectId(sub.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors',
                    promptSubjectId === sub.id
                      ? 'bg-indigo-50 ring-1 ring-indigo-200'
                      : 'hover:bg-gray-50',
                  )}
                >
                  <div
                    className="h-8 w-8 shrink-0 rounded-lg"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="flex-1 text-sm font-medium text-gray-700">{sub.name}</span>
                  {promptSubjectId === sub.id && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                      <span className="text-xs text-white">✓</span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSubjectPromptOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartWithSubject}
                disabled={!promptSubjectId}
                className="flex-1 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Studying
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Complete Modal */}
      <SessionCompleteModal
        open={completeOpen}
        durationSeconds={s.elapsedSeconds}
        subjectName={subject?.name ?? null}
        onSave={handleSaveNotes}
        onDiscard={handleDiscard}
      />

      {/* Session Reflection */}
      <SessionReflection
        open={reflectionOpen}
        subjectName={subject?.name ?? null}
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
