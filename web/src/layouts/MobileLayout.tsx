import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import { Footer } from '../components/Footer'

/**
 * Mobile layout: single column, bottom nav bar, primary action accessible.
 * Safe-area aware, app-feel shell.
 */
export function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 text-text-primary flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-4 pb-28">{children}</main>
      <BottomNav />
      <Footer />
    </div>
  )
}
