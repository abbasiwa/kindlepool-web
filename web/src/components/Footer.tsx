import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const product = [
  { to: '/explore', label: 'Explore Pools' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/developers', label: 'Developers' },
]

const resources = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/docs', label: 'Documentation' },
  { to: '/security', label: 'Security' },
]

const legal = [
  { to: '/legal/privacy', label: 'Privacy' },
  { to: '/legal/terms', label: 'Terms' },
  { to: '/legal/cookies', label: 'Cookies' },
  { to: '/legal/bounty', label: 'Bug Bounty' },
  { to: '/legal/security', label: 'Security' },
  { to: '/legal/dmca', label: 'DMCA' },
]

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-surface-1 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Logo size={28} />
          <p className="text-sm text-text-muted leading-relaxed max-w-[16rem]">
            Fund the work, not the creator. Trustless micro-sponsor pools on Stellar Soroban.
          </p>
        </div>

        {[
          { title: 'Product', links: product },
          { title: 'Resources', links: resources },
          { title: 'Legal', links: legal },
        ].map((col) => (
          <div key={col.title} className="space-y-3">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">{col.title}</div>
            {col.links.map((l) => (
              <Link key={l.to} to={l.to} className="block text-sm text-text-muted hover:text-accent-primary transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} KindlePool · Testnet beta</span>
          <span>Built on Stellar Soroban</span>
        </div>
      </div>
    </footer>
  )
}
