import { Link } from 'react-router-dom'
import { useMeta } from '../../lib/seo'
import { Card } from '../../components/ui'

const docs = [
  { slug: 'contract', title: 'Contract Specification', desc: 'SponsorPool ABI, state machine, entry points, invariants.' },
  { slug: 'security-audit', title: 'Security Audit', desc: 'Internal audit report (B1.3) with findings and dispositions.' },
  { slug: 'known-issues', title: 'Known Issues', desc: 'Ledger of every flaw found and its regression test.' },
  { slug: 'coverage', title: 'Test Coverage', desc: 'Coverage report across the contract test suite.' },
  { slug: 'security', title: 'Security Overview', desc: 'How the platform keeps creator funds safe.' },
  { slug: 'enterprise-plan', title: 'Enterprise Plan', desc: 'Verification and hardening roadmap.' },
]

export function Docs() {
  useMeta({ title: 'Documentation', description: 'KindlePool technical documentation — contract, SDK, security.', path: '/docs' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Documentation</h1>
        <p className="text-text-muted mt-2">Technical documentation for builders and researchers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {docs.map((d) => (
          <Link key={d.slug} to={`/docs/${d.slug}`}>
            <Card hover className="h-full space-y-2">
              <h3 className="font-semibold text-text-primary">{d.title}</h3>
              <p className="text-sm text-text-muted">{d.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
