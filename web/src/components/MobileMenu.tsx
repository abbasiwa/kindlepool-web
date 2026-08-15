import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Logo } from './Logo'
import { useWallet } from '../lib/wallet'
import { useAuth } from '../lib/auth'
import { Button } from './ui'
import {
  LayoutDashboard, Trophy, AlertTriangle, Wallet, CreditCard,
  Code2, BookOpen, CircleHelp, StickyNote, Activity, Info,
  Shield, Scale, FileText, X, Globe,
} from 'lucide-react'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const primary = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/disputes', label: 'Disputes', icon: AlertTriangle },
  { to: '/add-funds', label: 'Add Funds', icon: CreditCard },
]

const platform = [
  { to: '/pricing', label: 'Pricing', icon: Wallet },
  { to: '/developers', label: 'Developers', icon: Code2 },
  { to: '/how-it-works', label: 'How It Works', icon: BookOpen },
  { to: '/faq', label: 'FAQ', icon: CircleHelp },
  { to: '/docs', label: 'Docs', icon: StickyNote },
]

const company = [
  { to: '/about', label: 'About', icon: Info },
  { to: '/changelog', label: 'Changelog', icon: StickyNote },
  { to: '/status', label: 'Status', icon: Activity },
  { to: '/security', label: 'Security', icon: Shield },
  { to: '/legal/privacy', label: 'Privacy', icon: Scale },
  { to: '/legal/terms', label: 'Terms', icon: FileText },
]

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, i18n } = useTranslation()
  const { connected, connecting, connect, disconnect, address } = useWallet()
  const { user } = useAuth()
  const location = useLocation()

  // Close on route change
  useEffect(() => { onClose() }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll + Esc to close
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ]

  const truncate = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

  const Item = ({ item, onClick }: { item: (typeof primary)[number] | (typeof platform)[number] | (typeof company)[number]; onClick: () => void }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.to
    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-colors ${
          isActive ? 'bg-accent-soft text-accent-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
        }`}
      >
        <Icon size={17} strokeWidth={1.8} className="shrink-0" />
        <span className="truncate">{item.label}</span>
      </Link>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          {/* Backdrop — blurred, closes on outside click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/30 backdrop-blur-sm"
          />

          {/* Panel — slides in from the left, never scrolls */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] h-full bg-surface-1 shadow-modal overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border-subtle shrink-0">
              <Logo size={28} />
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-hover transition-colors text-text-muted"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Account */}
            <div className="px-4 pt-3 pb-1 shrink-0">
              {connected ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Wallet size={16} className="text-accent-primary shrink-0" />
                    <span className="font-mono text-sm text-text-primary truncate">{address ? truncate(address) : ''}</span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-xs font-semibold text-text-muted hover:text-text-primary shrink-0"
                  >
                    {t('nav.disconnect')}
                  </button>
                </div>
              ) : (
                <Button className="w-full" size="sm" onClick={connect} loading={connecting}>
                  <Wallet size={16} />
                  {connecting ? t('nav.connecting') : t('nav.connect')}
                </Button>
              )}
              {user && (
                <p className="mt-1.5 px-1 text-xs text-text-muted truncate">Signed in as {user.email}</p>
              )}
            </div>

            {/* Menu content — compact 2-col grid, fits viewport, no scroll */}
            <div className="flex-1 overflow-hidden px-4 pt-3 pb-2 flex flex-col gap-3">
              <div>
                <div className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Account</div>
                <div className="grid grid-cols-2 gap-1">
                  {primary.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                </div>
              </div>
              <div>
                <div className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Platform</div>
                <div className="grid grid-cols-2 gap-1">
                  {platform.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                </div>
              </div>
              <div>
                <div className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Company</div>
                <div className="grid grid-cols-2 gap-1">
                  {company.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="px-4 py-3 border-t border-border-subtle shrink-0">
              <div className="flex items-center gap-1">
                <Globe size={14} className="text-text-muted mr-1" />
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); onClose() }}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      i18n.language === lang.code ? 'bg-accent-soft text-accent-primary font-semibold' : 'text-text-muted hover:bg-surface-hover'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
