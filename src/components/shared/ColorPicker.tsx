import { useState } from 'react'
import { cn } from '@/lib/utils'

const COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#d946ef', // fuchsia
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [customHex, setCustomHex] = useState('')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'h-10 w-10 rounded-full border-2 transition-transform hover:scale-110',
              value === color ? 'border-gray-900 ring-2 ring-offset-2' : 'border-transparent',
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customHex}
          onChange={(e) => {
            setCustomHex(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              onChange(e.target.value)
            }
          }}
          placeholder="#000000"
          className="w-28 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-indigo-500"
        />
        <span className="text-xs text-gray-400">or type a hex code</span>
      </div>
    </div>
  )
}
