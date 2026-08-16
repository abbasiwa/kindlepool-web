import { useEffect, useState } from 'react'
import MarkdownIt from 'markdown-it'
import { useMeta } from '../lib/seo'
import { Card } from './ui'

const md = new MarkdownIt({ html: false, linkify: true, breaks: false })

interface MarkdownPageProps {
  slug: string
  title?: string
  description?: string
  path?: string
  fallback?: string
}
/**
 * Renders a markdown file fetched from public/docs/<slug>.md (populated at
 * build time by scripts/fetch-docs.mjs or authored directly in public/docs).
 */
export function MarkdownPage({ slug, title, description, path, fallback }: MarkdownPageProps) {
  const [html, setHtml] = useState<string | null>(null)

  useMeta({ title: title ?? 'Docs', description, path: path ?? `/docs/${slug}` })

  useEffect(() => {
    let cancelled = false
    fetch(`/docs/${slug}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status}`))))
      .then((text) => { if (!cancelled) setHtml(md.render(text)) })
      .catch(() => { if (!cancelled) setHtml(fallback ?? '<p>Documentation not available.</p>') })
    return () => { cancelled = true }
  }, [slug, fallback])

  return (
    <Card elevated className="p-6 sm:p-10">
      <article
        className="prose-docs max-w-none"
        dangerouslySetInnerHTML={{ __html: html ?? '<p>Loading…</p>' }}
      />
    </Card>
  )
}
