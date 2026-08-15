import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, Button, Input } from '../components/ui'
import { useToast } from '../lib/toast'
import { Code, Key, Globe, BookOpen, ArrowRight, Copy, Check } from 'lucide-react'

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v1/pools', desc: 'List pools with filters and pagination' },
  { method: 'GET', path: '/api/v1/pools/:id', desc: 'Get pool details' },
  { method: 'GET', path: '/api/v1/pools/:id/supporters', desc: 'List supporters for a pool' },
  { method: 'GET', path: '/api/v1/pools/:id/events', desc: 'Pool event history' },
  { method: 'GET', path: '/api/v1/supporters/:address/pools', desc: 'Pools funded by address' },
  { method: 'GET', path: '/api/v1/creators/:address/pools', desc: 'Pools created by address' },
  { method: 'GET', path: '/api/v1/events', desc: 'All events (filterable by type)' },
  { method: 'GET', path: '/api/v1/auth/me', desc: 'Current user (Bearer token)' },
]

export function DeveloperPortal() {
  const { toast } = useToast()
  const [keyName, setKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerateKey = async () => {
    if (!keyName) { toast('Enter a name for your key', 'error'); return }
    const base = import.meta.env.VITE_INDEXER_URL ?? 'https://kindlepool-api-f31559cad8e5.herokuapp.com'
    try {
      const res = await fetch(`${base}/api/v1/admin/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': import.meta.env.VITE_ADMIN_KEY ?? '' },
        body: JSON.stringify({ name: keyName, tier: 'free' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.api_key) throw new Error(data.error ?? 'Failed to create key')
      setGeneratedKey(data.api_key)
      toast('API key generated! Copy it now — you won\'t see it again.', 'success')
    } catch (err: any) {
      toast(err?.message ?? 'Key generation requires admin access', 'error')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Code className="text-accent-primary" size={28} />
        <div>
          <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Developer Portal</h1>
          <p className="text-text-muted mt-1">Build on KindlePool with our API and SDK</p>
        </div>
      </div>

      <Card className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Quick Start</h2>
        <div className="bg-surface-2 rounded-xl p-4 font-mono text-sm space-y-2">
          <p className="text-text-muted"># Install the SDK</p>
          <p className="text-text-primary font-medium">npm install @abbasiwa/kindlepool-sdk</p>
          <p className="text-text-muted mt-3"># List trending pools</p>
          <p className="text-text-primary font-medium">
            {`import { KindlePoolAPI } from '@abbasiwa/kindlepool-sdk'`}<br />
            {`const api = new KindlePoolAPI({ baseUrl: 'https://kindlepool-api-f31559cad8e5.herokuapp.com', apiKey: 'kp_your_key' })`}<br />
            {`const pools = await api.listPools({ sort: 'most_funded' })`}
          </p>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Key className="text-accent-primary" size={20} />
          <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight text-text-primary">API Keys</h2>
        </div>
        {!generatedKey ? (
          <div className="space-y-4">
            <Input label="Key Name" value={keyName} onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., My Discord Bot" />
            <Button onClick={handleGenerateKey} disabled={!keyName}>
              <Key size={16} /> Generate API Key
            </Button>
            <p className="text-xs text-text-muted">Requires the admin key (VITE_ADMIN_KEY). Public reads need no key.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-success font-medium">Key generated successfully!</p>
            <div className="flex items-center gap-2 bg-surface-2 rounded-xl p-3">
              <code className="flex-1 text-sm font-mono break-all">{generatedKey}</code>
              <button onClick={() => { copyToClipboard(generatedKey); setCopied(true) }}
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-xs text-error">Save this key — it won't be shown again.</p>
            <Button variant="ghost" onClick={() => setGeneratedKey(null)}>Generate another</Button>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="text-accent-primary" size={20} />
          <h2 className="text-xl font-display font-semibold text-text-primary tracking-tight text-text-primary">API Endpoints</h2>
        </div>
        <div className="space-y-2">
          {API_ENDPOINTS.map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-surface-2 transition-colors">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-success/20 text-success' : 'bg-accent-primary/20 text-accent-primary'}`}>{ep.method}</span>
              <code className="text-sm flex-1">{ep.path}</code>
              <span className="text-xs text-text-muted hidden sm:inline">{ep.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="font-bold text-text-primary">Contract SDK</h3>
          <p className="text-sm text-text-muted">Interact directly with the Soroban contract.</p>
          <div className="bg-surface-2 rounded-xl p-3 font-mono text-xs space-y-1">
            <p className="text-text-muted">{'import { KindlePoolContract } from \'@abbasiwa/kindlepool-sdk\''}</p>
            <p className="text-text-muted">{'const contract = new KindlePoolContract('}</p>
            <p className="text-text-muted">{'  \'CA...CONTRACT_ID...\''}</p>
            <p className="text-text-muted">{')'}</p>
            <p className="text-text-primary mt-2">{'await contract.create(params, source, signer)'}</p>
            <p className="text-text-primary">{'await contract.deposit(params, source, signer)'}</p>
            <p className="text-text-primary">{'await contract.vote(params, source, signer)'}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="font-bold text-text-primary">Webhook Events</h3>
          <p className="text-sm text-text-muted">Receive real-time notifications.</p>
          <div className="bg-surface-2 rounded-xl p-3 font-mono text-xs space-y-1">
            <p className="text-text-muted">{'X-KindlePool-Signature: sha256 HMAC'}</p>
            <p className="text-text-muted">{'X-KindlePool-Event: event_type'}</p>
            <p className="text-text-muted">{'Content-Type: application/json'}</p>
            <p className="text-text-primary mt-2">{'{ "event_type": "p_dep",'}</p>
            <p className="text-text-primary">{'  "pool_id": 1,'}</p>
            <p className="text-text-primary">{'  "data": { ... } }'}</p>
          </div>
          <p className="text-xs text-text-muted">Event types: p_creat, p_dep, p_goal, p_work, p_vote, p_paid, p_ref, p_disp, p_resl</p>
        </Card>
      </div>

      <div className="text-center py-8">
        <a href="/docs" className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors font-medium">
          <BookOpen size={18} /> View Documentation <ArrowRight size={16} />
        </a>
      </div>
    </motion.div>
  )
}
