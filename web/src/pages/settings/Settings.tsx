import { useState } from 'react'
import { useWallet } from '../../lib/wallet'
import { useToast } from '../../lib/toast'
import { Card, Input, Button } from '../../components/ui'
import { useMeta } from '../../lib/seo'
import { User, Mail, Wallet, Bell, Palette, Shield, Lock, Plug, FileText, Scale } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'email', label: 'Email & Login', icon: Mail },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'sessions', label: 'Sessions & Security', icon: Shield },
  { id: 'privacy', label: 'Privacy & Data', icon: Lock },
  { id: 'apps', label: 'Connected Apps', icon: Plug },
  { id: 'data', label: 'Export Data', icon: FileText },
  { id: 'disputes', label: 'My Disputes', icon: Scale },
]

export function Settings() {
  const { address, connected } = useWallet()
  const { toast } = useToast()
  const [active, setActive] = useState('profile')
  useMeta({ title: 'Settings', description: 'Manage your KindlePool account.', path: '/settings' })

  if (!connected || !address) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p className="text-text-muted">Connect your wallet to manage your account.</p>
      </div>
    )
  }

  const short = `${address.slice(0, 6)}…${address.slice(-4)}`

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account, wallet, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar (desktop) / horizontal scroll (mobile) */}
        <nav className="md:w-56 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  active === t.id ? 'bg-surface-2 font-medium text-accent-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {active === 'profile' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <Input label="Display name" placeholder="Your name or handle" />
              <Input label="Bio" placeholder="A short line about your work (max 500 chars)" maxLength={500} />
              <Input label="Avatar URL" placeholder="https://…" />
              <Button>Save Profile</Button>
            </Card>
          )}

          {active === 'email' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Email & Login</h2>
              <p className="text-sm text-text-muted">Email-based login is coming in a future release (Phase 5).</p>
              <Input label="Email" type="email" placeholder="you@example.com" disabled />
            </Card>
          )}

          {active === 'wallet' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Wallet</h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                <div>
                  <div className="text-sm text-text-muted">Connected wallet</div>
                  <div className="font-mono text-sm text-text-primary">{short}</div>
                </div>
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Primary</span>
              </div>
              <p className="text-xs text-text-muted">
                Linking additional wallets is coming with email auth. The contract enforces creator-vote exclusion (creator cannot vote on their own pool).
              </p>
            </Card>
          )}

          {active === 'notifications' && (
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {['deposit', 'goal_reached', 'work_submitted', 'vote_cast', 'pool_paid', 'pool_refunded'].map((ev) => (
                <label key={ev} className="flex items-center justify-between py-2">
                  <span className="text-sm capitalize">{ev.replace('_', ' ')}</span>
                  <input type="checkbox" defaultChecked className="accent-accent-primary w-4 h-4" />
                </label>
              ))}
              <Button>Save Preferences</Button>
            </Card>
          )}

          {active === 'appearance' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Appearance</h2>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'system'].map((t) => (
                  <button key={t} className="py-3 rounded-xl bg-surface-2 hover:bg-cream-300 capitalize text-sm">{t}</button>
                ))}
              </div>
              <p className="text-xs text-text-muted">Theme toggle persists via localStorage; meta theme-color follows Surface-0.</p>
            </Card>
          )}

          {active === 'sessions' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Sessions & Security</h2>
              <p className="text-sm text-text-muted">Active sessions and 2FA arrive with email auth (Phase 5).</p>
            </Card>
          )}

          {active === 'privacy' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Privacy & Data</h2>
              <p className="text-sm text-text-muted">Your data is public on-chain (Stellar). This is a testnet beta — no real funds.</p>
              <Button variant="danger" onClick={() => toast('Account deletion coming with email auth', 'info')}>
                Delete Account
              </Button>
            </Card>
          )}

          {active === 'apps' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Connected Apps</h2>
              <p className="text-sm text-text-muted">API keys and integrations arrive with the developer portal (Phase 5).</p>
            </Card>
          )}

          {active === 'data' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Export Data</h2>
              <p className="text-sm text-text-muted">Export your pools, contributions, and activity as JSON.</p>
              <Button variant="secondary" onClick={() => toast('Export requires email auth (Phase 5)', 'info')}>
                Export JSON
              </Button>
            </Card>
          )}

          {active === 'disputes' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">My Disputes</h2>
              <p className="text-sm text-text-muted">View your open disputes. See the Disputes page for the full list.</p>
              <Button variant="secondary" onClick={() => window.location.href = '/disputes'}>Open Disputes</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
