export interface Subject {
  id: string
  user_id: string
  name: string
  color: string
  sort_order: number
  created_at: string
}

export interface Chapter {
  id: string
  subject_id: string
  user_id: string
  name: string
  progress_pct: number
  checkpoint_text: string | null
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  subject_id: string | null
  chapter_id: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  session_type: 'free' | 'pomodoro'
  notes: string | null
  created_at: string
}

export interface DailyTarget {
  id: string
  user_id: string
  target_date: string
  target_minutes: number
  achieved_minutes: number
}

export interface DailyPlan {
  id: string
  user_id: string
  plan_date: string
  subject_id: string
  planned_minutes: number
  actual_minutes: number
  status: 'not_started' | 'partial' | 'done'
}

export interface WeeklyPlan {
  id: string
  user_id: string
  week_start: string
  day_of_week: number
  subject_id: string
}

export interface UserSettings {
  id: string
  user_id: string
  pomodoro_work_min: number
  pomodoro_break_min: number
  reminder_time: string
  email_reminders: boolean
  browser_notifications: boolean
}

export interface Habit {
  id: string
  user_id: string
  name: string
  streak_count: number
  last_completed_date: string | null
  created_at: string
}

export interface SessionNote {
  id: string
  session_id: string
  user_id: string
  content: string
  created_at: string
}
