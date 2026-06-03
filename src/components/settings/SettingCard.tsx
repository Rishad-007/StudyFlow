import type { ReactNode } from 'react'

interface SettingCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingCard({ title, description, children }: SettingCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}
