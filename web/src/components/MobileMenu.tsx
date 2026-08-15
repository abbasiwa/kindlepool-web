import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Logo } from './Logo'
import { useAuth } from '../lib/auth'
import { Button } from './ui'
import {
  LayoutDashboard, Code2, BookOpen, CircleHelp, StickyNote, Info,
  Shield, Scale, FileText, X, Globe, LogOut, Compass, Settings, CreditCard,
} from 'lucide-react'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const publicItems = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/pricing', label: 'Pricing', icon: CreditCard },
  { to: '/how-it-works', label: 'How It Works', icon: BookOpen },
  { to: '/faq', label: 'FAQ', icon: CircleHelp },
  { to: '/docs', label: 'Docs', icon: StickyNote },
  { to: '/developers', label: 'Developers', icon: Code2 },
]

const authItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const companyItems = [
  { to: '/about', label: 'About', icon: Info },
  { to: '/security', label: 'Security', icon: Shield },
  { to: '/legal/privacy', label: 'Privacy', icon: Scale },
  { to: '/legal/terms', label: 'Terms', icon: FileText },
]

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
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

  const Item = ({ item, onClick }: { item: (typeof publicItems)[number] | (typeof authItems)[number] | (typeof companyItems)[number]; onClick: () => void }) => {
    const Icon = item.icon
    const isActive = location.pathname === item.to
    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
          isActive ? 'bg-accent-soft text-accent-primary font-semibold' : 'text-text-primary hover:bg-surface-hover'
        }`}
      >
        <Icon size={18} strokeWidth={1.8} className="shrink-0" />
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
            <div className="px-4 pt-4 pb-2 shrink-0">
              {user ? (
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-surface-2">
                  <span className="text-sm text-text-primary truncate">{user.email}</span>
                  <button
                    onClick={async () => { await logout(); onClose() }}
                    className="text-xs font-semibold text-text-muted hover:text-text-primary shrink-0 flex items-center gap-1"
                  >
                    <LogOut size={13} /> {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <Button className="w-full" size="sm" onClick={onClose}>
                  <Compass size={16} /> {t('nav.signIn')}
                </Button>
              )}
            </div>

            {/* Menu content — role-aware, no scroll */}
            <div className="flex-1 overflow-hidden px-4 py-3 flex flex-col gap-5">
              {user ? (
                <div>
                  <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Account</div>
                  <div className="space-y-1">
                    {authItems.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Menu</div>
                    <div className="space-y-1">
                      {publicItems.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                    </div>
                  </div>
                  <div>
                    <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Company</div>
                    <div className="space-y-1">
                      {companyItems.map((item) => <Item key={item.to} item={item} onClick={onClose} />)}
                    </div>
                  </div>
                </>
              )}
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
