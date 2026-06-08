import type { StudySession, DailyTarget } from '@/types'

export interface SubjectTime {
  subject: string
  color: string
  minutes: number
}

export interface DailyTotal {
  date: string
  minutes: number
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return '0m'
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

export function aggregateBySubject(
  sessions: StudySession[],
  subjectNames: Record<string, string>,
  subjectColors: Record<string, string>,
): SubjectTime[] {
  const map: Record<string, SubjectTime> = {}

  for (const session of sessions) {
    if (!session.subject_id || !session.duration_seconds) continue
    const id = session.subject_id
    if (!map[id]) {
      map[id] = {
        subject: subjectNames[id] ?? 'Unknown',
        color: subjectColors[id] ?? '#6366f1',
        minutes: 0,
      }
    }
    map[id].minutes += session.duration_seconds / 60
  }

  return Object.values(map).sort((a, b) => b.minutes - a.minutes)
}

export function aggregateByDate(sessions: StudySession[]): DailyTotal[] {
  const map: Record<string, number> = {}

  for (const session of sessions) {
    if (!session.ended_at || !session.duration_seconds) continue
    const date = session.ended_at.split('T')[0]
    map[date] = (map[date] ?? 0) + session.duration_seconds / 60
  }

  return Object.entries(map)
    .map(([date, minutes]) => ({ date, minutes: Math.round(minutes) }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function findPeakHour(sessions: StudySession[]): number {
  const hours = new Array(24).fill(0)
  for (const session of sessions) {
    if (!session.started_at) continue
    const h = new Date(session.started_at).getHours()
    hours[h]++
  }
  let maxIdx = 0
  for (let i = 1; i < 24; i++) {
    if (hours[i] > hours[maxIdx]) maxIdx = i
  }
  return maxIdx
}

export function findPeakDay(sessions: StudySession[]): number {
  const days = new Array(7).fill(0)
  for (const session of sessions) {
    if (!session.started_at) continue
    const d = new Date(session.started_at).getDay()
    days[d]++
  }
  let maxIdx = 0
  for (let i = 1; i < 7; i++) {
    if (days[i] > days[maxIdx]) maxIdx = i
  }
  return maxIdx
}

export function calculateStreak(dailyTargets: DailyTarget[]): number {
  const dateSet = new Set(dailyTargets.map((t) => t.target_date))
  let streak = 0
  const d = new Date()
  while (true) {
    const dateStr = d.toISOString().split('T')[0]
    if (dateSet.has(dateStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getWeekRange(dateStr: string): { start: string; end: string } {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  }
}

export function getMonthRange(dateStr: string): { start: string; end: string } {
  const d = new Date(dateStr)
  const start = new Date(d.getFullYear(), d.getMonth(), 1)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}
