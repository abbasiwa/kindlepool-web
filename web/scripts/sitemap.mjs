// Generates public/sitemap.xml at build time. Run after `vite build`.
// Static routes only — dynamic pool pages are added by the crawler index.
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BASE = 'https://kindlepool.vercel.app'

const staticRoutes = [
  '/',
  '/explore',
  '/pricing',
  '/about',
  '/faq',
  '/how-it-works',
  '/changelog',
  '/security',
  '/status',
  '/leaderboard',
  '/analytics',
  '/developers',
  '/docs',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
  '/legal/bounty',
  '/legal/security',
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
