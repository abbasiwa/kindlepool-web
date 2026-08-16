// Fetches documentation markdown from the kindlepool-api repo at build time
// and writes it into public/docs/. The .md files remain the canonical source
// in the api repo — the web renders them, it does not duplicate them.
//
// Only legal/regulatory docs are fetched from the repo. Product/help docs are
// authored directly in public/docs/ (they must stay simple and SEO-friendly).
//
// Usage: node scripts/fetch-docs.mjs
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const API_REPO = process.env.VITE_DOCS_REPO ?? 'abbasiwa/kindlepool-api'
const BRANCH = process.env.VITE_DOCS_BRANCH ?? 'main'
const RAW = `https://raw.githubusercontent.com/${API_REPO}/${BRANCH}/docs`

// Only safe, non-technical legal documents. Internal specs, audit reports,
// known-issues ledgers, and coverage reports are NOT exposed on the public site.
const DOCS = [
  { file: 'PRIVACY.md', slug: 'privacy' },
  { file: 'TERMS.md', slug: 'terms' },
  { file: 'BOUNTY.md', slug: 'bounty' },
  { file: 'SECURITY.md', slug: 'security' },
]

async function main() {
  const outDir = join(__dirname, '..', 'public', 'docs')
  mkdirSync(outDir, { recursive: true })
  const index = []

  for (const { file, slug } of DOCS) {
    const url = `${RAW}/${file}`
    try {
      const headers = {}
      if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const md = await res.text()
      writeFileSync(join(outDir, `${slug}.md`), md)
      index.push({ slug, file })
      console.log(`✓ docs/${slug}.md ← ${file}`)
    } catch (err) {
      console.warn(`⚠ skip ${file}: ${err.message}`)
    }
  }

  writeFileSync(join(outDir, 'index.json'), JSON.stringify(index, null, 2))
  console.log('docs/index.json written:', index.length, 'docs')
}

main().catch((e) => { console.error(e); process.exit(1) })
