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

        <main className="px-4 pb-20 pt-6 md:px-6 md:pb-0 lg:px-8 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
