import { useEffect, useState, useCallback } from 'react'
import { usePlanStore } from '@/stores/planStore'
import { useSubjects } from '@/hooks/useSubjects'
import { MonthCalendar } from '@/components/planning/MonthCalendar'
import { DayPlanModal } from '@/components/planning/DayPlanModal'
import { PageHeader } from '@/components/shared/PageHeader'

export default function PlanningPage() {
  useSubjects()

  const selectedMonth = usePlanStore((s) => s.selectedMonth)
  const selectedYear = usePlanStore((s) => s.selectedYear)
  const fetchPlansForMonth = usePlanStore((s) => s.fetchPlansForMonth)

  const [modalDate, setModalDate] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchPlansForMonth(selectedYear, selectedMonth)
  }, [selectedYear, selectedMonth])

  const handleDateSelect = useCallback((dateStr: string) => {
    usePlanStore.getState().setSelectedDate(dateStr)
    setModalDate(dateStr)
    setModalOpen(true)
  }, [])

  return (
    <div>
      <PageHeader title="Plan" description="View and manage your monthly study calendar" />

      <div className="mt-6">
        <MonthCalendar onDateSelect={handleDateSelect} />
      </div>

      <DayPlanModal
        open={modalOpen}
        dateStr={modalDate ?? ''}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
