import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './i18n'
import { ThemeProvider } from './lib/theme'
import { WalletProvider } from './lib/wallet'
import { NotificationProvider } from './lib/notifications'
import { CreatorProvider } from './lib/creator'
import { useLayout } from './hooks/useLayout'
import { MobileLayout } from './layouts/MobileLayout'
import { DesktopLayout } from './layouts/DesktopLayout'
import { ToastProvider } from './lib/toast'
import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

// Existing pages
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { PoolDetail } from './pages/PoolDetail'
import { CreatePool } from './pages/CreatePool'
import { Dashboard } from './pages/Dashboard'
import { AddFunds } from './pages/AddFunds'
import { CreatorAnalytics } from './pages/CreatorAnalytics'
import { Disputes } from './pages/Disputes'
import { DeveloperPortal } from './pages/DeveloperPortal'
import { Pricing } from './pages/Pricing'
import { Leaderboard } from './pages/Leaderboard'
import { PlatformAnalytics } from './pages/PlatformAnalytics'

// Phase 4 pages
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'
import { HowItWorks } from './pages/HowItWorks'
import { Changelog } from './pages/Changelog'
import { Security } from './pages/Security'
import { Status } from './pages/Status'
import { Settings } from './pages/settings/Settings'
import { Docs } from './pages/docs/DocsIndex'
import { DocPage } from './pages/docs/DocPage'
import { LegalPage } from './pages/legal/LegalPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-4xl font-bold text-text-primary">404</h1>
      <p className="text-text-muted">This page doesn't exist.</p>
      <Link to="/" className="inline-block mt-4 text-accent-primary hover:text-accent-hover transition-colors">
        ← Back home
      </Link>
    </div>
  )
}

function Shell({ children }: { children: ReactNode }) {
  const mode = useLayout()
  return mode === 'mobile' ? <MobileLayout>{children}</MobileLayout> : <DesktopLayout>{children}</DesktopLayout>
}

export default function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <NotificationProvider>
              <CreatorProvider>
                <Shell>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/pool/:id" element={<PoolDetail />} />
                    <Route path="/create" element={<CreatePool />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-funds" element={<AddFunds />} />
                    <Route path="/creator" element={<CreatorAnalytics />} />
                    <Route path="/disputes" element={<Disputes />} />
                    <Route path="/developers" element={<DeveloperPortal />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/analytics" element={<PlatformAnalytics />} />

                    {/* Phase 4 */}
                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/changelog" element={<Changelog />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/docs/:slug" element={<DocPage />} />
                    <Route path="/legal/:doc" element={<LegalPage />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Shell>
              </CreatorProvider>
            </NotificationProvider>
          </BrowserRouter>
        </ToastProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}
