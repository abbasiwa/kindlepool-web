import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'

const entries = [
  { v: '0.1.0', d: '2026-08-14', items: ['Contract v4 live on testnet', 'Unified backend boots all services', 'Web wired to Soroban contracts', 'SDK published to GitHub Packages', 'Repo split: api + web'] },
]

export function Changelog() {
  useMeta({ title: 'Changelog', description: 'Release notes for KindlePool.', path: '/changelog' })
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Changelog</h1>
        <p className="text-text-muted mt-2">What's shipping, and when.</p>
      </div>
      {entries.map((e) => (
        <Card key={e.v} className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-text-primary">v{e.v}</h2>
            <span className="text-sm text-text-muted">{e.d}</span>
          </div>
          <ul className="space-y-1.5">
            {e.items.map((it) => <li key={it} className="text-sm text-text-muted list-disc list-inside">{it}</li>)}
          </ul>
        </Card>
      ))}
    </div>
  )
}
