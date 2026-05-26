import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ALIAS_MAP } from '../constants/seo-aliases.js'

const SITE_NAME    = 'Toolyy'
const SITE_ORIGIN  = 'https://toolyy.net'
const DEFAULT_DESC = 'Access clean, fast, privacy-first web utilities. Convert formats, compress assets, and format data instantly in your browser with zero server uploads.'

export default function SEOManager({
  title: propTitle,
  description: propDescription,
  appName,
  appDescription,
  applicationCategory = 'UtilityApplication',
  operatingSystem = 'Windows, macOS, Android, iOS',
  canonicalPath,
}) {
  const { pathname } = useLocation()
  const alias       = ALIAS_MAP[pathname]
  const title       = alias?.title ?? propTitle
  const description = alias?.description ?? propDescription

  const rawPath      = canonicalPath ?? pathname
  const cleanPath    = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath
  const canonicalUrl = `${SITE_ORIGIN}${cleanPath}`
  const fullTitle    = alias ? title : `${title} | ${SITE_NAME}`

  useEffect(() => {
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

    const prevTitle = document.title
    document.title = fullTitle

    const { el: descEl, created: descCreated } = upsert(
      'meta[name="description"]',
      'meta',
      { name: 'description' },
    )
    const prevDesc = descCreated ? null : descEl.getAttribute('content')
    descEl.setAttribute('content', description)

    const { el: canonEl, created: canonCreated } = upsert(
      'link[rel="canonical"]',
      'link',
      { rel: 'canonical' },
    )
    const prevCanon = canonCreated ? null : canonEl.getAttribute('href')
    canonEl.setAttribute('href', canonicalUrl)

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
