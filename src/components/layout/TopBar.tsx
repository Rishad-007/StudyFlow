import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { Bell, LogOut, Menu, X } from 'lucide-react'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/timer': 'Timer',
  '/plan': 'Plan',
  '/subjects': 'Subjects',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export function TopBar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = routeTitles[location.pathname] || 'StudyFlow'

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>

        {!isMobile && (
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[120px] truncate text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {isMobile && menuOpen && (
          <div className="fixed inset-0 top-14 z-30 bg-white px-4 py-4">
            <nav className="space-y-1">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/timer', label: 'Timer' },
                { to: '/plan', label: 'Plan' },
                { to: '/subjects', label: 'Subjects' },
                { to: '/analytics', label: 'Analytics' },
                { to: '/settings', label: 'Settings' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-3 border-gray-200" />
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
