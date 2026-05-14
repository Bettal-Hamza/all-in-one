import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME    = 'SwiftTool'
const DEFAULT_TITLE = 'SwiftTool — Edit Files. No Stress.'
const DEFAULT_DESC  = 'SwiftTool — free browser-based utilities. PDF splitter, image converter and more. Your files never leave your device.'

/**
 * Drop this at the top of any tool page's JSX return.
 *
 * Props:
 *   title             – page-specific title, e.g. "Split PDF Online — 100% Private & Free"
 *   description       – meta description (≤155 chars recommended)
 *   appName           – SoftwareApplication.name  (falls back to title)
 *   appDescription    – SoftwareApplication.description (falls back to description)
 *   applicationCategory – schema.org category   (default: 'UtilityApplication')
 *   operatingSystem   – schema.org OS list       (default: 'Windows, macOS, Android, iOS')
 *   canonicalPath     – override the canonical URL path (default: current pathname)
 */
export default function SEOManager({
  title,
  description,
  appName,
  appDescription,
  applicationCategory = 'UtilityApplication',
  operatingSystem = 'Windows, macOS, Android, iOS',
  canonicalPath,
}) {
  const { pathname } = useLocation()
  const resolvedPath = canonicalPath ?? pathname
  const origin       = typeof window !== 'undefined' ? window.location.origin : ''
  const canonicalUrl = `${origin}${resolvedPath}`
  const fullTitle    = `${title} | ${SITE_NAME}`

  useEffect(() => {
    // ── Helper: get existing element or create & append it ──
    function upsert(selector, tag, attrs = {}) {
      let el = document.querySelector(selector)
      let created = false
      if (!el) {
        el = document.createElement(tag)
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
        document.head.appendChild(el)
        created = true
      }
      return { el, created }
    }

    // ── 1. Title ────────────────────────────────────────────
    const prevTitle = document.title
    document.title = fullTitle

    // ── 2. Meta description ─────────────────────────────────
    const { el: descEl, created: descCreated } = upsert(
      'meta[name="description"]',
      'meta',
      { name: 'description' },
    )
    const prevDesc = descCreated ? null : descEl.getAttribute('content')
    descEl.setAttribute('content', description)

    // ── 3. Canonical link ───────────────────────────────────
    const { el: canonEl, created: canonCreated } = upsert(
      'link[rel="canonical"]',
      'link',
      { rel: 'canonical' },
    )
    const prevCanon = canonCreated ? null : canonEl.getAttribute('href')
    canonEl.setAttribute('href', canonicalUrl)

    // ── 4. Open Graph tags ──────────────────────────────────
    function upsertOg(property, content) {
      const { el } = upsert(
        `meta[property="${property}"]`,
        'meta',
        { property },
      )
      el.setAttribute('content', content)
      return el
    }
    const ogTitle       = upsertOg('og:title',       fullTitle)
    const ogDesc        = upsertOg('og:description',  description)
    const ogUrl         = upsertOg('og:url',          canonicalUrl)
    const ogType        = upsertOg('og:type',         'website')
    const ogSiteName    = upsertOg('og:site_name',    SITE_NAME)
    const twitterCard   = upsertOg('twitter:card',    'summary')
    const twitterTitle  = upsertOg('twitter:title',   fullTitle)
    const twitterDesc   = upsertOg('twitter:description', description)

    // ── 5. JSON-LD — SoftwareApplication schema ─────────────
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appName ?? title,
      description: appDescription ?? description,
      applicationCategory,
      operatingSystem,
      url: canonicalUrl,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      browserRequirements: 'Requires JavaScript. Compatible with all modern browsers.',
      inLanguage: 'en',
    }
    const ldScript = document.createElement('script')
    ldScript.type = 'application/ld+json'
    ldScript.setAttribute('data-seo-manager', 'true')
    ldScript.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(ldScript)

    // ── Cleanup: restore site-level defaults on unmount ─────
    return () => {
      document.title = prevTitle

      if (descCreated) descEl.remove()
      else descEl.setAttribute('content', prevDesc ?? DEFAULT_DESC)

      if (canonCreated) canonEl.remove()
      else canonEl.setAttribute('href', prevCanon ?? '')

      for (const el of [ogTitle, ogDesc, ogUrl, ogType, ogSiteName, twitterCard, twitterTitle, twitterDesc]) {
        el.remove()
      }

      ldScript.remove()
    }
  }, [fullTitle, description, canonicalUrl, appName, appDescription, applicationCategory, operatingSystem])

  return null
}
