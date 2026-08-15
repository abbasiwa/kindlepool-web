import { useEffect, type ReactNode } from 'react'

/**
 * KindlePool is a light-only brand (mint canvas #F0FAF7).
 * This provider keeps the meta theme-color in sync and applies the
 * light palette; there is intentionally no dark-mode switch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    root.removeAttribute('data-theme')
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#F0FAF7')
  }, [])

  return <>{children}</>
}
