import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import TimerPage from '@/pages/timer/TimerPage'
import SubjectsPage from '@/pages/subjects/SubjectsPage'
import PlanningPage from '@/pages/planning/PlanningPage'
import AnalyticsPage from '@/pages/analytics/AnalyticsPage'
import SettingsPage from '@/pages/settings/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/plan" element={<PlanningPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
