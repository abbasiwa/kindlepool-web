import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './i18n'
import { ThemeProvider } from './lib/theme'
import { AuthProvider } from './lib/auth'
import { NotificationProvider } from './lib/notifications'
import { useLayout } from './hooks/useLayout'
import { MobileLayout } from './layouts/MobileLayout'
import { DesktopLayout } from './layouts/DesktopLayout'
import { ToastProvider } from './lib/toast'
import { RequireAuth } from './components/RequireAuth'
import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

// Public pages
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { PoolDetail } from './pages/PoolDetail'
import { DeveloperPortal } from './pages/DeveloperPortal'
import { Pricing } from './pages/Pricing'
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'
import { HowItWorks } from './pages/HowItWorks'
import { Security } from './pages/Security'
import { Login } from './pages/Login'
import { AuthCallback } from './pages/AuthCallback'
import { Docs } from './pages/docs/DocsIndex'
import { DocPage } from './pages/docs/DocPage'
import { LegalPage } from './pages/legal/LegalPage'

// Authenticated pages
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/settings/Settings'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="text-center py-24 space-y-4">
      <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">404</h1>
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
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <NotificationProvider>
              <Shell>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/pool/:id" element={<PoolDetail />} />
                  <Route path="/developers" element={<DeveloperPortal />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/docs/:slug" element={<DocPage />} />
                  <Route path="/legal/:doc" element={<LegalPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/verify" element={<AuthCallback />} />

                  {/* Authenticated */}
                  <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Shell>
            </NotificationProvider>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
