import { useState } from 'react'
import { useSubjects } from '@/hooks/useSubjects'
import { useSubjectStore } from '@/stores/subjectStore'
import { SubjectCard } from '@/components/subjects/SubjectCard'
import { AddSubjectModal } from '@/components/subjects/AddSubjectModal'
import { UpdateCheckpointModal } from '@/components/subjects/UpdateCheckpointModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { SkeletonCard } from '@/components/shared/Skeleton'
import { BookOpen, Plus } from 'lucide-react'
import type { Subject, Chapter } from '@/types'

export default function SubjectsPage() {
  const { subjects, chapters, loading } = useSubjects()
  const store = useSubjectStore()

  const [subjectModalOpen, setSubjectModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>()
  const [checkpointModalOpen, setCheckpointModalOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [deleteSubjectConfirm, setDeleteSubjectConfirm] = useState<Subject | null>(null)
  const [deleteChapterConfirm, setDeleteChapterConfirm] = useState<Chapter | null>(null)

  if (loading && subjects.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Subjects"
        description="Manage your subjects and track chapter progress"
        actions={
          <button
            data-add-subject
            onClick={() => {
              setEditingSubject(undefined)
              setSubjectModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
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
              onDelete={(s) => setDeleteSubjectConfirm(s)}
              onEditChapter={() => {}}
              onDeleteChapter={(ch) => setDeleteChapterConfirm(ch)}
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
        onSave={async (name: string, color: string) => {
          if (editingSubject) {
            await store.updateSubject(editingSubject.id, { name, color })
          } else {
            await store.addSubject(name, color)
          }
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

      <ConfirmDialog
        open={deleteSubjectConfirm !== null}
        title="Delete Subject"
        message={`Delete "${deleteSubjectConfirm?.name}" and all its chapters? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleteSubjectConfirm) await store.deleteSubject(deleteSubjectConfirm.id)
          setDeleteSubjectConfirm(null)
        }}
        onCancel={() => setDeleteSubjectConfirm(null)}
      />

      <ConfirmDialog
        open={deleteChapterConfirm !== null}
        title="Delete Chapter"
        message={`Delete "${deleteChapterConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (deleteChapterConfirm) await store.deleteChapter(deleteChapterConfirm.id)
          setDeleteChapterConfirm(null)
        }}
        onCancel={() => setDeleteChapterConfirm(null)}
      />
    </div>
  )
}
