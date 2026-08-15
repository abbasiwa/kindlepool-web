import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useWallet } from '../../lib/wallet'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { getApi } from '../../lib/sdk'
import { Card, Input, Button } from '../../components/ui'
import { useMeta } from '../../lib/seo'

import { User, Mail, Wallet, Bell, Shield, Lock, Plug, FileText, LogOut, Link2 } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'email', label: 'Email & Login', icon: Mail },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sessions', label: 'Sessions & Security', icon: Shield },
  { id: 'privacy', label: 'Privacy & Data', icon: Lock },
  { id: 'apps', label: 'Connected Apps', icon: Plug },
  { id: 'data', label: 'Export Data', icon: FileText },
]

const NOTIFICATION_EVENTS = ['deposit', 'goal_reached', 'work_submitted', 'vote_cast', 'pool_paid', 'pool_refunded']

export function Settings() {
  const { address, connected, connect } = useWallet()
  const { user, logout, linkWallet, requestWalletChallenge, updateProfile } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [active, setActive] = useState('profile')
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [linkingWallet, setLinkingWallet] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NOTIFICATION_EVENTS.map((ev) => [ev, (user?.preferences?.[ev] as boolean) ?? true])),
  )
  const [savingPrefs, setSavingPrefs] = useState(false)
  useMeta({ title: 'Settings', description: 'Manage your KindlePool account.', path: '/settings' })

  const signedIn = !!user

  // ── Profile ──────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSavingProfile(true)
    const r = await updateProfile({ displayName, bio })
    setSavingProfile(false)
    toast(r.ok ? 'Profile saved' : r.error ?? 'Failed to save profile', r.ok ? 'success' : 'error')
  }

  // ── Notifications ───────────────────────────────────────
  const handleSavePrefs = async () => {
    setSavingPrefs(true)
    const r = await updateProfile({ preferences: prefs })
    setSavingPrefs(false)
    toast(r.ok ? 'Preferences saved' : r.error ?? 'Failed to save preferences', r.ok ? 'success' : 'error')
  }

  // ── Wallet link (signed ownership proof) ────────────────
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

  if (!signedIn) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight mb-4">Settings</h1>
        <p className="text-text-muted">Sign in with your email to manage your account.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    )
  }

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : user?.walletAddress ? `${user.walletAddress.slice(0, 6)}…${user.walletAddress.slice(-4)}` : '—'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight">Settings</h1>
          <p className="text-text-muted mt-1">
            Signed in as {user?.email} · {short !== '—' ? `wallet ${short}` : 'no wallet linked'}
          </p>
        </div>
        <Button variant="secondary" onClick={async () => { await logout(); setActive('profile') }}>
          <LogOut size={16} /> Sign Out
        </Button>
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
              <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name or handle" maxLength={60} />
              <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short line about your work (max 500 chars)" maxLength={500} />
              <Button onClick={handleSaveProfile} loading={savingProfile}>Save Profile</Button>
            </Card>
          )}

          {active === 'email' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Email & Login</h2>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                <div>
                  <div className="text-sm text-text-muted">Signed in</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Verified</span>
              </div>
            </Card>
          )}

          {active === 'wallet' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Wallet</h2>
              {short !== '—' ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                  <div>
                    <div className="text-sm text-text-muted">Linked wallet</div>
                    <div className="font-mono text-sm text-text-primary">{short}</div>
                  </div>
                  <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Linked</span>
                </div>
              ) : (
                <p className="text-sm text-text-muted">No wallet linked.</p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                {!connected && (
                  <Button variant="secondary" onClick={connect}>
                    <Link2 size={16} /> Connect Wallet
                  </Button>
                )}
                <Button variant="secondary" onClick={handleLinkWallet} loading={linkingWallet}>
                  <Link2 size={16} /> Link Wallet to Account
                </Button>
              </div>
              <p className="text-xs text-text-muted">
                Your Stellar wallet is only used here to link it to your account. It is not used for authentication.
              </p>
            </Card>
          )}

          {active === 'notifications' && (
            <Card className="space-y-3">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {NOTIFICATION_EVENTS.map((ev) => (
                <label key={ev} className="flex items-center justify-between py-2">
                  <span className="text-sm capitalize">{ev.replace('_', ' ')}</span>
                  <input
                    type="checkbox"
                    checked={prefs[ev]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [ev]: e.target.checked }))}
                    className="accent-accent-primary w-4 h-4"
                  />
                </label>
              ))}
              <Button onClick={handleSavePrefs} loading={savingPrefs}>Save Preferences</Button>
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
            </Card>
          )}

          {active === 'privacy' && (
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold">Privacy & Data</h2>
              <p className="text-sm text-text-muted">Your account data and linked activity are managed here.</p>
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
              <p className="text-sm text-text-muted">Download your profile and related pool data as JSON.</p>
              <Button variant="secondary" onClick={handleExport} loading={exporting}>Export JSON</Button>
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
