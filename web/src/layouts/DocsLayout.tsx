import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BookOpen, FileText, ShieldCheck, CreditCard, ChevronRight, Sparkles, Wallet, CircleHelp } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon?: ReactNode
}

const DOC_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Learn',
    items: [
      { to: '/docs/overview', label: 'Overview', icon: <Sparkles size={15} /> },
      { to: '/docs/getting-started', label: 'Getting Started', icon: <Wallet size={15} /> },
      { to: '/docs/how-funding-works', label: 'How Funding Works', icon: <BookOpen size={15} /> },
      { to: '/docs/refunds', label: 'Refunds', icon: <CircleHelp size={15} /> },
    ],
  },
  {
    section: 'Trust & Legal',
    items: [
      { to: '/docs/security', label: 'Security', icon: <ShieldCheck size={15} /> },
      { to: '/legal/privacy', label: 'Privacy', icon: <FileText size={15} /> },
      { to: '/legal/terms', label: 'Terms', icon: <FileText size={15} /> },
      { to: '/legal/bounty', label: 'Bug Bounty', icon: <CreditCard size={15} /> },
    ],
  },
]

export function DocsLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  // Breadcrumb from the current path
  const crumb = pathname.split('/').filter(Boolean)
  const pageLabel = DOC_NAV.flatMap((s) => s.items).find((i) => i.to === pathname)?.label ?? crumb[crumb.length - 1] ?? 'Docs'

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-text-muted mb-6" aria-label="Breadcrumb">
        <Link to="/docs" className="hover:text-accent-primary transition-colors font-medium">Docs</Link>
        <ChevronRight size={14} className="text-text-muted" />
        <span className="text-text-primary capitalize">{pageLabel}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-60 shrink-0">
          <nav className="space-y-6 md:sticky md:top-24">
            {DOC_NAV.map((group) => (
              <div key={group.section}>
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 px-3">{group.section}</div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.to
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                          active
                            ? 'bg-accent-soft text-accent-primary font-semibold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
