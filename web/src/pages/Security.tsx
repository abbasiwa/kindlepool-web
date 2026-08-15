import { Link } from 'react-router-dom'
import { useMeta } from '../lib/seo'
import { Card } from '../components/ui'

export function Security() {
  useMeta({ title: 'Security', description: 'KindlePool security overview and disclosures.', path: '/security' })
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-text-primary tracking-tight text-text-primary">Security</h1>
        <p className="text-text-muted mt-2">How KindlePool keeps creator and supporter funds safe.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="space-y-2">
          <h3 className="font-semibold">Trustless escrow</h3>
          <p className="text-sm text-text-muted">Funds live in a Soroban contract — the platform never holds them.</p>
        </Card>
        <Card className="space-y-2">
          <h3 className="font-semibold">Audited contract</h3>
          <p className="text-sm text-text-muted">The Soroban contract ships with a full test suite, exercised in CI against a simulated ledger.</p>
        </Card>
        <Card className="space-y-2">
          <h3 className="font-semibold">Auto-refunds</h3>
          <p className="text-sm text-text-muted">Failed goals and rejected work refund automatically; stranded refunds claimable via claim_refund.</p>
        </Card>
        <Card className="space-y-2">
          <h3 className="font-semibold">Creator vote exclusion</h3>
          <p className="text-sm text-text-muted">Creators cannot approve their own work — no self-dealing.</p>
        </Card>
      </div>

      <Card className="space-y-2">
        <h3 className="font-semibold">Disclosures</h3>
        <p className="text-sm text-text-muted">Run a responsible disclosure via our bug bounty program.</p>
        <Link to="/legal/bounty" className="text-sm text-accent-primary hover:underline">View Bug Bounty →</Link>
      </Card>
    </div>
  )
}
