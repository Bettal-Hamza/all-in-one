import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, User, Mail, Tag, MessageSquare } from 'lucide-react'

const CATEGORIES = [
  'PDF Tools',
  'Image Tools',
  'Background Remover',
  'QR Code Generator',
  'New Tool Idea',
  'General Feedback',
  'Bug Report',
]

const EMPTY = {
  user_name:    '',
  user_email:   '',
  tool_category: '',
  message:      '',
  website_url:  '',  // honeypot — must stay empty
}

const inputBase = [
  'w-full bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3',
  'text-sm text-gray-800 placeholder-gray-300 font-medium',
  'outline-none focus:border-brand focus:ring-2 focus:ring-brand/20',
  'transition-all duration-200',
].join(' ')

export default function SuggestionForm() {
  const [form,  setForm]  = useState(EMPTY)
  const [phase, setPhase] = useState('idle')   // idle | loading | success | error
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (phase === 'error') setPhase('idle')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (phase === 'loading') return

    setPhase('loading')
    setError('')

    try {
      const res  = await fetch('/api/suggestions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        setPhase('success')
        setForm(EMPTY)
      } else {
        setPhase('error')
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setPhase('error')
      setError('Network error — please check your connection and try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8"
    >
      <AnimatePresence mode="wait">

        {/* ── Success state ──────────────────────────────────── */}
        {phase === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-5 py-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center"
            >
              <CheckCircle aria-hidden="true" className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <div>
              <p className="text-lg font-black text-gray-900 mb-1.5">Thank you!</p>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
                Your suggestion has been saved. We read every submission and use them to
                prioritise new tools and improvements on Toolyy.
              </p>
            </div>
            <button
              onClick={() => setPhase('idle')}
              className="text-sm font-bold text-brand hover:underline underline-offset-2 transition-all"
            >
              Submit another suggestion →
            </button>
          </motion.div>
        )}

        {/* ── Form ───────────────────────────────────────────── */}
        {phase !== 'success' && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >

            {/* Error banner */}
            <AnimatePresence>
              {phase === 'error' && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3"
                >
                  <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sf-name" className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                  Your Name <span className="text-brand" aria-label="required">*</span>
                </label>
                <div className="relative">
                  <User aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  <input
                    id="sf-name"
                    type="text"
                    name="user_name"
                    value={form.user_name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                    maxLength={100}
                    autoComplete="name"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sf-email" className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                  Email{' '}
                  <span className="text-gray-300 font-medium normal-case tracking-normal text-xs">optional</span>
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                  <input
                    id="sf-email"
                    type="email"
                    name="user_email"
                    value={form.user_email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    maxLength={254}
                    autoComplete="email"
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sf-category" className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                Category <span className="text-brand" aria-label="required">*</span>
              </label>
              <div className="relative">
                <Tag aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                <select
                  id="sf-category"
                  name="tool_category"
                  value={form.tool_category}
                  onChange={handleChange}
                  required
                  className={`${inputBase} pl-10 appearance-none bg-gray-50/80 cursor-pointer`}
                >
                  <option value="" disabled>Select a category…</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {/* Chevron */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 text-xs">▾</span>
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="sf-message" className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                  Your Suggestion <span className="text-brand" aria-label="required">*</span>
                </label>
                <span
                  className={`text-[11px] font-medium tabular-nums transition-colors ${
                    form.message.length > 1800 ? 'text-amber-500' : 'text-gray-300'
                  }`}
                >
                  {form.message.length}/2000
                </span>
              </div>
              <div className="relative">
                <MessageSquare aria-hidden="true" className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                <textarea
                  id="sf-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="I'd love to see a tool that converts HEIC photos to JPG…"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  className={`${inputBase} pl-10 resize-none`}
                />
              </div>
            </div>

            {/* ── Honeypot — visually hidden, not keyboard-reachable ── */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', top: '-9999px', height: 0, overflow: 'hidden' }}
            >
              <label htmlFor="sf-website">Website URL</label>
              <input
                id="sf-website"
                type="text"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={phase === 'loading'}
              whileHover={{ scale: phase === 'loading' ? 1 : 1.02 }}
              whileTap={{ scale: phase === 'loading' ? 1 : 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="flex items-center justify-center gap-2.5 py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-sm rounded-2xl shadow-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {phase === 'loading' ? (
                <>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
                    className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="w-4 h-4" />
                  Send Suggestion
                </>
              )}
            </motion.button>

            <p className="text-[11px] text-gray-300 font-medium text-center leading-relaxed">
              We read every submission. Your email (if provided) is only used to follow up on your
              suggestion — never shared or marketed to.
            </p>

          </motion.form>
        )}

      </AnimatePresence>
    </motion.div>
  )
}
