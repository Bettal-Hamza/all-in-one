/**
 * generate-sitemap.js
 *
 * Writes public/sitemap.xml from the live TOOLS registry plus static pages.
 * Run manually:  node scripts/generate-sitemap.js
 * Run via npm:   npm run sitemap
 * Auto-runs:     npm run build  (hooked via "prebuild" in package.json)
 *
 * SITE_URL env var overrides the base URL:
 *   SITE_URL=https://mysite.com node scripts/generate-sitemap.js
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname }         from 'path'
import { fileURLToPath }            from 'url'
import { TOOLS }                    from '../src/constants/tools.js'
import { SEO_ALIASES }              from '../src/constants/seo-aliases.js'

// ── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = (process.env.SITE_URL || 'https://toolyy.net').replace(/\/$/, '')
const TODAY    = new Date().toISOString().split('T')[0]  // YYYY-MM-DD

// ── URL definitions ──────────────────────────────────────────────────────────
//
// changefreq values: always | hourly | daily | weekly | monthly | yearly | never
// priority range:    0.0 – 1.0  (default 0.5 per the spec)

const STATIC_PAGES = [
  { path: '/',        changefreq: 'daily',   priority: '1.0' },
  { path: '/about',   changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly',  priority: '0.4' },
  { path: '/terms',   changefreq: 'yearly',  priority: '0.4' },
]

// Only include tools that are live — unlaunched tools have no routable URL
const toolPages = TOOLS
  .filter(t => t.live && t.path)
  .map(t => ({
    path:       t.path,
    changefreq: 'weekly',
    priority:   '0.9',
  }))

const aliasPages = SEO_ALIASES.map(a => ({
  path:       a.path,
  changefreq: 'weekly',
  priority:   '0.8',
}))

const ALL_URLS = [...STATIC_PAGES, ...toolPages, ...aliasPages]

// ── XML builder ──────────────────────────────────────────────────────────────

function buildUrlEntry({ path, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${BASE_URL}${path}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

function buildSitemap(urls) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    '',
    urls.map(buildUrlEntry).join('\n\n'),
    '',
    '</urlset>',
  ].join('\n')
}

// ── Write output ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')
const OUT_DIR   = resolve(ROOT, 'public')
const OUT_FILE  = resolve(OUT_DIR, 'sitemap.xml')

mkdirSync(OUT_DIR, { recursive: true })   // no-op if public/ already exists
writeFileSync(OUT_FILE, buildSitemap(ALL_URLS), 'utf8')

// ── Summary ──────────────────────────────────────────────────────────────────

const pad = (s, n) => String(s).padEnd(n)

console.log(`\nsitemap.xml  ->  ${OUT_FILE}`)
console.log(`Base URL     :   ${BASE_URL}`)
console.log(`Generated    :   ${TODAY}`)
console.log(`URLs         :   ${ALL_URLS.length} total\n`)
console.log(`  ${'Priority'.padEnd(10)} ${'Change'.padEnd(10)} Path`)
console.log(`  ${'-'.repeat(40)}`)
for (const { path, changefreq, priority } of ALL_URLS) {
  console.log(`  ${pad(priority, 10)} ${pad(changefreq, 10)} ${BASE_URL}${path}`)
}
console.log()
