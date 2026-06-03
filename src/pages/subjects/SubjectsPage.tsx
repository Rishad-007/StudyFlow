import { useState } from 'react'
import { useSubjects } from '@/hooks/useSubjects'
import { useSubjectStore } from '@/stores/subjectStore'
import { SubjectCard } from '@/components/subjects/SubjectCard'
import { AddSubjectModal } from '@/components/subjects/AddSubjectModal'
import { AddChapterModal } from '@/components/subjects/AddChapterModal'
import { UpdateCheckpointModal } from '@/components/subjects/UpdateCheckpointModal'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { BookOpen, Plus } from 'lucide-react'
import type { Subject, Chapter } from '@/types'

export default function SubjectsPage() {
  const { subjects, chapters, loading } = useSubjects()
  const store = useSubjectStore()

  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>()
  const [chapterModalOpen, setChapterModalOpen] = useState(false)
  const [chapterSubjectId, setChapterSubjectId] = useState<string | undefined>()
  const [checkpointModalOpen, setCheckpointModalOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)

  if (loading && subjects.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Subjects"
        description="Manage your subjects and track chapter progress"
        actions={
          <button
            onClick={() => {
              setEditingSubject(undefined)
              setSubjectModalOpen(true)
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        }
      />

      {subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          description="Add your first subject to start tracking your study progress."
          action={{
            label: 'Add Subject',
            onClick: () => setSubjectModalOpen(true),
          }}
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              chapters={chapters}
              onEdit={(s) => {
                setEditingSubject(s)
                setSubjectModalOpen(true)
              }}
              onDelete={async (s) => {
                if (confirm(`Delete "${s.name}" and all its chapters?`)) {
                  await store.deleteSubject(s.id)
                }
              }}
              onAddChapter={(s) => {
                setChapterSubjectId(s.id)
                setChapterModalOpen(true)
              }}
              onEditChapter={() => {}}
              onDeleteChapter={async (ch) => {
                if (confirm(`Delete "${ch.name}"?`)) {
                  await store.deleteChapter(ch.id)
                }
              }}
              onUpdateProgress={(ch) => {
                setSelectedChapter(ch)
                setCheckpointModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <AddSubjectModal
        open={subjectModalOpen}
        initial={editingSubject ? { name: editingSubject.name, color: editingSubject.color } : undefined}
        onClose={() => {
          setSubjectModalOpen(false)
          setEditingSubject(undefined)
        }}
        onSave={async (name, color) => {
          if (editingSubject) {
            await store.updateSubject(editingSubject.id, { name, color })
          } else {
            await store.addSubject(name, color)
          }
        }}
      />

      <AddChapterModal
        open={chapterModalOpen}
        subjects={subjects}
        preselectedSubjectId={chapterSubjectId}
        onClose={() => {
          setChapterModalOpen(false)
          setChapterSubjectId(undefined)
        }}
        onSave={async (subjectId, name) => {
          await store.addChapter(subjectId, name)
        }}
      />

      <UpdateCheckpointModal
        open={checkpointModalOpen}
        chapter={selectedChapter}
        onClose={() => {
          setCheckpointModalOpen(false)
          setSelectedChapter(null)
        }}
        onSave={async (id, progressPct, checkpointText) => {
          await store.updateChapterProgress(id, progressPct, checkpointText)
        }}
      />
    </div>
  )
}
