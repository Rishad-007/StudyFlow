# StudyFlow — Complete Build Plan

## How to Use This File

This file contains **12 sequential phases** plus a **Supabase SQL prompt**. Each phase has a **detailed prompt** you can copy-paste into our conversation. After I complete a phase, paste the next prompt. Each prompt is self-contained but builds on previous phases.

Do not skip phases — later phases depend on earlier ones.

---

## Phase 1: Scaffolding & Configuration

**Copy and paste the following prompt into our conversation:**

---

```
I want to scaffold the StudyFlow project from scratch. Please do the following:

1. Create a new Vite project with React + TypeScript template in the current directory (Study_tracker).

2. Install ALL of the following dependencies:
   - tailwindcss @tailwindcss/vite (Tailwind v4 with Vite plugin)
   - zustand (state management)
   - @tanstack/react-query (server state)
   - @supabase/supabase-js (backend)
   - react-router-dom (routing)
   - lucide-react (icons)
   - recharts (charts)
   - date-fns (dates)
   - clsx tailwind-merge (class utilities)
   - react-hot-toast (toasts)
   - radix-ui dependencies for shadcn/ui:
     - @radix-ui/react-dialog
     - @radix-ui/react-dropdown-menu
     - @radix-ui/react-select
     - @radix-ui/react-tabs
     - @radix-ui/react-progress
     - @radix-ui/react-slider
     - @radix-ui/react-switch
     - @radix-ui/react-checkbox
     - @radix-ui/react-label
     - @radix-ui/react-slot
   - class-variance-authority (for shadcn)
   - vite-plugin-pwa (for PWA)

3. Install dev dependencies:
   - @types/node
   - prettier prettier-plugin-tailwindcss

4. Configure the following files:
   - vite.config.ts — with @vitejs/plugin-react, tailwindcss vite plugin, PWA plugin, path aliases (@/ -> src/)
   - tsconfig.json & tsconfig.app.json — with path aliases for @/*
   - src/index.css — Tailwind v4 import with @import "tailwindcss"
   - .prettierrc — with tailwindcss plugin

5. Create the following folder structure (empty files/folders are fine):

src/
├── components/
│   ├── ui/          (shadcn components go here)
│   ├── layout/
│   ├── timer/
│   ├── subjects/
│   ├── planning/
│   ├── dashboard/
│   ├── analytics/
│   └── shared/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── timer/
│   ├── subjects/
│   ├── planning/
│   ├── analytics/
│   └── settings/
├── hooks/
├── stores/
├── lib/
├── types/
├── services/
├── utils/
└── styles/

Also create:
- src/lib/utils.ts (the standard shadcn cn() utility)
- src/types/index.ts (empty, will fill later)
- src/stores/index.ts (empty, will fill later)
- src/hooks/index.ts (empty, will fill later)
- src/services/supabase.ts (Supabase client placeholder)
- src/services/supabase.ts content:
  ```ts
  import { createClient } from '@supabase/supabase-js'
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
  ```

6. Create .env.example with:
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=

7. Do NOT install any shadcn/ui components yet (we'll add them per-phase).
   Do NOT create any pages or components beyond the placeholder files above.
   Do NOT run npm run dev — just make sure npm install completes without errors.

Once done, confirm the project structure and let me know it's ready for Phase 2.
```

---

## Phase 2: Supabase SQL Schema

**Copy and paste the following prompt into our conversation:**

---

```
Now I need you to create two files:

### File 1: supabase-schema.sql

A complete SQL schema file at the root of the project. It must contain:

1. **UUID Extension**
   ```sql
   create extension if not exists "uuid-ossp";
   ```

2. **All 10 Tables** with exact columns, types, defaults, constraints, and foreign keys:

   **profiles**
   - id uuid primary key references auth.users(id) on delete cascade
   - full_name text
   - avatar_url text
   - created_at timestamptz default now()

   **subjects**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - name text not null
   - color text not null default '#6366f1'
   - sort_order int default 0
   - created_at timestamptz default now()

   **chapters**
   - id uuid primary key default uuid_generate_v4()
   - subject_id uuid not null references subjects(id) on delete cascade
   - user_id uuid not null references profiles(id) on delete cascade
   - name text not null
   - progress_pct int not null default 0 check (progress_pct >= 0 and progress_pct <= 100)
   - checkpoint_text text
   - created_at timestamptz default now()
   - updated_at timestamptz default now()

   **study_sessions**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - subject_id uuid references subjects(id) on delete set null
   - chapter_id uuid references chapters(id) on delete set null
   - started_at timestamptz not null default now()
   - ended_at timestamptz
   - duration_seconds int
   - session_type text not null default 'free' check (session_type in ('free', 'pomodoro'))
   - notes text
   - created_at timestamptz default now()

   **daily_targets**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - target_date date not null
   - target_minutes int not null default 120
   - achieved_minutes int not null default 0
   - unique(user_id, target_date)

   **daily_plans**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - plan_date date not null
   - chapter_id uuid not null references chapters(id) on delete cascade
   - planned_minutes int not null default 60
   - actual_minutes int default 0
   - status text not null default 'not_started' check (status in ('not_started', 'partial', 'done'))
   - unique(user_id, plan_date, chapter_id)

   **weekly_plans**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - week_start date not null
   - day_of_week int not null check (day_of_week >= 0 and day_of_week <= 6)
   - chapter_id uuid not null references chapters(id) on delete cascade
   - unique(user_id, week_start, day_of_week, chapter_id)

   **user_settings**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid unique not null references profiles(id) on delete cascade
   - pomodoro_work_min int not null default 25
   - pomodoro_break_min int not null default 5
   - reminder_time time default '18:00'
   - email_reminders boolean default true
   - browser_notifications boolean default true
   - created_at timestamptz default now()
   - updated_at timestamptz default now()

   **habits**
   - id uuid primary key default uuid_generate_v4()
   - user_id uuid not null references profiles(id) on delete cascade
   - name text not null
   - streak_count int default 0
   - last_completed_date date
   - created_at timestamptz default now()

   **session_notes**
   - id uuid primary key default uuid_generate_v4()
   - session_id uuid not null references study_sessions(id) on delete cascade
   - user_id uuid not null references profiles(id) on delete cascade
   - content text not null
   - created_at timestamptz default now()

3. **Indexes** for performance:
   - chapters(subject_id), chapters(user_id)
   - study_sessions(user_id), study_sessions(subject_id), study_sessions(chapter_id), study_sessions(started_at)
   - daily_targets(user_id, target_date)
   - daily_plans(user_id, plan_date)
   - weekly_plans(user_id, week_start)

4. **Auto-update trigger** for updated_at columns:
   - A function `update_updated_at_column()` that sets NEW.updated_at = now()
   - Triggers on: chapters, user_settings

5. **Row Level Security (RLS)** — Enable RLS on all tables. Then create identical policies for each table:
   - `"Users can view own data"` → `using (auth.uid() = user_id)`
   - `"Users can insert own data"` → `with check (auth.uid() = user_id)`
   - `"Users can update own data"` → `using (auth.uid() = user_id)`
   - `"Users can delete own data"` → `using (auth.uid() = user_id)`

6. **Helper function:**
   ```sql
   create or replace function get_streak(p_user_id uuid)
   returns int
   language plpgsql
   as $$
   declare
     current_streak int := 0;
     check_date date := current_date;
   begin
     while exists (
       select 1 from daily_targets
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
   ```

### File 2: SETUP_INSTRUCTIONS.md

A markdown file at the project root with these exact sections:

1. **Prerequisites** — Supabase project created, got URL + anon key
2. **Step 1: Open SQL Editor** — supabase.com/dashboard → project → SQL Editor
3. **Step 2: Run the Schema** — open supabase-schema.sql, copy all, paste into editor, click "Run"
4. **Step 3: Verify Tables** — go to Table Editor, confirm all 10 tables exist
5. **Step 4: Set Up Auth** — go to Authentication → Settings, confirm email/password provider is enabled
6. **Step 5: Get API Keys** — go to Project Settings → API, copy Project URL + anon public key
7. **Step 6: Configure Environment** — copy .env.example to .env, paste keys
8. **Step 7: Test Connection** — optional: run a test query

Write both files to the project root. Make the SQL well-formatted with clear section comments.
```

---

## Phase 3: Authentication (Login/Signup/Route Guards)

**Copy and paste the following prompt into our conversation:**

---

```
Phase 3: Build the complete authentication system.

Create/update the following files:

### 1. src/lib/utils.ts
The standard shadcn cn() utility:
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 2. src/services/supabase.ts
Properly initialized Supabase client with type-safe Database type import. Use:
```ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### 3. src/types/index.ts
Core app types (NOT the Supabase types — those go in supabase.ts):
```ts
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
  chapter_id: string
  planned_minutes: number
  actual_minutes: number
  status: 'not_started' | 'partial' | 'done'
}

export interface WeeklyPlan {
  id: string
  user_id: string
  week_start: string
  day_of_week: number
  chapter_id: string
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
```
Add a supabase Database type file: src/types/supabase.ts with a `Database` interface that maps all table names to their row types (use the same fields as above with Supabase's postgrest-ts style).

### 4. src/stores/authStore.ts
Zustand store:
```ts
import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}
```
Initialize by calling `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()` in the `initialize` method. The `signUp` method should also insert into `profiles` table after signup.

### 5. src/hooks/useAuth.ts
A simple hook that returns auth store state.

### 6. src/components/shared/ProtectedRoute.tsx
A route guard component:
- Checks if user is authenticated via authStore
- If loading, show a spinner
- If not authenticated, redirect to /auth/login
- If authenticated, render children (Outlet from react-router-dom)

### 7. src/pages/auth/LoginPage.tsx
Login page with:
- Email + password form
- "Remember me" checkbox
- Link to signup
- Link to forgot password
- Uses supabase.auth.signInWithPassword()
- On success, redirect to /dashboard
- Clean shadcn/ui form styling (card, input, button)

### 8. src/pages/auth/SignupPage.tsx
Signup page with:
- Full name + email + password + confirm password
- Password strength indicator (simple: length check)
- Terms acceptance checkbox
- Uses supabase.auth.signUp()
- On success, show "Check your email" message
- Link to login

### 9. src/pages/auth/ForgotPasswordPage.tsx
Simple form: email input → send reset link via supabase.auth.resetPasswordForEmail()

### 10. src/App.tsx
Router setup with react-router-dom:
```tsx
// Routes:
// /auth/login -> LoginPage
// /auth/signup -> SignupPage
// /auth/forgot-password -> ForgotPasswordPage
// /dashboard -> ProtectedRoute > DashboardPage (placeholder)
// /timer -> ProtectedRoute > TimerPage (placeholder)
// /subjects -> ProtectedRoute > SubjectsPage (placeholder)
// /plan -> ProtectedRoute > PlanPage (placeholder)
// /analytics -> ProtectedRoute > AnalyticsPage (placeholder)
// /settings -> ProtectedRoute > SettingsPage (placeholder)
// / -> redirect to /dashboard
// * -> 404 page
```

Create placeholder page components for each route (just a div with the page name).

### 11. src/main.tsx
Wrap app with:
- BrowserRouter
- QueryClientProvider (from @tanstack/react-query)
- Toaster (from react-hot-toast)
- Call authStore.initialize() on app mount

### 12. src/components/shared/LoadingSpinner.tsx
A centered spinner component using lucide-react's Loader2 icon.

---

**Acceptance Criteria:**
- `npm run dev` starts without errors
- Navigating to / redirects to /auth/login when logged out
- Login, signup, forgot password forms work
- Protected routes redirect to login when unauthenticated
- After login, user can access /dashboard
- Auth state persists on refresh

Do NOT style things extensively — just make it functional and clean with basic Tailwind. We'll polish later.
```

---

## Phase 4: App Shell & Navigation

**Copy and paste the following prompt into our conversation:**

---

```
Phase 4: Build the responsive app shell with sidebar (desktop) and bottom navigation (mobile).

### Files to create/modify:

### 1. src/components/layout/Sidebar.tsx
Desktop sidebar (hidden on mobile):
- Logo/brand at top: "StudyFlow" with a BookOpen icon from lucide-react
- Navigation links with icons:
  - Dashboard (LayoutDashboard icon)
  - Timer (Timer icon)
  - Plan (Calendar icon)
  - Subjects (BookOpen icon)
  - Analytics (BarChart3 icon)
  - Settings (Settings icon)
- Active link highlighted with primary color
- User avatar + name at bottom
- Sign out button at bottom
- Use `cn()` for active state styling
- Use NavLink from react-router-dom for active detection

### 2. src/components/layout/BottomNav.tsx
Mobile bottom navigation bar (hidden on desktop):
- Same navigation links as sidebar but horizontal
- Icons only (no text) or small text below icons
- Active state indicator (colored icon)
- Fixed to bottom of screen
- Safe area padding for notched phones (pb-safe)

### 3. src/components/layout/AppShell.tsx
Main layout wrapper:
- Desktop: Sidebar (fixed, w-64) + main content area with top bar
- Mobile: main content area + BottomNav (fixed bottom)
- Top bar (visible on mobile, minimal on desktop):
  - Mobile: hamburger menu button, page title, notification bell
  - Desktop: breadcrumb or page title, notification bell, profile dropdown
- Use Outlet for rendering child routes
- Responsive: `md:ml-64` for desktop main content

### 4. src/components/layout/TopBar.tsx
Top bar component:
- Page title (passed as prop or derived from route)
- Notification bell icon with badge count
- Avatar dropdown with profile link and sign out
- Mobile: hamburger to toggle sidebar (just a simple slide-over or hidden sidebar toggle)

### 5. src/components/shared/PageHeader.tsx
Reusable page header component:
- Props: title, description?, actions? (ReactNode for buttons)
- Consistent padding and typography

### 6. src/components/shared/EmptyState.tsx
Reusable empty state:
- Props: icon (LucideIcon), title, description, action? (button label + onClick)
- Centered layout with muted styling
- Example usage: "No subjects yet. Add your first subject!"

### 7. Update App.tsx
Wrap all protected routes with AppShell instead of just ProtectedRoute:
```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<AppShell />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/timer" element={<TimerPage />} />
    ... etc
  </Route>
</Route>
```
Remove placeholder page content — leave them as simple pages that render inside AppShell.

### 8. src/hooks/useMediaQuery.ts
A custom hook:
```ts
function useMediaQuery(query: string): boolean
```
Uses window.matchMedia to detect responsive breakpoints. Export `useIsMobile` and `useIsDesktop` convenience hooks.

### 9. Styling notes
- Use Tailwind's `dark:` variants — add dark mode class toggle (we'll wire it to settings later)
- The sidebar should have a subtle border-right separator
- Bottom nav should have a border-top separator
- Smooth transitions for active states

---

**Acceptance Criteria:**
- Desktop: sidebar visible on left, main content on right
- Mobile: bottom nav bar visible, sidebar hidden
- All nav links navigate correctly and show active state
- AppShell renders child routes via Outlet
- TopBar shows on mobile with page title
- Sign out works
- Responsive breakpoints work correctly (md: for desktop/mobile switch)
```

---

## Phase 5: Subjects & Chapters CRUD

**Copy and paste the following prompt into our conversation:**

---

```
Phase 5: Build the complete Subjects and Chapters management system.

### Files to create/modify:

### 1. src/stores/subjectStore.ts
Zustand store for subjects:
```ts
interface SubjectState {
  subjects: Subject[]
  loading: boolean
  fetchSubjects: () => Promise<void>
  addSubject: (name: string, color: string) => Promise<void>
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  addChapter: (subjectId: string, name: string) => Promise<void>
  updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
  deleteChapter: (id: string) => Promise<void>
  updateChapterProgress: (id: string, progressPct: number, checkpointText?: string) => Promise<void>
}
```
Use supabase client for all operations. After mutations, refetch the list.

### 2. src/hooks/useSubjects.ts
Hook that calls subjectStore and fetches on mount if not loaded.

### 3. src/pages/subjects/SubjectsPage.tsx
Main subjects page:
- Page header: "Subjects" + "Add Subject" button
- Grid layout for subject cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each card shows:
  - Color indicator (left colored strip)
  - Subject name
  - Total time studied (aggregated from study_sessions — calculate in the store or query)
  - Overall progress bar (average of chapter progress_pct)
  - Chapter count
  - Click to expand/collapse chapters list
- Loading state with skeleton cards
- Empty state when no subjects

### 4. src/components/subjects/SubjectCard.tsx
Individual subject card:
- Props: subject, onEdit, onDelete, expanded, onToggle
- Color strip on left (4px wide)
- Subject name (bold)
- Computed stats (total time, chapter count, avg progress)
- Progress bar (thin, using a div with width % + color)
- Expand chevron
- Chapter list (conditionally rendered when expanded)
- Edit (pencil icon) + Delete (trash icon) buttons

### 5. src/components/subjects/ChapterItem.tsx
Individual chapter row:
- Props: chapter, subjectColor, onEdit, onDelete, onUpdateProgress
- Chapter name
- Progress percentage badge
- Thin progress bar colored by subject
- "Update" button → opens UpdateCheckpointModal
- Edit/delete icons

### 6. src/components/subjects/AddSubjectModal.tsx
Dialog component (using shadcn Dialog or a basic modal):
- Subject name input
- Color picker (predefined color palette — 10 color circles to pick from)
- Save / Cancel buttons

### 7. src/components/subjects/UpdateCheckpointModal.tsx
Dialog for updating chapter progress:
- Chapter name (display only, not editable)
- Progress slider (0-100) with percentage display
- Checkpoint textarea: "What's your current status?" with placeholder like "Completed 40%", "Understood Derivatives", "Struggling with Integration"
- Save button

### 8. src/components/subjects/AddChapterModal.tsx
Simple dialog:
- Chapter name input
- Subject selector (dropdown of subjects)
- Save / Cancel

### 9. src/components/shared/ColorPicker.tsx
Reusable color picker:
- Props: value, onChange
- 12 predefined color circles:
  - Indigo (#6366f1), Emerald (#10b981), Amber (#f59e0b), Rose (#f43f5e)
  - Sky (#0ea5e9), Violet (#8b5cf6), Pink (#ec4899), Teal (#14b8a6)
  - Orange (#f97316), Cyan (#06b6d4), Lime (#84cc16), Fuchsia (#d946ef)
- Selected color has a checkmark or ring indicator
- Can also type a custom hex

### 10. src/components/shared/ProgressBar.tsx
Reusable progress bar:
- Props: value (0-100), color (tailwind color class), size ('sm' | 'md' | 'lg'), showLabel (boolean)
- Smooth animation on value change (CSS transition)
- Rounded corners
- Background track is gray-200, filled portion uses the color prop

---

**Acceptance Criteria:**
- Can add/edit/delete subjects
- Can add/edit/delete chapters under subjects
- Subjects list shows on page load
- Chapter progress can be updated via the checkpoint modal
- Colors show correctly on cards and progress bars
- Empty state shows when no subjects exist
- All CRUD operations persist to Supabase and refetch
- Smooth expand/collapse for chapters within a subject
```

---

## Phase 6: Timer System

**Copy and paste the following prompt into our conversation:**

---

```
Phase 6: Build the complete timer system with Free Study and Pomodoro modes.

### Files to create/modify:

### 1. src/stores/timerStore.ts
Zustand store for timer state:
```ts
interface TimerState {
  mode: 'free' | 'pomodoro'
  status: 'idle' | 'running' | 'paused'
  elapsedSeconds: number
  pomodoroWorkMinutes: number
  pomodoroBreakMinutes: number
  pomodoroSession: 'work' | 'break'
  pomodoroCount: number
  selectedSubjectId: string | null
  selectedChapterId: string | null
  sessionId: string | null // current study_session id in DB
  startTime: string | null // ISO string

  // Actions
  setMode: (mode: 'free' | 'pomodoro') => void
  setSubject: (id: string | null) => void
  setChapter: (id: string | null) => void
  setPomodoroWork: (minutes: number) => void
  setPomodoroBreak: (minutes: number) => void
  startTimer: () => Promise<void>
  pauseTimer: () => Promise<void>
  resumeTimer: () => Promise<void>
  stopTimer: () => Promise<void>
  tick: () => void // called every second
  resetTimer: () => void
  loadTimerState: () => void // load from localStorage for offline recovery

  // Pomodoro
  skipBreak: () => void
}
```

Key behaviors:
- `startTimer`: Creates a study_sessions record in Supabase with started_at = now(), stores sessionId
- `pauseTimer`: Updates the study_sessions record's duration_seconds (calculate elapsed so far), keeps the record "open" with no ended_at
- `resumeTimer`: Updates started_at to now() to track the remaining time
- `stopTimer`: Sets ended_at = now(), calculates total duration_seconds, updates the record, resets state
- `tick`: Increments elapsedSeconds by 1
- `loadTimerState`: On app load, if there's a paused session in localStorage, restore it
- Auto-save timer state to localStorage every tick (JSON: mode, status, elapsedSeconds, sessionId, selectedSubjectId, selectedChapterId, startTime, pomodoro state)

For Pomodoro:
- After pomodoroWorkMinutes elapsed → auto-pause, show "Break time!" notification, switch to break mode
- After pomodoroBreakMinutes elapsed → auto-pause, show "Work time!" notification, increment pomodoroCount, switch back to work mode
- Track pomodoro sessions in the study_sessions table with session_type = 'pomodoro'

### 2. src/hooks/useTimer.ts
Custom hook that:
- Subscribes to timer store
- Uses setInterval to call tick() every second when status === 'running'
- Saves state to localStorage every 5 seconds
- Handles cleanup on unmount (clear interval)

### 3. src/pages/timer/TimerPage.tsx
Main timer page:
- Mode toggle: "Free Study" | "Pomodoro" (tab-style buttons at top)
- Large circular timer display (SVG circle with stroke-dashoffset animation)
- Time display: HH:MM:SS for free mode, MM:SS for pomodoro
- Subject + Chapter selectors (dropdowns) — disabled when timer is running
- Control buttons: Start (Play icon), Pause (Pause icon), Resume (Play icon), Stop (Square icon)
- Reset button (when idle)
- Current session info: subject name, chapter name
- Pomodoro session indicator: "Work Session 3" or "Break"
- Ambient sound selector (just dropdown with placeholder options for now — no actual sounds yet)

### 4. src/components/timer/CircularTimer.tsx
SVG circular timer display:
- Props: elapsedSeconds, totalSeconds (for pomodoro), mode, status, size (default 300px)
- SVG circle with:
  - Track circle (gray, full circle)
  - Progress circle (colored, animated dashoffset)
  - Center: Time display (large text) + "Study" or "Break" label + mode label
- Color: indigo-500 for free study, emerald-500 for pomodoro work, amber-500 for pomodoro break
- Smooth CSS transition on progress changes

### 5. src/components/timer/TimerControls.tsx
Control buttons row:
- Props: status, onStart, onPause, onResume, onStop, onReset
- Start: green button with Play icon (shown when idle)
- Pause: amber button with Pause icon (shown when running)
- Resume: green button with Play icon (shown when paused)
- Stop: red button with Square icon (shown when running or paused)
- Reset: gray button with RotateCcw icon (shown when idle with elapsed > 0)
- Large, circular buttons, properly spaced

### 6. src/components/timer/SubjectChapterSelector.tsx
Dropdown selectors:
- Props: subjects, selectedSubjectId, selectedChapterId, onSubjectChange, onChapterChange, disabled
- Subject selector: dropdown with all subjects + "No subject" option
- Chapter selector: filtered by selected subject, "No chapter" option
- Styled consistently with shadcn Select or native select

### 7. src/components/timer/SessionCompleteModal.tsx
Modal shown when timer stops:
- Duration summary
- Subject/chapter recap
- Notes textarea ("How did this session go?")
- Save + Discard buttons
- On save: update study_sessions.notes and prompt for progress update

### 8. src/hooks/useTimerPersistence.ts
Hook for timer state persistence:
- On mount, check localStorage for saved timer state
- If found and the session still exists in DB (not ended), restore state
- If the saved session is older than 24 hours, discard it
- Save state on every significant change

---

**Acceptance Criteria:**
- Free Study timer: start → pause → resume → stop works
- Pomodoro timer: work interval → break interval → work interval cycles correctly
- Subject/chapter can be selected before starting
- Timer state survives page refresh (localStorage)
- Session is saved to Supabase on stop
- Circular timer animates smoothly
- Session complete modal appears with notes option
- Timer page fully functional in both modes
```

---

## Phase 7: Planning System

**Copy and paste the following prompt into our conversation:**

---

```
Phase 7: Build the weekly and daily planning system.

### Files to create/modify:

### 1. src/stores/planStore.ts
Zustand store:
```ts
interface PlanState {
  weeklyPlans: WeeklyPlan[]
  dailyPlans: DailyPlan[]
  currentWeekStart: string // ISO date of Monday
  selectedDate: string // ISO date

  setWeekStart: (date: string) => void
  setSelectedDate: (date: string) => void
  fetchWeeklyPlan: (weekStart: string) => Promise<void>
  fetchDailyPlan: (date: string) => Promise<void>
  addToWeeklyPlan: (dayOfWeek: number, chapterId: string) => Promise<void>
  removeFromWeeklyPlan: (planId: string) => Promise<void>
  setDailyPlan: (chapterId: string, plannedMinutes: number) => Promise<void>
  updateDailyPlanStatus: (planId: string, status: 'not_started' | 'partial' | 'done') => Promise<void>
  updateDailyPlanActual: (planId: string, actualMinutes: number) => Promise<void>
}
```

### 2. src/pages/planning/PlanningPage.tsx
Main planning page with tabs: "Weekly" | "Daily"
- Weekly tab: 7-day grid with chapter assignments
- Daily tab: hour allocation per chapter for selected day
- Navigation between weeks (prev/next buttons)
- Tab switcher at top

### 3. src/components/planning/WeeklyPlanner.tsx
Weekly planner view:
- "Week of [date]" header with prev/next navigation arrows
- 7-column grid (Mon-Sun) with day headers
- Each day column shows:
  - Day name (Mon, Tue, etc.)
  - Date number
  - List of assigned chapters (colored pills/badges)
  - Total planned hours for that day
  - "+" button to add a chapter
- Empty day: muted "No topics" text
- Current day highlighted
- Click on a chapter pill to remove it (with confirmation tooltip)

### 4. src/components/planning/DailyPlanner.tsx
Daily planner view:
- Date selector / display at top
- Subject-wise grouping of chapters
- Each row:
  - Chapter name (with subject color dot)
  - Planned minutes (editable number input)
  - Actual minutes studied (auto-populated from timer, editable)
  - Status selector: Not Started | Partial | Done (three buttons/toggle)
- Summary at bottom:
  - Total planned minutes
  - Total actual minutes
  - Completion % (done chapters / total chapters)
- "Mark all as done" button (confirmation dialog)

### 5. src/components/planning/AddToWeekModal.tsx
Dialog to add a chapter to a specific day:
- Day selector (pre-selected from context)
- Subject selector (dropdown)
- Chapter selector (filtered by subject)
- Add button

### 6. src/components/planning/DayColumn.tsx
Single day column for weekly view:
- Props: day, date, chapters, isToday, onAddChapter, onRemoveChapter
- Compact list of chapter pills
- Each pill shows chapter name, has an X button for removal
- "+" floating button at bottom
- Today indicator (ring or highlight)

### 7. src/components/planning/ChapterPill.tsx
Small colored pill for chapter:
- Props: chapter, subjectColor, onRemove
- Background color = subjectColor at 15% opacity
- Text color = subjectColor
- X button on hover
- Chapter name truncated with ellipsis if too long

### 8. src/components/planning/PlanSummary.tsx
Summary statistics for the day/week:
- Props: totalPlanned, totalActual, completionRate
- Three stat cards side by side
- Progress bar for completion rate
- Text: "3 of 5 chapters completed"

---

**Acceptance Criteria:**
- Weekly planner shows 7-day grid with assigned chapters
- Can add chapters to specific days in the week
- Can remove chapters from days
- Navigation between weeks works
- Daily planner shows per-chapter time allocation
- Can edit planned minutes inline
- Can update status (Not Started / Partial / Done)
- Summary stats update in real-time
- All data persists to Supabase
- Current day is visually highlighted
```

---

## Phase 8: Dashboard

**Copy and paste the following prompt into our conversation:**

---

```
Phase 8: Build the main Dashboard/Home page.

### Files to create/modify:

### 1. src/stores/dashboardStore.ts
Zustand store:
```ts
interface DashboardState {
  todayTarget: DailyTarget | null
  todayPlans: DailyPlan[]
  recentSessions: StudySession[]
  streak: number
  loading: boolean

  fetchDashboardData: () => Promise<void>
}
```
Fetches:
- Today's daily_target (or creates one with default target if not exists)
- Today's daily_plans
- Last 5 study sessions
- Streak count (using the get_streak DB function or client-side calculation)

### 2. src/pages/dashboard/DashboardPage.tsx
Main dashboard page with grid layout:
- Welcome header: "Good morning/afternoon/evening, [Name]!"
- Grid layout (responsive):
  - Top row (2 cols desktop, 1 col mobile):
    - Circular progress toward daily target
    - Current streak badge
  - Middle row:
    - Quick Start Timer section
    - Today's Planned Topics
  - Bottom row:
    - Recent Sessions (scrollable list)
    - Motivational quote card

### 3. src/components/dashboard/DailyProgressRing.tsx
Circular progress component:
- Props: achievedMinutes, targetMinutes
- Large SVG ring with percentage fill
- Center: "45m / 2h" or "38%" text
- Color: green when >= 75%, amber when >= 50%, red when < 50%
- Subtle pulse animation when progress updates

### 4. src/components/dashboard/StreakBadge.tsx
Streak display:
- Props: streak (number)
- Fire emoji (🔥) icon or flame icon from lucide
- Large number + "day streak" text
- Different styling tiers: 0 (gray), 1-6 (amber), 7-29 (orange), 30+ (red with glow)
- Animation: subtle glow for 7+ days

### 5. src/components/dashboard/QuickStartTimer.tsx
Quick access timer start:
- Props: recentSubjects (array of { subject, chapter, lastStudied })
- "Study Again" section showing last 3 used subject+chapter combinations
- Each is a button that navigates to /timer with those pre-selected
- "Start Free Study" button (no subject) — navigates to timer
- "Start Pomodoro" button — navigates to timer in pomodoro mode

### 6. src/components/dashboard/TodaysPlans.tsx
Today's planned topics:
- Props: plans (array with chapter name, subject color, planned/actual minutes, status)
- Compact list
- Each item: subject color dot | chapter name | "45m/60m" | status badge (Done/Partial/Not Started)
- Quick action button to mark as "Done"
- Empty state: "No plans for today. Create one!"

### 7. src/components/dashboard/RecentSessions.tsx
Recent study sessions list:
- Props: sessions
- Last 5 sessions
- Each item: session icon (Timer or Coffee for pomodoro break) | duration | subject (if any) | relative time ("2h ago")
- Click navigates to analytics for details

### 8. src/components/dashboard/MotivationalQuote.tsx
Random motivational quote:
- Array of 10-15 study-related quotes (hardcoded)
- Randomly selected on each page load
- Clean card with quote marks styling
- Author attribution

### 9. src/hooks/useGreeting.ts
Simple hook:
- Returns { greeting: 'Good morning' | 'Good afternoon' | 'Good evening', timeOfDay: 'morning' | 'afternoon' | 'evening' }
- Based on current hour

---

**Acceptance Criteria:**
- Dashboard loads with today's data
- Circular progress ring shows real progress toward daily target
- Streak displays and matches DB value
- Quick start buttons navigate to timer with pre-selected subject
- Today's plans list is accurate
- Recent sessions show most recent entries
- Motivational quote displays
- Welcome greeting is time-appropriate
- Responsive grid layout works on all screen sizes
- Empty states handled gracefully
```

---

## Phase 9: Analytics & Charts

**Copy and paste the following prompt into our conversation:**

---

```
Phase 9: Build the analytics and history page with charts.

### Files to create/modify:

### 1. src/stores/analyticsStore.ts
Zustand store:
```ts
type AnalyticsPeriod = 'day' | 'week' | 'month'

interface AnalyticsState {
  period: AnalyticsPeriod
  selectedDate: string // ISO date
  sessions: StudySession[]
  subjectTimeDistribution: { subject: string; color: string; minutes: number }[]
  dailyTotals: { date: string; minutes: number }[]
  chapterProgress: { chapter: string; subject: string; progress: number }[]
  mostProductiveHour: number // 0-23
  mostProductiveDay: number // 0-6
  totalTime: number
  totalSessions: number
  loading: boolean

  setPeriod: (period: AnalyticsPeriod) => void
  setSelectedDate: (date: string) => void
  fetchAnalytics: () => Promise<void>
}
```
Fetch logic:
- For 'day': sessions on selectedDate
- For 'week': sessions in the week containing selectedDate
- For 'month': sessions in the month containing selectedDate
- Aggregate by subject for pie chart
- Aggregate by day for heatmap/bar chart
- Calculate productive hour from session start times

### 2. src/pages/analytics/AnalyticsPage.tsx
Main analytics page:
- Period selector: Day | Week | Month (button group)
- Date navigation: prev/next arrows with date display
- Summary cards row:
  - Total Time (with clock icon)
  - Sessions Count (with play icon)
  - Most Productive Time (with sun/moon icon)
  - This vs Previous period comparison (small green/red indicator)
- Charts section (responsive grid):
  - Pie chart: Subject-wise time distribution
  - Bar chart: Daily totals over the period
  - Progress chart: Chapter completion overview
- Bottom section:
  - Most/Least studied subjects list
  - Detailed sessions table

### 3. src/components/analytics/SummaryCards.tsx
Row of 3-4 stat cards:
- Props: totalTime, totalSessions, productiveHour, productiveDay, periodComparison
- Each card: icon, value, label
- Period comparison shows arrow up/down + percentage

### 4. src/components/analytics/SubjectPieChart.tsx
Recharts PieChart:
- Props: data (subject name, color, minutes)
- Responsive container
- Custom colored slices (using subject colors)
- Legend below chart
- Tooltip on hover: "Math: 12h 30m (35%)"
- Center label: total hours

### 5. src/components/analytics/DailyBarChart.tsx
Recharts BarChart:
- Props: data (date, minutes)
- Responsive container
- X-axis: dates (formatted nicely with date-fns)
- Y-axis: hours
- Bars colored indigo-500
- Tooltip on hover
- Bar has rounded top corners (via radius prop)

### 6. src/components/analytics/ChapterProgressChart.tsx
Horizontal bar chart for chapter progress:
- Props: data (chapter, subject, progress)
- Horizontal bars, one per chapter
- Color = subject color
- Includes 100% target line marker
- Current progress label at end of bar

### 7. src/components/analytics/SessionsTable.tsx
Detailed sessions table:
- Props: sessions
- Columns: Date, Start Time, Duration, Subject, Chapter, Type (Free/Pomodoro), Notes
- Sortable by date (default desc)
- Searchable by subject/chapter name
- Responsive: on mobile, show card view instead of table
- Paginated: 10 per page

### 8. src/components/analytics/ProductiveTimeCard.tsx
Shows most productive time analysis:
- Props: productiveHour, productiveDay
- Display: "You're most productive at [hour]:00 on [day]s"
- Small clock visualization or icon
- Based on session start time analysis

### 9. src/components/shared/DateNavigator.tsx
Reusable date navigation:
- Props: date, period ('day' | 'week' | 'month'), onPrev, onNext, onToday
- Shows: "<" + formatted date range + ">" + "Today" button
- Format examples: "Jun 3, 2026" / "Week of Jun 1" / "June 2026"

### 10. src/utils/analytics.ts
Utility functions:
- `formatDuration(minutes: number): string` — "2h 30m" or "45m"
- `aggregateBySubject(sessions: StudySession[]): SubjectTime[]`
- `aggregateByDate(sessions: StudySession[]): DailyTotal[]`
- `findPeakHour(sessions: StudySession[]): number`
- `calculateStreak(dailyTargets: DailyTarget[]): number`
- All functions pure and testable

---

**Acceptance Criteria:**
- Analytics loads data for selected period
- Period switching (day/week/month) works and refetches
- Pie chart shows subject distribution with correct colors
- Bar chart shows daily totals
- Chapter progress bars show correctly
- Date navigation changes the viewed period
- Summary cards show correct aggregate values
- Sessions table is filterable and paginated
- Responsive layout
- All charts use Recharts and are responsive
```

---

## Phase 10: Notifications & Reminders

**Copy and paste the following prompt into our conversation:**

---

```
Phase 10: Build the notification and reminder system.

### Files to create/modify:

### 1. src/hooks/useNotifications.ts
Browser notification hook:
```ts
interface UseNotificationsReturn {
  permission: NotificationPermission
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, options?: NotificationOptions) => void
  sendTimerComplete: (sessionType: string, duration: string) => void
  sendBreakReminder: () => void
  sendDailyReminder: () => void
}
```
- Checks Notification API support
- requestPermission: asks user for notification permission
- sendNotification: creates and shows a browser notification
- sendTimerComplete: "Free study session complete! You studied for 45 minutes."
- sendBreakReminder: "Break time over! Time to focus."
- Store permission status in user_settings

### 2. src/hooks/useReminders.ts
Reminder scheduling hook:
```ts
interface UseRemindersReturn {
  scheduleDailyReminder: (time: string) => void
  cancelDailyReminder: () => void
  checkForReminderTime: () => void
  requestEmailReminder: () => Promise<void>
}
```
- Uses setTimeout/setInterval to check if current time matches reminder_time
- On match: triggers browser notification + in-app toast
- Stores reminder timers for cleanup
- cancelDailyReminder: clears the timeout
- checkForReminderTime: called on app mount and when settings change
- Future: Triggers Supabase Edge Function for email (integrate later)

### 3. src/components/shared/InAppToast.tsx
Custom toast component (using react-hot-toast):
- Type: success, error, info, warning
- Icon based on type
- Title + description
- Optional action button (e.g., "Update Progress" link)
- Auto-dismiss: 5 seconds for info, 8 seconds for warnings
- Styled consistently with app theme

### 4. src/components/shared/NotificationPrompt.tsx
Browser notification permission prompt:
- Shown when user first enables notifications in settings
- Explains what notifications will be sent (timer complete, breaks, daily reminders)
- "Enable Notifications" button → calls requestPermission
- "Not Now" button → dismisses, can be shown again later
- "Don't Ask Again" → stores preference, never shows again

### 5. src/pages/settings/SettingsPage.tsx (create full page)
Settings page with sections:

**Profile Section:**
- Display name (editable)
- Avatar URL (editable)
- Save button

**Timer Settings Section:**
- Pomodoro work duration (slider: 15-60 min, default 25)
- Pomodoro break duration (slider: 3-30 min, default 5)
- Long break interval (after X pomodoros: slider 2-6, default 4)
- Auto-start breaks toggle
- Auto-start work toggle

**Notification Settings Section:**
- Enable browser notifications toggle + "Test Notification" button
- Enable email reminders toggle
- Daily reminder time (time input, default 18:00)
- Reminder type checkboxes:
  - [x] Daily progress reminder
  - [ ] Timer complete
  - [ ] Break time
  - [ ] Weekly summary

**Appearance Section:**
- Theme: Light / Dark / System (radio group)
- (Theme toggle functionality using Tailwind's dark mode)

**Data Section:**
- Export data button (exports all user data as JSON)
- Delete account button (with confirmation dialog, cascading deletes)

**About Section:**
- App version
- Link to privacy policy
- Credits

### 6. src/stores/settingsStore.ts
Zustand store:
```ts
interface SettingsState {
  settings: UserSettings | null
  loading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<UserSettings>) => Promise<void>
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<void>
  exportData: () => Promise<void>
  deleteAccount: () => Promise<void>
}
```

### 7. src/components/settings/SettingCard.tsx
Reusable settings section wrapper:
- Props: title, description, children
- Card with title + description at top, children below
- Consistent padding and spacing

### 8. src/components/settings/SettingToggle.tsx
Reusable toggle row:
- Props: label, description?, checked, onChange, disabled?
- Label on left, toggle switch on right
- Uses shadcn Switch or custom styled checkbox

---

**Acceptance Criteria:**
- Browser notification permission request works
- Timer completion triggers browser notification
- Daily reminder fires at set time (if page is open)
- Settings page loads with current user settings
- Pomodoro settings save and affect timer page
- Theme toggle correctly switches light/dark
- Notification toggles save to DB
- Data export generates JSON file download
- Delete account confirmation works
- All settings persist to Supabase user_settings table
```

---

## Phase 11: Progressive Web App (PWA) & Offline Support

**Copy and paste the following prompt into our conversation:**

---

```
Phase 11: Convert StudyFlow into a fully installable PWA with offline support.

### Files to create/modify:

### 1. Update vite.config.ts
Complete the Vite PWA plugin configuration:
```ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    name: 'StudyFlow - Study Routine Tracker',
    short_name: 'StudyFlow',
    description: 'Track your daily study sessions, manage subjects, and build streaks',
    theme_color: '#6366f1',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https?:\/\/[a-z]+\\.supabase\\.co\/rest\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
          networkTimeoutSeconds: 5,
        },
      },
    ],
  },
})
```

### 2. Create public/pwa-192x192.png and public/pwa-512x512.png
Use placeholder SVG files or simple colored squares with "SF" text. Actually — generate actual PNG files — use a simple script or just note that these need to be provided. For now, create the manifest icons as SVG files and reference them, OR generate minimal PNGs. Since we can't generate PNGs directly, create:
- public/pwa-192x192.png (note: placeholder — user should replace with real icon)
- public/pwa-512x512.png (note: placeholder)
- public/apple-touch-icon.png
- public/favicon.ico

(Just create a note comment in the vite.config.ts about replacing these.)

### 3. Update index.html
Add to `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#6366f1" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="StudyFlow" />
```

### 4. Create public/favicon.svg
Simple SVG icon (graduation cap or book icon).

### 5. src/hooks/usePWAInstall.ts
PWA install prompt hook:
```ts
interface PWAInstallState {
  canInstall: boolean
  isInstalled: boolean
  install: () => Promise<void>
  dismissed: boolean
  dismiss: () => void
}
```
- Listens for `beforeinstallprompt` event
- Stores the event for later use
- `install()` triggers the stored prompt
- `isInstalled` checks via `matchMedia('(display-mode: standalone)')` or `navigator.standalone`
- `dismissed` stored in localStorage so we don't keep asking

### 6. src/components/shared/PWAInstallPrompt.tsx
Bottom banner / modal to prompt install:
- Shown when canInstall === true && !dismissed && !isInstalled
- App icon + "Install StudyFlow for the best experience"
- "Install" button (calls install())
- "Not now" button (calls dismiss())
- "Don't show again" link
- Styled as a bottom sheet on mobile, toast on desktop

### 7. src/hooks/useOfflineSync.ts
Offline data sync hook:
```ts
interface OfflineSyncState {
  isOnline: boolean
  pendingChanges: number
  syncNow: () => Promise<void>
}
```
- Tracks online/offline status via navigator.onLine and online/offline events
- Queues mutations (create/update) in IndexedDB or localStorage when offline
- When coming back online, replay queued mutations in order
- Uses a simple queue stored in localStorage: `{ type: 'create_session', data: {...}, timestamp: 123 }`
- Shows a badge with pending change count

### 8. src/components/shared/OfflineBanner.tsx
Offline indicator banner:
- Shown when isOnline === false
- "You're offline. Changes will sync when you reconnect."
- Yellow/amber color
- Fixed at top of screen
- Dismissable

### 9. Update src/main.tsx
Add PWA registration:
- Import 'virtual:pwa-register' from vite-plugin-pwa
- Call registerSW() for service worker registration
- Show a toast when new content is available (update prompt)

### 10. Update src/styles/index.css
Add styles for:
- Safe area insets for notched phones (env(safe-area-inset-*))
- Selection color matching theme
- Scrollbar styling (thin, themed)
- Print styles (hide nav, show content)

---

**Acceptance Criteria:**
- App passes Lighthouse PWA audit (testable in Chrome DevTools)
- Install prompt appears on desktop Chrome
- App can be installed and opens in standalone mode
- Service worker registers correctly
- Timer works offline (start, pause, stop)
- When coming back online, offline timer data syncs
- Offline banner shows when disconnected
- Manifest loads correctly
- Theme color and icons display correctly on home screen
- PWA install prompt can be dismissed
```

---

## Phase 12: Polish & Extra Features

**Copy and paste the following prompt into our conversation:**

---

```
Phase 12: Add polish, ambient sounds, session reflection, habits, to-do integration, and final improvements.

### Files to create/modify:

### 1. src/components/timer/AmbientSoundSelector.tsx
Ambient sound picker:
- Props: onSelect, currentSound
- Sound options (emoji + label):
  - 🌧️ Rain
  - 🌊 Ocean Waves
  - 🔥 Fireplace
  - 🌳 Forest Birds
  - 🤍 White Noise
  - 🧘 Deep Focus (432Hz)
  - ☕ Cafe
  - ❄️ None
- Grid of buttons, selected one is highlighted
- For now, just the UI — sounds can be simple <audio> elements with loop attribute
- Audio files are hosted as public URLs (free sound effect URLs or just placeholder)
- Volume slider

### 2. src/hooks/useAmbientSound.ts
Hook for managing ambient audio:
```ts
interface AmbientSoundState {
  currentSound: string | null
  volume: number
  isPlaying: boolean
  play: (soundId: string) => void
  stop: () => void
  setVolume: (vol: number) => void
}
```
- Creates <audio> elements on-the-fly
- Loops the selected sound
- Respects user volume setting
- Saves preference to localStorage
- Supported sounds list with URLs (use free/public domain sound URLs or note to replace)

### 3. src/components/shared/SessionReflection.tsx
Session reflection component (shown after timer stops or accessible from history):
- Props: sessionId, onSave
- Rating: 1-5 stars for the session
- "What did you study?" — auto-populated from session subject/chapter
- "Key takeaways" — textarea
- "Difficulties faced" — textarea
- "Tomorrow's focus" — textarea
- "Mood" — emoji selector (😊 😐 😢 🔥 😴)
- Save button → saves to session_notes table

### 4. src/pages/analytics/ReflectionHistory.tsx (linked from analytics)
History of all session reflections:
- List of past reflections with date, subject, rating, mood
- Expand to see full reflection
- Search by keyword
- Edit/delete reflection

### 5. src/stores/habitStore.ts
Simple habit tracking store:
```ts
interface HabitState {
  habits: Habit[]
  loading: boolean
  fetchHabits: () => Promise<void>
  addHabit: (name: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  completeToday: (id: string) => Promise<void>
  getStreak: (id: string) => number
}
```
- Habit = name + streak_count + last_completed_date
- completeToday: sets last_completed_date = today, increments streak or resets to 1
- Streak logic: if last_completed_date is yesterday, increment; if today, no change (already done); otherwise reset to 1

### 6. src/pages/dashboard/HabitSection.tsx (embedded in dashboard)
Small habit tracker widget on dashboard:
- List of habits with checkbox for today
- Mini streak fire icon next to each
- "Add habit" inline button
- "View all" link
- Compact: shows only 5 most recent habits
- Progress: "3/5 habits done today"

### 7. src/components/shared/QuickTodo.tsx
Simple to-do list integrated with timer:
- Props: todos, onAdd, onToggle, onDelete
- Floating "Add Task" input at bottom
- Task items with checkbox, text, delete button
- Drag to reorder (optional, can skip)
- When timer starts, show todos as a sidebar/panel
- Can mark todo as "studying this now" which links it to the session
- Stored in localStorage (simple, no DB needed) OR in a new `todos` table
- For simplicity: store in localStorage only, with option to add to DB later

### 8. src/hooks/useTodos.ts
Todo management hook:
```ts
interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
  linkedSessionId?: string
}
interface UseTodosReturn {
  todos: Todo[]
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  linkToSession: (todoId: string, sessionId: string) => void
}
```
- Persists to localStorage with key 'studyflow-todos'
- Simple CRUD operations

### 9. Global UI improvements

**src/components/shared/ConfirmDialog.tsx**
Reusable confirmation dialog:
- Props: open, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant ('danger' | 'default')
- Danger variant: red confirm button
- Uses Dialog from shadcn or a custom backdrop modal

**src/components/shared/Skeleton.tsx**
Loading skeleton components:
- SkeletonCard, SkeletonRow, SkeletonCircle
- Animated pulse background
- Used throughout the app while data loads

**src/hooks/useKeyboardShortcuts.ts**
Keyboard shortcut hook:
```ts
function useKeyboardShortcuts(): void
```
- Space: toggle timer (when on timer page)
- N: new subject (when on subjects page)
- Escape: close modals
- /: focus search
- Register only when not in an input/textarea

### 10. Responsive review pass
Go through ALL pages and ensure:
- No horizontal scroll on any screen width (320px and up)
- Touch targets are at least 44x44px on mobile (accessibility)
- Forms are full-width on mobile
- Tables have horizontal scroll wrapper on mobile
- Dialogs are full-screen on mobile (< sm)
- Font sizes are readable (min 16px for inputs to avoid iOS zoom)

### 11. Performance optimizations
- Add React.lazy() for all page components in App.tsx
- Wrap expensive components in React.memo() where appropriate
- Use `useMemo` and `useCallback` for expensive computations in analytics
- Add loading='lazy' to any images
- Ensure all list renders have proper `key` props

---

**Acceptance Criteria:**
- Ambient sounds play and can be selected/toggled
- Session reflection saves and displays correctly
- Habit tracker shows on dashboard and persists
- Todo list works with add/toggle/delete and persists in localStorage
- Confirm dialogs show for destructive actions
- Loading skeletons show during data fetch
- Keyboard shortcuts work on relevant pages
- App is fully responsive with no horizontal scroll
- All pages use lazy loading
- No console errors or warnings
```

---

## SUPABASE SQL PROMPT (Standalone)

**Copy this prompt separately when you're ready to create the SQL files:**

---

```
Create two files for the Supabase database schema:

### File 1: /Users/rishad/Downloads/Loundsync/Study_tracker/supabase-schema.sql

This is a complete PostgreSQL schema for StudyFlow. Include ALL of the following:

1. Enable uuid-ossp extension
2. Create ALL 10 tables with exact columns:
   - profiles (id pk references auth.users, full_name, avatar_url, created_at)
   - subjects (id pk, user_id fk, name not null, color default '#6366f1', sort_order default 0, created_at)
   - chapters (id pk, subject_id fk, user_id fk, name not null, progress_pct default 0 check 0-100, checkpoint_text, created_at, updated_at)
   - study_sessions (id pk, user_id fk, subject_id fk nullable, chapter_id fk nullable, started_at, ended_at nullable, duration_seconds nullable, session_type check free/pomodoro default 'free', notes nullable, created_at)
   - daily_targets (id pk, user_id fk, target_date date, target_minutes default 120, achieved_minutes default 0, unique user_id+target_date)
   - daily_plans (id pk, user_id fk, plan_date date, chapter_id fk, planned_minutes default 60, actual_minutes default 0, status check not_started/partial/done default 'not_started', unique user_id+plan_date+chapter_id)
   - weekly_plans (id pk, user_id fk, week_start date, day_of_week int check 0-6, chapter_id fk, unique user_id+week_start+day_of_week+chapter_id)
   - user_settings (id pk, user_id fk unique, pomodoro_work_min default 25, pomodoro_break_min default 5, reminder_time time default '18:00', email_reminders bool default true, browser_notifications bool default true, created_at, updated_at)
   - habits (id pk, user_id fk, name, streak_count default 0, last_completed_date date nullable, created_at)
   - session_notes (id pk, session_id fk, user_id fk, content, created_at)

3. Proper indexes on all foreign keys and commonly queried columns
4. Auto-update trigger for updated_at on chapters and user_settings
5. RLS enabled on ALL tables with policies for select/insert/update/delete where auth.uid() = user_id
6. Helper function: get_streak(p_user_id uuid) returns int — counts consecutive days where achieved_minutes >= 50% of target
7. Use proper formatting with section headers and comments

### File 2: /Users/rishad/Downloads/Loundsync/Study_tracker/SETUP_INSTRUCTIONS.md

Step-by-step markdown guide:
1. Create Supabase project
2. Go to SQL Editor
3. Run the schema SQL
4. Verify tables in Table Editor
5. Enable Email Auth in Authentication settings
6. Copy API URL and anon key from Project Settings
7. Add to .env file
8. (Optional) Test with sample data queries
```

---

## Quick Reference

| Phase | What It Builds | Est. Prompts |
|-------|---------------|-------------|
| 1 | Project scaffolding, deps, folder structure | 1 |
| 2 | SQL schema + setup instructions | 1 |
| 3 | Auth (login/signup/forgot/route guards) | 1 |
| 4 | Sidebar + bottom nav + app shell | 1 |
| 5 | Subjects & Chapters CRUD | 1-2 |
| 6 | Timer (free + pomodoro) | 1-2 |
| 7 | Weekly + Daily planner | 1 |
| 8 | Dashboard with widgets | 1 |
| 9 | Analytics & charts | 1-2 |
| 10 | Notifications + settings | 1 |
| 11 | PWA + offline | 1 |
| 12 | Polish, sounds, habits, todos | 1-2 |

**Total: 12-16 prompts to build the entire app.**
