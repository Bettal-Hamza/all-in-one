import express from 'express'
import cors    from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath }  from 'url'
import suggestionsRouter  from './routes/suggestions.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT      = Number(process.env.PORT ?? 3001)
const IS_PROD   = process.env.NODE_ENV === 'production'

const app = express()

app.set('trust proxy', 1)

if (!IS_PROD) {
  app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }))
}

app.use(express.json({ limit: '32kb' }))

app.use('/api/suggestions', suggestionsRouter)

if (IS_PROD) {
  const dist = join(__dirname, '..', 'dist')

  // ── 1. Enforce no-trailing-slash (301) ────────────────────
  // Google sees /tools/pdf-splitter/ and /tools/pdf-splitter as two
  // different URLs. Pick ONE form and 301-redirect the other.
  // We choose no-trailing-slash (matches sitemap + canonical tags).
  app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const clean = req.path.slice(0, -1)
      const qs = req.originalUrl.slice(req.path.length)
      return res.redirect(301, clean + qs)
    }
    next()
  })

  // ── 2. Static files — disable express.static's auto-redirect ──
  // By default express.static 301-redirects /dir → /dir/ when it
  // finds a directory. This caused the "Page with redirect" error.
  app.use(express.static(dist, { redirect: false }))

  // ── 3. Serve prerendered index.html for clean URLs ────────
  // e.g. /tools/pdf-splitter → dist/tools/pdf-splitter/index.html
  // No redirect, no trailing slash — served directly at the
  // canonical URL that matches the sitemap.
  app.use((req, res, next) => {
    if (req.path.includes('.')) return next()
    const indexPath = join(dist, req.path, 'index.html')
    res.sendFile(indexPath, err => { if (err) next() })
  })

  // ── 4. SPA fallback — React Router handles remaining routes ──
  app.get('{*splat}', (_req, res) => res.sendFile(join(dist, 'index.html')))
}

app.use((err, _req, res, _next) => {
  console.error('[Toolyy API] Unhandled error:', err)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

app.listen(PORT, () => {
  const env = IS_PROD ? 'production' : 'development'
  console.log(`[Toolyy API] ${env} server on http://localhost:${PORT}`)
})
