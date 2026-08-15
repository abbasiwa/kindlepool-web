import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '../lib/wallet'
import { useAuth } from '../lib/auth'
import { Button } from './ui'
import { NotificationBell } from './NotificationBell'
import { Logo } from './Logo'
import { Wallet, Globe, Plus } from 'lucide-react'

const NAV = [
  { to: '/explore', key: 'nav.explore' },
  { to: '/create', key: 'nav.create' },
  { to: '/dashboard', key: 'nav.dashboard' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const { address, connected, connecting, connect, disconnect } = useWallet()
  const { user } = useAuth()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`
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

  const active = (to: string) => location.pathname === to

  return (
    <header className="sticky top-0 z-40 bg-surface-1/85 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0" aria-label="KindlePool home">
          <Logo size={30} />
        </Link>

        {/* ── Tablet + Desktop: full nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                active(item.to) ? 'text-accent-primary bg-accent-soft' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            to="/add-funds"
            className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-accent-foreground bg-accent-primary hover:bg-accent-hover transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            {t('nav.addFunds')}
          </Link>
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5">
          <NotificationBell />

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

          {/* Mobile: menu is in bottom nav; desktop: wallet */}
          <div className="hidden sm:block">
            {connected ? (
              <div className="flex items-center gap-2 pl-1">
                <span className="text-sm text-text-muted">
                  <Wallet size={14} className="inline mr-1" />
                  {address ? truncate(address) : ''}
                </span>
                <Button size="sm" variant="ghost" onClick={disconnect}>{t('nav.disconnect')}</Button>
              </div>
            ) : (
              <Button size="sm" onClick={connect} loading={connecting}>
                {connecting ? t('nav.connecting') : user ? user.email?.split('@')[0] : t('nav.connect')}
              </Button>
            )}
          </div>

          {/* Mobile: compact connect */}
          {connected ? (
            <button
              onClick={disconnect}
              className="sm:hidden p-2 rounded-xl text-accent-primary hover:bg-accent-soft transition-colors"
              aria-label={t('nav.disconnect')}
            >
              <Wallet size={20} />
            </button>
          ) : (
            <button
              onClick={connect}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm font-semibold text-accent-foreground bg-accent-primary hover:bg-accent-hover transition-colors"
              aria-label={t('nav.connect')}
            >
              <Wallet size={16} />
              {connecting ? t('nav.connecting') : user ? user.email?.split('@')[0] : t('nav.connect')}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
