import { useParams, Link } from 'react-router-dom'
import { MarkdownPage } from '../../components/MarkdownPage'

const LEGAL: Record<string, { title: string; slug: string }> = {
  privacy: { title: 'Privacy Policy', slug: 'privacy' },
  terms: { title: 'Terms of Service', slug: 'terms' },
  cookies: { title: 'Cookies Policy', slug: 'privacy' },
  bounty: { title: 'Bug Bounty Program', slug: 'bounty' },
  security: { title: 'Security Disclosure', slug: 'security' },
  dmca: { title: 'DMCA Policy', slug: 'privacy' },
}

export function LegalPage() {
  const { doc } = useParams()
  const entry = LEGAL[doc ?? ''] ?? { title: 'Legal', slug: 'privacy' }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 text-sm">
        <Link to="/" className="text-text-muted hover:text-accent-primary transition-colors">← Home</Link>
        <span className="text-text-muted">/</span>
        <span className="text-accent-primary">{doc}</span>
      </div>
      <MarkdownPage slug={entry.slug} title={entry.title} path={`/legal/${doc}`} />
    </div>
  )
}
