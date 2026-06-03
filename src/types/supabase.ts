export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          sort_order?: number
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          subject_id: string
          user_id: string
          name: string
          progress_pct: number
          checkpoint_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          user_id: string
          name: string
          progress_pct?: number
          checkpoint_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          user_id?: string
          name?: string
          progress_pct?: number
          checkpoint_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          subject_id?: string | null
          chapter_id?: string | null
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          session_type?: 'free' | 'pomodoro'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject_id?: string | null
          chapter_id?: string | null
          started_at?: string
          ended_at?: string | null
          duration_seconds?: number | null
          session_type?: 'free' | 'pomodoro'
          notes?: string | null
          created_at?: string
        }
      }
      daily_targets: {
        Row: {
          id: string
          user_id: string
          target_date: string
          target_minutes: number
          achieved_minutes: number
        }
        Insert: {
          id?: string
          user_id: string
          target_date: string
          target_minutes?: number
          achieved_minutes?: number
        }
        Update: {
          id?: string
          user_id?: string
          target_date?: string
          target_minutes?: number
          achieved_minutes?: number
        }
      }
      daily_plans: {
        Row: {
          id: string
          user_id: string
          plan_date: string
          chapter_id: string
          planned_minutes: number
          actual_minutes: number
          status: 'not_started' | 'partial' | 'done'
        }
        Insert: {
          id?: string
          user_id: string
          plan_date: string
          chapter_id: string
          planned_minutes?: number
          actual_minutes?: number
          status?: 'not_started' | 'partial' | 'done'
        }
        Update: {
          id?: string
          user_id?: string
          plan_date?: string
          chapter_id?: string
          planned_minutes?: number
          actual_minutes?: number
          status?: 'not_started' | 'partial' | 'done'
        }
      }
      weekly_plans: {
        Row: {
          id: string
          user_id: string
          week_start: string
          day_of_week: number
          chapter_id: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          day_of_week: number
          chapter_id: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          day_of_week?: number
          chapter_id?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          pomodoro_work_min: number
          pomodoro_break_min: number
          reminder_time: string
          email_reminders: boolean
          browser_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pomodoro_work_min?: number
          pomodoro_break_min?: number
          reminder_time?: string
          email_reminders?: boolean
          browser_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pomodoro_work_min?: number
          pomodoro_break_min?: number
          reminder_time?: string
          email_reminders?: boolean
          browser_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          streak_count: number
          last_completed_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          streak_count?: number
          last_completed_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          streak_count?: number
          last_completed_date?: string | null
          created_at?: string
        }
      }
      session_notes: {
        Row: {
          id: string
          session_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
    }
    Functions: {
      get_streak: {
        Args: { p_user_id: string }
        Returns: number
      }
    }
  }
}
