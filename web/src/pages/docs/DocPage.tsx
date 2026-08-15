import { useParams, Link } from 'react-router-dom'
import { MarkdownPage } from '../../components/MarkdownPage'

const TITLES: Record<string, string> = {
  contract: 'Contract Specification',
  'security-audit': 'Security Audit',
  'known-issues': 'Known Issues',
  coverage: 'Test Coverage',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  bounty: 'Bug Bounty',
  security: 'Security Overview',
  'enterprise-plan': 'Enterprise Plan',
}

export function DocPage() {
  const { slug } = useParams()
  const s = slug ?? ''
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 text-sm">
        <Link to="/docs" className="text-text-muted hover:text-accent-primary transition-colors">← Docs</Link>
        <span className="text-text-muted">/</span>
        <span className="text-accent-primary">{s}</span>
      </div>
      <MarkdownPage slug={s} title={TITLES[s] ?? 'Documentation'} path={`/docs/${s}`} />
    </div>
  )
}
