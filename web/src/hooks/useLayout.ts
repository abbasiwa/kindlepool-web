import { useState, useEffect } from 'react'

export type LayoutMode = 'mobile' | 'desktop'

/**
 * Container-query based layout detection. Mobile ≤ 768px, desktop > 768px.
 * Uses the window width as a proxy (container queries need CSS `@container`
 * support; for layout switching the window size is the pragmatic signal).
 */
export function useLayout(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>(() =>
    typeof window !== 'undefined' ? (window.innerWidth <= 768 ? 'mobile' : 'desktop') : 'desktop',
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setMode(mq.matches ? 'mobile' : 'desktop')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return mode
}
