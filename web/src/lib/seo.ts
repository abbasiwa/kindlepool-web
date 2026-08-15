import { useEffect } from 'react'

const SITE = 'https://kindlepool.vercel.app'
const SITE_NAME = 'KindlePool'
const DEFAULT_DESC = 'Fund the work, not the creator. Trustless micro-sponsor pools on Stellar Soroban.'

interface MetaOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: object[]
}

function setMeta(attr: string, selector: string, attrValue: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, attrValue)
    document.head.appendChild(el)
  } else {
    el.setAttribute(attr, attrValue)
  }
  el.setAttribute('content', content)
}
/**
 * Sets per-page title, meta description, canonical, OpenGraph, Twitter card,
 * and injects JSON-LD structured data. Cleanup removes injected JSON-LD.
 */
export function useMeta({ title, description, path, image, type = 'website', jsonLd = [] }: MetaOptions): void {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    const fullUrl = `${SITE}${path ?? ''}`
    const desc = description ?? DEFAULT_DESC
    const ogImage = image ?? `${SITE}/favicon.svg`

    document.title = fullTitle
    setMeta('name', 'meta[name="description"]', 'description', desc)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = fullUrl

    setMeta('property', 'meta[property="og:title"]', 'og:title', fullTitle)
    setMeta('property', 'meta[property="og:description"]', 'og:description', desc)
    setMeta('property', 'meta[property="og:url"]', 'og:url', fullUrl)
    setMeta('property', 'meta[property="og:type"]', 'og:type', type)
    setMeta('property', 'meta[property="og:image"]', 'og:image', ogImage)
    setMeta('property', 'meta[property="og:site_name"]', 'og:site_name', SITE_NAME)
    setMeta('name', 'meta[name="twitter:card"]', 'twitter:card', 'summary_large_image')
    setMeta('name', 'meta[name="twitter:title"]', 'twitter:title', fullTitle)
    setMeta('name', 'meta[name="twitter:description"]', 'twitter:description', desc)

    const scripts: HTMLScriptElement[] = []
    for (const data of jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(data)
      document.head.appendChild(script)
      scripts.push(script)
    }

    return () => { scripts.forEach((s) => s.remove()) }
  }, [title, description, path, image, type, jsonLd])
}
