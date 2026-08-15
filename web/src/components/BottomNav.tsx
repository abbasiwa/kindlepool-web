import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Compass, UserCircle, MoreHorizontal } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../lib/auth'

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const items = user
    ? [
        { to: '/', label: 'nav.home', icon: Home },
        { to: '/explore', label: 'nav.explore', icon: Compass },
        { to: '/dashboard', label: 'nav.dashboard', icon: UserCircle },
      ]
    : [
        { to: '/', label: 'nav.home', icon: Home },
        { to: '/explore', label: 'nav.explore', icon: Compass },
        { to: '/login', label: 'nav.signIn', icon: UserCircle },
      ]

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-surface-1/95 backdrop-blur-xl border-t border-border-subtle safe-bottom">
        <div className="flex items-stretch justify-around max-w-md mx-auto px-2">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.to
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                aria-label={t(item.label)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] text-[10px] font-medium transition-colors ${
                  active ? 'text-accent-primary' : 'text-text-muted'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span>{t(item.label)}</span>
              </button>
            )
          })}

          {/* More (⋮) — opens left-slide menu */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.more')}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] text-[10px] font-medium transition-colors ${
              menuOpen ? 'text-accent-primary' : 'text-text-muted'
            }`}
          >
            <MoreHorizontal size={22} strokeWidth={2} className="rotate-90" />
            <span>{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
