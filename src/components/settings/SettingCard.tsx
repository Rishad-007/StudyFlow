import type { ReactNode } from 'react'

interface SettingCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingCard({ title, description, children }: SettingCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}
