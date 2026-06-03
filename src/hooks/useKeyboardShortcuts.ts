import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTimerStore } from '@/stores/timerStore'

function isInputFocused(): boolean {
  const tag = document.activeElement?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (document.activeElement?.getAttribute('contenteditable') === 'true')
}

function triggerClick(selector: string) {
  const el = document.querySelector<HTMLButtonElement>(selector)
  el?.click()
}

export function useKeyboardShortcuts() {
  const location = useLocation()
  const timerStatus = useTimerStore((s) => s.status)
  const startTimer = useTimerStore((s) => s.startTimer)
  const pauseTimer = useTimerStore((s) => s.pauseTimer)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isInputFocused()) return

      if (e.key === 'Escape') {
        const backdrops = document.querySelectorAll('.fixed.inset-0.z-50')
        if (backdrops.length > 0) return // let Escape close modals naturally
        return
      }

      if (e.key === ' ' && location.pathname === '/timer') {
        e.preventDefault()
        if (timerStatus === 'idle') {
          startTimer()
        } else if (timerStatus === 'running') {
          pauseTimer()
        } else if (timerStatus === 'paused') {
          triggerClick('[data-resume-timer]')
        }
        return
      }

      if (e.key === 'n' && location.pathname === '/subjects') {
        e.preventDefault()
        triggerClick('[data-add-subject]')
        return
      }

      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"], input[placeholder*="Search"]')
        searchInput?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [location.pathname, timerStatus, startTimer, pauseTimer])
}
