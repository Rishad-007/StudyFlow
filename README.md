# StudyFlow

A full-featured daily study routine tracker with timer, planning, analytics, habits, and PWA support.

## Features

- **Timer System** — Free study mode + Pomodoro timer with work/break cycles, circular SVG display
- **Subjects & Chapters** — CRUD management with color-coded progress tracking
- **Weekly & Daily Planning** — 7-day grid planner, per-chapter time allocation, status tracking
- **Dashboard** — Daily progress ring, streak badges, quick-start timer, motivational quotes
- **Analytics & Charts** — Subject pie chart, daily bar chart, chapter progress, sessions table with search/pagination
- **Habit Tracker** — Daily habit check-ins with streak counting
- **Session Reflection** — Star rating, mood selector, takeaways, difficulties, tomorrow's focus
- **Ambient Sounds** — Rain, ocean, fireplace, forest, white noise, deep focus, cafe
- **Todo List** — Local-storage-based tasks with timer integration
- **Keyboard Shortcuts** — Space (timer), N (new subject), Escape (close modals)
- **PWA & Offline** — Installable, service worker, offline timer persistence
- **Notifications** — Browser notifications for timer events and daily reminders

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18, TypeScript, Tailwind v4 |
| State | Zustand, TanStack Query |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Charts | Recharts |
| Dates | date-fns |
| Icons | lucide-react |
| PWA | vite-plugin-pwa (Workbox) |
| Build | Vite |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
# Clone and install
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# Run database schema in Supabase SQL Editor
# Open supabase-schema.sql → copy all → paste in Supabase SQL Editor → Run

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173`.

### Supabase Configuration

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**, run the entire `supabase-schema.sql` (creates 10 tables + RLS + triggers)
3. Go to **Authentication → Providers**, enable Email auth (disable email confirmation for testing)
4. Go to **Project Settings → API**, copy Project URL and anon key into `.env`

Detailed instructions are in [`manual.md`](./manual.md).

## Project Structure

```
src/
├── components/
│   ├── analytics/      # SubjectPieChart, DailyBarChart, SessionsTable, etc.
│   ├── dashboard/      # DailyProgressRing, StreakBadge, QuickStartTimer, etc.
│   ├── layout/         # AppShell, Sidebar, BottomNav, TopBar
│   ├── planning/       # WeeklyPlanner, DailyPlanner, DayColumn, etc.
│   ├── settings/       # SettingCard, SettingToggle
│   ├── shared/         # ConfirmDialog, Skeleton, QuickTodo, SessionReflection, etc.
│   ├── subjects/       # SubjectCard, ChapterItem, AddSubjectModal, etc.
│   └── timer/          # CircularTimer, TimerControls, AmbientSoundSelector, etc.
├── hooks/              # useTimer, useTodos, useAmbientSound, useKeyboardShortcuts, etc.
├── pages/              # auth/, dashboard/, timer/, subjects/, planning/, analytics/, settings/
├── stores/             # authStore, subjectStore, timerStore, planStore, habitStore, etc.
├── services/           # supabase.ts
├── types/              # index.ts, supabase.ts
├── utils/              # analytics.ts
└── lib/                # utils.ts (cn)
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build
npx tsc --noEmit     # TypeScript type check
npx tsc -b           # Stricter build-mode check
```

## Deployment

### Netlify / Vercel / Cloudflare Pages

1. Build command: `npm run build`
2. Output directory: `dist`
3. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. For Netlify/Cloudflare: add a `public/_redirects` file with `/* /index.html 200`

## License

MIT
