import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const TimerPage = lazy(() => import('@/pages/timer/TimerPage'))
const SubjectsPage = lazy(() => import('@/pages/subjects/SubjectsPage'))
const PlanningPage = lazy(() => import('@/pages/planning/PlanningPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

function App() {
  useKeyboardShortcuts()

  return (
    <Routes>
      <Route path="/auth/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />
      <Route path="/auth/signup" element={<SuspenseWrapper><SignupPage /></SuspenseWrapper>} />
      <Route path="/auth/forgot-password" element={<SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<SuspenseWrapper><DashboardPage /></SuspenseWrapper>} />
          <Route path="/timer" element={<SuspenseWrapper><TimerPage /></SuspenseWrapper>} />
          <Route path="/subjects" element={<SuspenseWrapper><SubjectsPage /></SuspenseWrapper>} />
          <Route path="/plan" element={<SuspenseWrapper><PlanningPage /></SuspenseWrapper>} />
          <Route path="/analytics" element={<SuspenseWrapper><AnalyticsPage /></SuspenseWrapper>} />
          <Route path="/settings" element={<SuspenseWrapper><SettingsPage /></SuspenseWrapper>} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="mt-2 text-gray-500">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
