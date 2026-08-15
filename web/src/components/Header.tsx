import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { Button } from './ui'
import { NotificationBell } from './NotificationBell'
import { Logo } from './Logo'
import { Globe, LogOut, UserCircle } from 'lucide-react'

const PUBLIC_NAV = [
  { to: '/explore', key: 'nav.explore' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
  { to: '/docs', label: 'Docs' },
]

const AUTH_NAV = [
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/explore', key: 'nav.explore' },
  { to: '/settings', label: 'Settings' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
  ]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const nav = user ? AUTH_NAV : PUBLIC_NAV
  const active = (to: string) => location.pathname === to

  return (
    <header className="sticky top-0 z-40 bg-surface-1/85 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0" aria-label="KindlePool home">
          <Logo size={30} />
        </Link>

        {/* ── Tablet + Desktop: role-aware nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                active(item.to) ? 'text-accent-primary bg-accent-soft' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {item.label ?? t(item.key)}
            </Link>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5">
          {user && <NotificationBell />}

          {/* Language (desktop only) */}
          <div ref={langRef} className="relative hidden lg:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="p-2 rounded-xl hover:bg-surface-hover transition-colors text-text-muted"
              aria-label="Switch language"
            >
              <Globe size={18} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 bg-surface-1 rounded-xl shadow-popover border border-border-subtle overflow-hidden z-50 min-w-[100px]"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false) }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover transition-colors ${
                        i18n.language === lang.code ? 'font-semibold text-accent-primary' : 'text-text-primary'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth-aware account area (desktop) */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 pl-1">
              <Link
                to="/settings"
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-surface-hover transition-colors"
              >
                <UserCircle size={20} className="text-accent-primary" />
                <span className="text-sm text-text-primary font-medium">{user.email?.split('@')[0]}</span>
              </Link>
              <Button size="sm" variant="ghost" onClick={logout}>
                <LogOut size={15} /> {t('nav.signOut')}
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button size="sm" onClick={() => window.location.assign('/login')}>
                {t('nav.signIn')}
              </Button>
            </div>
          )}

          {/* Mobile auth button */}
          {user ? (
            <Link
              to="/settings"
              className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl text-accent-primary hover:bg-accent-soft transition-colors"
              aria-label="Settings"
            >
              <UserCircle size={22} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="sm:hidden inline-flex items-center px-3 h-9 rounded-xl text-sm font-semibold text-accent-foreground bg-accent-primary hover:bg-accent-hover transition-colors"
            >
              {t('nav.signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
