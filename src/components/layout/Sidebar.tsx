import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Timer,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  BookOpen as BookOpenIcon,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/timer', label: 'Timer', icon: Timer },
  { to: '/plan', label: 'Plan', icon: Calendar },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <BookOpenIcon className="h-6 w-6 text-indigo-500" />
        <span className="text-lg font-bold text-gray-900">StudyFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate text-sm text-gray-700">
            {user?.email}
          </div>
          <button
            onClick={signOut}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
