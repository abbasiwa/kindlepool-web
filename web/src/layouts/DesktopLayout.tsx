import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

/**
 * Desktop layout: multi-column shell, top nav only, wider max-width,
 * more content density.
 */
export function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 text-text-primary flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </div>
  )
}
