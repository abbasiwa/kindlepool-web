import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useWallet } from '../../lib/wallet'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { getApi } from '../../lib/sdk'
import { Card, Input, Button } from '../../components/ui'
import { useMeta } from '../../lib/seo'

import { User, Mail, Wallet, Bell, Shield, Lock, Plug, FileText, Scale, LogOut, Link2 } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'email', label: 'Email & Login', icon: Mail },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sessions', label: 'Sessions & Security', icon: Shield },
  { id: 'privacy', label: 'Privacy & Data', icon: Lock },
  { id: 'apps', label: 'Connected Apps', icon: Plug },
  { id: 'data', label: 'Export Data', icon: FileText },
  { id: 'disputes', label: 'My Disputes', icon: Scale },
]

const NOTIFICATION_EVENTS = ['deposit', 'goal_reached', 'work_submitted', 'vote_cast', 'pool_paid', 'pool_refunded']

export function Settings() {
  const { address, connected } = useWallet()
  const { user, logout, linkWallet, login, requestWalletChallenge } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [active, setActive] = useState('profile')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [linkEmail, setLinkEmail] = useState('')
  const [linkingWallet, setLinkingWallet] = useState(false)
  const [exporting, setExporting] = useState(false)
  useMeta({ title: 'Settings', description: 'Manage your KindlePool account.', path: '/settings' })

  const signedIn = !!user

  // ── Wallet link (signed ownership proof) ─────────────────────
  const handleLinkWallet = async () => {
    if (!address || !connected) { toast('Connect your wallet first', 'error'); return }
    if (!signedIn) { toast('Sign in with email to link a wallet', 'error'); return }
    setLinkingWallet(true)
    try {
      // Server-issued one-time challenge (anti-replay).
      const ch = await requestWalletChallenge()
      if (!ch.ok || !ch.challenge) { toast(ch.error ?? 'Failed to get challenge', 'error'); return }
      const signedMessage = `KindlePool link wallet ${ch.challenge}`
      const sig = await signMessageWithFreighter(signedMessage, address)
      const result = await linkWallet(address, ch.challenge, sig)
      if (result.ok) toast('Wallet linked', 'success')
      else toast(result.error ?? 'Failed to link wallet', 'error')
    } catch (err: any) {
      toast(err?.message ?? 'Failed to link wallet', 'error')
    } finally {
      setLinkingWallet(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const api = getApi()
      const addr = address ?? user?.walletAddress ?? user?.linkedWallets?.[0]
      const [created, funded, events] = await Promise.all([
        addr ? api.getPoolsByCreator(addr) : Promise.resolve({ data: [] }),
        addr ? api.getPoolsBySupporter(addr) : Promise.resolve({ data: [] }),
        api.getEvents({ limit: 100 }).catch(() => ({ data: [] })),
      ])
      const blob = new Blob([JSON.stringify({ user, created: created.data, funded: funded.data, events: events.data }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'kindlepool-export.json'
      a.click()
      URL.revokeObjectURL(url)
      toast('Export downloaded', 'success')
    } catch {
      toast('Export failed', 'error')
    } finally { setExporting(false) }
  }

  if (!connected && !signedIn) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight mb-4">Settings</h1>
        <p className="text-text-muted">Sign in with email or connect a wallet to manage your account.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    )
  }

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Settings</h1>
          <p className="text-text-muted mt-1">
            {signedIn ? `Signed in as ${user?.email}` : 'Wallet connected'} · {connected ? `wallet ${short}` : 'no wallet'}
          </p>
        </div>
        {signedIn && (
          <Button variant="secondary" onClick={async () => { await logout(); setActive('profile') }}>
            <LogOut size={16} /> Sign Out
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-56 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {tabs.map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setActive(t.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  active === t.id ? 'bg-surface-2 font-medium text-accent-primary' : 'text-text-muted hover:text-text-primary'
                }`}>
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </nav>

        <div className="flex-1 space-y-4">
          {active === 'profile' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name or handle" />
              <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short line about your work (max 500 chars)" maxLength={500} />
              <Button onClick={() => toast('Profile saved (email storage arrives with backend persistence)', 'success')}>Save Profile</Button>
            </Card>
          )}

          {active === 'email' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Email & Login</h2>
              {signedIn ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                  <div>
                    <div className="text-sm text-text-muted">Signed in</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Verified</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-muted">Sign in with email to link your wallet and manage notifications.</p>
                  <div className="flex gap-2">
                    <Input type="email" value={linkEmail} onChange={(e) => setLinkEmail(e.target.value)} placeholder="you@example.com" />
                    <Button onClick={async () => {
                      if (!linkEmail) { toast('Enter email', 'error'); return }
                      const r = await login(linkEmail)
                      toast(r.ok ? 'Magic link sent' : r.error ?? 'Failed', r.ok ? 'success' : 'error')
                    }}>Send Link</Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {active === 'wallet' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Wallet</h2>
              {connected ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                  <div>
                    <div className="text-sm text-text-muted">Connected wallet</div>
                    <div className="font-mono text-sm text-text-primary">{short}</div>
                  </div>
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Primary</span>
                </div>
              ) : (
                <p className="text-sm text-text-muted">No wallet connected.</p>
              )}
              <Button variant="secondary" onClick={handleLinkWallet} loading={linkingWallet} disabled={!signedIn}>
                <Link2 size={16} /> {signedIn ? 'Link Wallet to Account' : 'Sign in to link wallet'}
              </Button>
              {!signedIn && <p className="text-xs text-text-muted">Email sign-in required to link a wallet.</p>}
            </Card>
          )}

          {active === 'notifications' && (
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {NOTIFICATION_EVENTS.map((ev) => (
                <label key={ev} className="flex items-center justify-between py-2">
                  <span className="text-sm capitalize">{ev.replace('_', ' ')}</span>
                  <input type="checkbox" defaultChecked className="accent-accent-primary w-4 h-4" />
                </label>
              ))}
              <Button onClick={() => toast('Preferences saved (syncs with notifier on deploy)', 'success')}>Save Preferences</Button>
            </Card>
          )}

          {active === 'sessions' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Sessions & Security</h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                <div>
                  <div className="text-sm text-text-muted">Current session</div>
                  <div className="font-mono text-xs">{user?.email ?? 'anonymous'}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={async () => { await logout(); toast('Signed out', 'success') }}>Sign Out All</Button>
              </div>
              <p className="text-xs text-text-muted">2FA is planned. Sessions are JWT-based with 7-day expiry.</p>
            </Card>
          )}

          {active === 'privacy' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Privacy & Data</h2>
              <p className="text-sm text-text-muted">Your funding activity is public on Stellar. This is a testnet beta — no real funds.</p>
              <Button variant="danger" onClick={() => toast('Account deletion is a mainnet feature', 'info')}>Delete Account</Button>
            </Card>
          )}

          {active === 'apps' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Connected Apps</h2>
              <p className="text-sm text-text-muted">Manage developer API keys via the Developer Portal.</p>
              <Link to="/developers" className="text-sm text-accent-primary hover:underline">Open Developer Portal →</Link>
            </Card>
          )}

          {active === 'data' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Export Data</h2>
              <p className="text-sm text-text-muted">Download your pools, contributions, and events as JSON.</p>
              <Button variant="secondary" onClick={handleExport} loading={exporting}>Export JSON</Button>
            </Card>
          )}

          {active === 'disputes' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">My Disputes</h2>
              <p className="text-sm text-text-muted">View all disputes on the Disputes page.</p>
              <Link to="/disputes" className="text-sm text-accent-primary hover:underline">Open Disputes →</Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Raw Stellar message signature via Freighter (wallet-link ownership proof).
async function signMessageWithFreighter(message: string, address: string): Promise<string> {
  const { signMessage } = await import('@stellar/freighter-api')
  const res = await signMessage(message, { address })
  if (!res?.signedMessage) {
    throw new Error('Wallet signing was cancelled or failed')
  }
  const signed = res.signedMessage
  if (signed && typeof signed !== 'string') {
    // Buffer form — convert to hex via Uint8Array.
    const bytes = new Uint8Array(signed as unknown as ArrayBuffer)
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
  }
  // String form is base64-encoded — decode to raw bytes, then hex.
  const bin = atob(signed as string)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}
