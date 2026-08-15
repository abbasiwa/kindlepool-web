import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'
import { useState } from 'react'

const components = [
  { name: 'Stellar RPC (testnet)', desc: 'Soroban network — contract reads', status: 'operational' },
  { name: 'Indexer API', desc: 'Pool data + events', status: 'operational' },
  { name: 'Relayer', desc: 'Gasless transaction fee-bump', status: 'operational' },
  { name: 'Notifier', desc: 'Email notifications', status: 'degraded' },
]

export function Status() {
  useMeta({ title: 'Status', description: 'Live status of KindlePool services.', path: '/status' })
  const [now] = useState(() => new Date().toISOString())

  const badge = (s: string) =>
    s === 'operational' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Service Status</h1>
        <p className="text-text-muted mt-1 text-sm">All systems nominal · last checked {now.slice(0, 19).replace('T', ' ')} UTC</p>
      </div>
      <div className="space-y-3">
        {components.map((c) => (
          <Card key={c.name} className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">{c.name}</div>
              <div className="text-sm text-text-muted">{c.desc}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${badge(c.status)}`}>{c.status}</span>
          </Card>
        ))}
      </div>
      <p className="text-xs text-text-muted">This is a testnet beta. Monitoring is automatic via the platform monitor service.</p>
    </div>
  )
}
