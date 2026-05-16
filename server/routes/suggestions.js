import { Router } from 'express'
import db from '../db.js'

const router = Router()

// ── Constants ─────────────────────────────────────────────────────────────────

const RATE_LIMIT      = 3      // max submissions per window
const RATE_WINDOW_H   = 1      // window size in hours
const MAX_NAME        = 100
const MAX_EMAIL       = 254
const MAX_CATEGORY    = 60
const MAX_MESSAGE     = 2000
const MIN_MESSAGE     = 10

const VALID_CATEGORIES = new Set([
  'PDF Tools',
  'Image Tools',
  'Background Remover',
  'QR Code Generator',
  'New Tool Idea',
  'General Feedback',
  'Bug Report',
])

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitize(raw, maxLen) {
  if (typeof raw !== 'string') return ''
  return raw
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/&[a-z#0-9]+;/gi, ' ')  // collapse HTML entities
    .trim()
    .slice(0, maxLen)
}

function getClientIp(req) {
  // Works behind Nginx, Cloudflare, etc. when trust proxy is set
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress ?? 'unknown'
}

const checkRateLimit = db.prepare(`
  SELECT COUNT(*) AS count
  FROM   suggestions
  WHERE  ip_address = ?
    AND  created_at > datetime('now', '-${RATE_WINDOW_H} hour')
`)

const insertSuggestion = db.prepare(`
  INSERT INTO suggestions (user_name, user_email, tool_category, message, ip_address)
  VALUES (?, ?, ?, ?, ?)
`)

// ── Route: POST /api/suggestions ──────────────────────────────────────────────

router.post('/', (req, res) => {
  const {
    user_name,
    user_email    = '',
    tool_category,
    message,
    website_url,  // honeypot field
  } = req.body ?? {}

  // ── 1. Honeypot — silent pass-through so bots don't know they failed
  if (website_url) {
    return res.json({ success: true, message: 'Thank you! Your suggestion has been saved.' })
  }

  // ── 2. Rate limiting
  const ip = getClientIp(req)
  const { count } = checkRateLimit.get(ip)
  if (count >= RATE_LIMIT) {
    return res.status(429).json({
      success: false,
      error:   `You can submit at most ${RATE_LIMIT} suggestions per hour. Please try again later.`,
    })
  }

  // ── 3. Sanitize all inputs
  const name     = sanitize(user_name,    MAX_NAME)
  const email    = sanitize(user_email,   MAX_EMAIL)
  const category = sanitize(tool_category, MAX_CATEGORY)
  const msg      = sanitize(message,       MAX_MESSAGE)

  // ── 4. Validate
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required.' })
  }
  if (!VALID_CATEGORIES.has(category)) {
    return res.status(400).json({ success: false, error: 'Please select a valid category.' })
  }
  if (!msg || msg.length < MIN_MESSAGE) {
    return res.status(400).json({
      success: false,
      error:   `Message must be at least ${MIN_MESSAGE} characters.`,
    })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' })
  }

  // ── 5. Persist
  insertSuggestion.run(name, email || null, category, msg, ip)

  res.json({ success: true, message: 'Thank you! Your suggestion has been saved.' })
})

export default router
