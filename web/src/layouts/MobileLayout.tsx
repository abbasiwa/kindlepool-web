import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'

/**
 * Mobile layout (≤767px): least structure — app-feel shell with a
 * compact top bar and a bottom nav. Secondary links live in the
 * bottom-nav "⋮" left-slide menu. No footer to reduce vertical noise.
 */
export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 text-text-primary flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-5 pb-28">{children}</main>
      <BottomNav />
    </div>
  )
}
