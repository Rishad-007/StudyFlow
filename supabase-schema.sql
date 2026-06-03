-- ============================================================================
-- StudyFlow - Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";


-- ----------------------------------------------------------------------------
-- 1. TABLES
-- ----------------------------------------------------------------------------

-- 1.1 profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 1.2 subjects
create table if not exists subjects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 1.3 chapters
create table if not exists chapters (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references subjects(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  progress_pct int not null default 0 check (progress_pct >= 0 and progress_pct <= 100),
  checkpoint_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 1.4 study_sessions
create table if not exists study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  chapter_id uuid references chapters(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  session_type text not null default 'free' check (session_type in ('free', 'pomodoro')),
  notes text,
  created_at timestamptz default now()
);

-- 1.5 daily_targets
create table if not exists daily_targets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  target_date date not null,
  target_minutes int not null default 120,
  achieved_minutes int not null default 0,
  unique(user_id, target_date)
);

-- 1.6 daily_plans
create table if not exists daily_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_date date not null,
  chapter_id uuid not null references chapters(id) on delete cascade,
  planned_minutes int not null default 60,
  actual_minutes int default 0,
  status text not null default 'not_started' check (status in ('not_started', 'partial', 'done')),
  unique(user_id, plan_date, chapter_id)
);

-- 1.7 weekly_plans
create table if not exists weekly_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  day_of_week int not null check (day_of_week >= 0 and day_of_week <= 6),
  chapter_id uuid not null references chapters(id) on delete cascade,
  unique(user_id, week_start, day_of_week, chapter_id)
);

-- 1.8 user_settings
create table if not exists user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references profiles(id) on delete cascade,
  pomodoro_work_min int not null default 25,
  pomodoro_break_min int not null default 5,
  reminder_time time default '18:00',
  email_reminders boolean default true,
  browser_notifications boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 1.9 habits
create table if not exists habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  streak_count int default 0,
  last_completed_date date,
  created_at timestamptz default now()
);

-- 1.10 session_notes
create table if not exists session_notes (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references study_sessions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);


-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
create index if not exists idx_chapters_subject_id on chapters(subject_id);
create index if not exists idx_chapters_user_id on chapters(user_id);

create index if not exists idx_study_sessions_user_id on study_sessions(user_id);
create index if not exists idx_study_sessions_subject_id on study_sessions(subject_id);
create index if not exists idx_study_sessions_chapter_id on study_sessions(chapter_id);
create index if not exists idx_study_sessions_started_at on study_sessions(started_at);

create index if not exists idx_daily_targets_user_date on daily_targets(user_id, target_date);
create index if not exists idx_daily_plans_user_date on daily_plans(user_id, plan_date);
create index if not exists idx_weekly_plans_user_week on weekly_plans(user_id, week_start);


-- ----------------------------------------------------------------------------
-- 3. AUTO-UPDATE TRIGGER
-- ----------------------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_chapters
  before update on chapters
  for each row
  execute function update_updated_at_column();

create trigger set_updated_at_user_settings
  before update on user_settings
  for each row
  execute function update_updated_at_column();


-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'profiles', 'subjects', 'chapters', 'study_sessions',
    'daily_targets', 'daily_plans', 'weekly_plans',
    'user_settings', 'habits', 'session_notes'
  ]
  loop
    execute format('alter table %I enable row level security;', tbl);
  end loop;
end;
$$;

-- Standard policies for tables with a user_id column
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'subjects', 'chapters', 'study_sessions',
    'daily_targets', 'daily_plans', 'weekly_plans',
    'user_settings', 'habits', 'session_notes'
  ]
  loop
    execute format(
      'create policy "Users can view own data" on %I for select using (auth.uid() = user_id);',
      tbl
    );
    execute format(
      'create policy "Users can insert own data" on %I for insert with check (auth.uid() = user_id);',
      tbl
    );
    execute format(
      'create policy "Users can update own data" on %I for update using (auth.uid() = user_id);',
      tbl
    );
    execute format(
      'create policy "Users can delete own data" on %I for delete using (auth.uid() = user_id);',
      tbl
    );
  end loop;
end;
$$;

-- Profiles table uses id = auth.uid() instead of user_id column
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can delete own profile" on profiles
  for delete using (auth.uid() = id);


-- ----------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-- ----------------------------------------------------------------------------

-- Returns the current study streak (consecutive days where >= 50% of target was met)
create or replace function get_streak(p_user_id uuid)
returns int
language plpgsql
as $$
declare
  current_streak int := 0;
  check_date date := current_date;
begin
  while exists (
    select 1
    from daily_targets
    where user_id = p_user_id
      and target_date = check_date
      and achieved_minutes >= target_minutes * 0.5
  ) loop
    current_streak := current_streak + 1;
    check_date := check_date - interval '1 day';
  end loop;

  return current_streak;
end;
$$;
