import { useEffect, type ReactNode } from 'react'

/**
 * KindlePool is a light-only brand (mint canvas #F0FAF7) with a dark
 * full-bleed hero on the landing page. This provider ensures a light-only
 * palette (no dark-mode switch). The live browser-tab color is managed by
 * the Header (dark while the landing hero is on screen, mint otherwise),
 * so this provider does NOT override the theme-color meta.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.removeAttribute('data-theme')
  }, [])

  return <>{children}</>
}
