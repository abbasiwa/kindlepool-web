import { useParams } from 'react-router-dom'
import { MarkdownPage } from '../../components/MarkdownPage'
import { DocsLayout } from '../../layouts/DocsLayout'

const LEGAL: Record<string, { title: string; slug: string; description: string }> = {
  privacy: { title: 'Privacy Policy', slug: 'privacy', description: 'How KindlePool collects, uses, and protects your data.' },
  terms: { title: 'Terms of Service', slug: 'terms', description: 'The terms that apply when you use KindlePool.' },
  cookies: { title: 'Cookies Policy', slug: 'privacy', description: 'How KindlePool uses cookies.' },
  bounty: { title: 'Bug Bounty Program', slug: 'bounty', description: 'Report security vulnerabilities and earn rewards.' },
  security: { title: 'Security', slug: 'security', description: 'How KindlePool keeps creator funds safe.' },
  dmca: { title: 'DMCA Policy', slug: 'privacy', description: 'Copyright and takedown policy for KindlePool.' },
}

export function LegalPage() {
  const { doc } = useParams()
  const entry = LEGAL[doc ?? ''] ?? { title: 'Legal', slug: 'privacy', description: 'Legal information for KindlePool.' }
  return (
    <DocsLayout>
      <MarkdownPage slug={entry.slug} title={entry.title} description={entry.description} path={`/legal/${doc}`} />
    </DocsLayout>
  )
}
