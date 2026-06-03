import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { TopBar } from '@/components/layout/TopBar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="md:ml-64">
        <TopBar />

        <main className="pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
