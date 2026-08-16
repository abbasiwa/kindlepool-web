import { useParams } from 'react-router-dom'
import { MarkdownPage } from '../../components/MarkdownPage'
import { DocsLayout } from '../../layouts/DocsLayout'

const DOCS_META: Record<string, { title: string; description: string }> = {
  overview: {
    title: 'What is KindlePool?',
    description: 'KindlePool is a simple creator-funding platform on Stellar. Supporters fund specific work, and funds release only when the community approves.',
  },
  'getting-started': {
    title: 'Getting Started',
    description: 'Sign in, create a pool or fund one, deliver work, and get paid — a quick guide to using KindlePool.',
  },
  'how-funding-works': {
    title: 'How Funding Works',
    description: 'The full KindlePool flow: create a pool, supporters contribute, the goal is met, work is reviewed, and funds settle automatically.',
  },
  refunds: {
    title: 'Refunds',
    description: 'When and how KindlePool refunds supporters automatically — unmet goals, rejected work, cancellations, and disputes.',
  },
  security: {
    title: 'Security at KindlePool',
    description: 'How KindlePool protects funds: smart-contract escrow, automatic refunds, community checks, and responsible disclosure.',
  },
}

export function DocPage() {
  const { slug } = useParams()
  const s = slug ?? ''
  const meta = DOCS_META[s]

  return (
    <DocsLayout>
      <MarkdownPage
        slug={s}
        title={meta?.title}
        description={meta?.description}
        path={`/docs/${s}`}
        fallback="This document isn't available yet."
      />
    </DocsLayout>
  )
}
