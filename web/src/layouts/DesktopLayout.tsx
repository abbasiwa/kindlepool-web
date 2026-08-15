import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

/**
 * Tablet + Desktop layout (≥768px): full structure — top nav with all
 * links, wide canvas, footer with full site map. Tablet (768–1023px)
 * and desktop (≥1024px) share this shell.
 */
export function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 text-text-primary flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</main>
      <Footer />
    </div>
  )
}
