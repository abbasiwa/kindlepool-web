import { Link } from 'react-router-dom'

const product = [
  { to: '/explore', label: 'Explore Pools' },
  { to: '/create', label: 'Create a Pool' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

const resources = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/docs', label: 'Documentation' },
  { to: '/changelog', label: 'Changelog' },
  { to: '/status', label: 'Status' },
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
    <footer className="border-t border-surface-2 bg-surface-1 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="font-semibold text-text-primary">KindlePool</div>
          <p className="text-sm text-text-muted leading-relaxed">
            Fund the work, not the creator. Trustless micro-sponsor pools on Stellar Soroban.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Product</div>
          {product.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm text-text-muted hover:text-accent-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Resources</div>
          {resources.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm text-text-muted hover:text-accent-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">Legal</div>
          {legal.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm text-text-muted hover:text-accent-primary transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-surface-2">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted">
          <span>© {new Date().getFullYear()} KindlePool · Testnet beta</span>
          <span>Built on Stellar Soroban</span>
        </div>
      </div>
    </footer>
  )
}
