// Generates public/sitemap.xml at build time. Run after `vite build`.
// Static routes only — dynamic pool pages are added by the crawler index.
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BASE = 'https://kindlepool.app'

const staticRoutes = [
  '/home',
  '/explore',
  '/pricing',
  '/about',
  '/faq',
  '/how-it-works',
  '/security',
  '/developers',
  '/docs',
  '/docs/overview',
  '/docs/getting-started',
  '/docs/how-funding-works',
  '/docs/refunds',
  '/docs/security',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
  '/legal/bounty',
  '/legal/dmca',
]

const today = new Date().toISOString().split('T')[0]

const urls = staticRoutes
  .map((route) => `  <url><loc>${BASE}${route}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const outDir = join(__dirname, '..', 'public')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'sitemap.xml'), xml)
console.log('sitemap.xml written:', staticRoutes.length, 'urls')
