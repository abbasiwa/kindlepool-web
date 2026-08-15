import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Compass, PlusCircle, User, Bell } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/create', label: 'Create', icon: PlusCircle },
  { to: '/dashboard', label: 'Profile', icon: User },
  { to: '/disputes', label: 'Disputes', icon: Bell },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface-1/95 backdrop-blur-xl border-t border-border-subtle safe-bottom">
      <div className="flex items-stretch justify-around max-w-3xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.to
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              aria-label={item.label}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 min-h-[56px] text-[11px] font-medium transition-colors ${
                active ? 'text-accent-primary' : 'text-text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
