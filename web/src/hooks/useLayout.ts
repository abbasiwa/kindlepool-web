import { useState, useEffect } from 'react'

export type LayoutMode = 'mobile' | 'tablet' | 'desktop'

/**
 * Three-tier responsive layout detection:
 *  - mobile  ≤ 767px   → least structure (bottom nav, compact top bar)
 *  - tablet  768–1023px → same structure as desktop
 *  - desktop ≥ 1024px  → most structure (full top nav, wide canvas)
 */
export function useLayout(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>(() =>
    typeof window !== 'undefined' ? resolveMode(window.innerWidth) : 'desktop',
  )

  useEffect(() => {
    const update = () => setMode(resolveMode(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return mode
}

function resolveMode(width: number): LayoutMode {
  if (width <= 767) return 'mobile'
  if (width <= 1023) return 'tablet'
  return 'desktop'
}
