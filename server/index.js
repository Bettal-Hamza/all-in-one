import express from 'express'
import cors    from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath }  from 'url'
import suggestionsRouter  from './routes/suggestions.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT      = Number(process.env.PORT ?? 3001)
const IS_PROD   = process.env.NODE_ENV === 'production'

const app = express()

// ── Trust the first proxy hop (Nginx, Cloudflare, Vercel edge, etc.)
// Required so req.ip / X-Forwarded-For reflects the real client IP.
app.set('trust proxy', 1)

// ── CORS: allow the Vite dev server in development only
if (!IS_PROD) {
  app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }))
}

// ── Body parsing — hard cap at 32 KB to blunt oversized-body attacks
app.use(express.json({ limit: '32kb' }))

// ── API routes
app.use('/api/suggestions', suggestionsRouter)

// ── Serve the Vite production build from the same process
if (IS_PROD) {
  const dist = join(__dirname, '..', 'dist')
  app.use(express.static(dist))
  // SPA fallback — any unmatched path returns index.html so React Router works
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')))
}

app.listen(PORT, () => {
  const env = IS_PROD ? 'production' : 'development'
  console.log(`[Toolyy API] ${env} server on http://localhost:${PORT}`)
})
