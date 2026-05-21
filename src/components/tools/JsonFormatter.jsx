import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Braces, Sparkles, Minimize2, CheckCircle2, XCircle,
  Copy, Trash2, Download, Upload, ChevronDown,
  ShieldCheck, Gauge, LayoutGrid, Code2, Check, Zap,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import FAQSchema from '../FAQSchema.jsx'
import SEOManager from '../SEOManager.jsx'
import HowToSchema from '../HowToSchema.jsx'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

function highlightJson(str) {
  const escaped = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'text-emerald-600'
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-indigo-600 font-semibold' : 'text-emerald-600'
      } else if (/true|false/.test(match)) {
        cls = 'text-amber-600'
      } else if (/null/.test(match)) {
        cls = 'text-gray-400'
      } else {
        cls = 'text-blue-600'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

// ─── SEO CONTENT ────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: Upload,
    title: 'Paste or upload your JSON',
    body: 'Drop a .json file onto the editor, or paste raw JSON directly into the text area. Any valid or invalid JSON string is accepted — the tool will tell you which it is.',
  },
  {
    Icon: Sparkles,
    title: 'Click Beautify to format',
    body: 'Hit the Beautify button to instantly reformat your JSON with clean, two-space indentation. The output is human-readable and ready for documentation or debugging.',
  },
  {
    Icon: CheckCircle2,
    title: 'Validate for errors',
    body: 'Press Validate to check your JSON syntax. If there is an error, the tool shows the exact problem with a clear message so you can fix it immediately.',
  },
  {
    Icon: Download,
    title: 'Copy or download the result',
    body: 'Use the Copy button to send the formatted JSON straight to your clipboard, or click Download to save it as a .json file. The output is always clean, standards-compliant JSON.',
  },
]

const FAQS = [
  {
    q: 'Is my JSON data safe when using this formatter?',
    a: 'Yes — Toolyy\'s JSON Formatter processes everything directly in your browser using JavaScript. Your data is never sent to any server, never logged, and never leaves your device. You can safely paste API keys, tokens, or sensitive configuration without any privacy risk.',
  },
  {
    q: 'What is the maximum JSON file size supported?',
    a: 'There is no hard limit because processing happens locally. The practical maximum depends on your device\'s available memory. Most devices handle JSON files up to 10–20 MB without any issues. For very large files (50 MB+), processing may take a moment but will complete successfully on modern hardware.',
  },
  {
    q: 'Can this tool fix broken or invalid JSON?',
    a: 'The Validate button identifies syntax errors and tells you exactly where the problem is (e.g., unexpected token at position 42). However, the tool does not auto-correct invalid JSON — you need to fix the error manually based on the feedback provided. Once valid, Beautify and Minify will work normally.',
  },
  {
    q: 'What is the difference between Beautify and Minify?',
    a: 'Beautify adds consistent indentation (two spaces) and line breaks to make JSON human-readable — ideal for debugging, documentation, or code reviews. Minify removes all unnecessary whitespace and line breaks to produce the smallest possible output — perfect for API payloads, configuration files, or reducing bandwidth.',
  },
]

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">{q}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-300 transition-transform duration-300 ${open ? 'rotate-180 text-brand' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function JsonFormatter() {
  const [input, setInput]           = useState('')
  const [status, setStatus]         = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [copied, setCopied]         = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { recordVisit('json-formatter') }, [])

  function validate(text) {
    if (!text.trim()) { setStatus(null); return null }
    try {
      const parsed = JSON.parse(text)
      setStatus('valid')
      return parsed
    } catch (e) {
      setStatus({ error: e.message })
      return null
    }
  }

  function handleBeautify() {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      const pretty = JSON.stringify(parsed, null, 2)
      setInput(pretty)
      setStatus('valid')
      setShowPreview(true)
    } catch (e) {
      setStatus({ error: e.message })
    }
  }

  function handleMinify() {
    if (!input.trim()) return
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed))
      setStatus('valid')
      setShowPreview(false)
    } catch (e) {
      setStatus({ error: e.message })
    }
  }

  function handleValidate() {
    validate(input)
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  function handleDownload() {
    if (!input.trim()) return
    const blob = new Blob([input], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleClear() {
    setInput('')
    setStatus(null)
    setShowPreview(false)
    setCopied(false)
  }

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      try {
        const parsed = JSON.parse(text)
        const pretty = JSON.stringify(parsed, null, 2)
        setInput(pretty)
        setStatus('valid')
        setShowPreview(true)
      } catch (err) {
        setInput(text)
        setStatus({ error: err.message })
      }
    }
    reader.readAsText(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer?.files?.[0])
  }

  function handleInputChange(e) {
    const val = e.target.value
    setInput(val)
    if (showPreview) setShowPreview(false)
    if (status !== null) validate(val)
  }

  const hasContent  = input.trim().length > 0
  const highlighted = hasContent && status === 'valid' ? highlightJson(input) : ''

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="JSON Formatter &amp; Validator Online | Beautify &amp; Minify"
        description="Paste or type raw JSON and instantly beautify, validate, or minify it with syntax highlighting and line-level error reporting. Runs in your browser — API keys stay safe."
        appName="JSON Formatter and Validator"
        appDescription="Beautify, validate, and minify JSON payloads with syntax highlighting and error reporting. Runs entirely in your browser — no uploads, API tokens stay private."
      />
      <HowToSchema
        name="How to Format and Validate JSON Free Online"
        description="Beautify, validate, and minify JSON payloads instantly in your browser using Toolyy."
        steps={[
          'Go to toolyy.net and select the JSON Formatter tool.',
          'Paste your raw JSON or drag a .json file into the editor.',
          'Click Beautify to format, Validate to check syntax, or Minify to compress — then copy or download.',
        ]}
        totalTime="PT15S"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page title ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Developer Tools</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          JSON Formatter
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Beautify, minify and validate JSON — entirely in your browser. Zero uploads.
        </p>
      </motion.div>

      {/* ── Tool ────────────────────────────────────────────────── */}
      <motion.div {...fadeUp}>
        <div
          className={`
            relative rounded-3xl border-2 overflow-hidden
            bg-surface-card backdrop-blur-xl transition-all duration-300
            ${isDragOver
              ? 'border-brand shadow-glow scale-[1.01]'
              : 'border-white/50 shadow-glass'}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {isDragOver && (
            <div className="absolute inset-0 rounded-3xl bg-brand/[0.04] pointer-events-none z-10" />
          )}

          {/* Toolbar — visible when editor has content */}
          {hasContent && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap items-center gap-2 px-5 pt-5"
            >
              <button onClick={handleBeautify} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand-light transition-colors shadow-sm">
                <Sparkles aria-hidden="true" className="w-3.5 h-3.5" /> Beautify
              </button>
              <button onClick={handleMinify} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-800 text-white text-xs font-bold hover:bg-gray-700 transition-colors shadow-sm">
                <Minimize2 aria-hidden="true" className="w-3.5 h-3.5" /> Minify
              </button>
              <button onClick={handleValidate} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" /> Validate
              </button>

              <div className="flex-1" />

              <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors">
                {copied
                  ? <><Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-emerald-600">Copied</span></>
                  : <><Copy aria-hidden="true" className="w-3.5 h-3.5" /> Copy</>
                }
              </button>
              <button onClick={handleDownload} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors">
                <Download aria-hidden="true" className="w-3.5 h-3.5" /> Save
              </button>
              <button onClick={handleClear} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors" aria-label="Clear editor">
                <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Editor area */}
          <div className="relative p-5">
            {/* Empty-state overlay */}
            {!hasContent && (
              <div className="absolute inset-5 flex flex-col items-center justify-center pointer-events-none z-[5]">
                <motion.div
                  animate={{ scale: isDragOver ? 1.15 : 1, rotate: isDragOver ? -5 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="mb-4"
                >
                  <Braces aria-hidden="true" className={`w-16 h-16 ${isDragOver ? 'text-brand' : 'text-gray-300'} transition-colors`} />
                </motion.div>
                <p className="text-xl font-extrabold text-gray-800 mb-1.5">
                  {isDragOver ? 'Release to load' : 'Drop a JSON file or paste below'}
                </p>
                <p className="text-sm text-gray-400 font-medium mb-4">
                  .json files · processed locally · 100% private
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand text-white text-sm font-bold shadow-md pointer-events-auto"
                >
                  Browse files
                </button>
              </div>
            )}

            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={hasContent ? '' : '  '}
              className={`
                w-full font-mono text-sm leading-relaxed rounded-2xl p-4 resize-y outline-none transition-all
                ${hasContent
                  ? 'min-h-[280px] bg-gray-50/80 border border-gray-100 focus:border-brand/30 focus:ring-2 focus:ring-brand/10'
                  : 'min-h-[320px] bg-transparent border border-transparent cursor-text relative z-10'}
              `}
              spellCheck={false}
              aria-label="JSON input editor"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json,text/plain"
              onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
              className="sr-only"
              aria-label="JSON file upload"
            />
          </div>

          {/* Status bar */}
          <AnimatePresence>
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="px-5 pb-3"
              >
                {status === 'valid' ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50/80 rounded-2xl border border-emerald-100">
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600">Valid JSON</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50/80 rounded-2xl border border-red-100">
                    <XCircle aria-hidden="true" className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-600 truncate">{status.error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Syntax-highlighted preview */}
          <AnimatePresence>
            {showPreview && highlighted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">
                    Syntax Preview
                  </p>
                  <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 overflow-auto max-h-80">
                    <pre
                      className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words"
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── SEO Content Article ──────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20"
        aria-label="Free JSON Formatter Online — complete guide"
      >
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free JSON Formatter &amp; Validator Online
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based JSON formatter instantly beautifies, minifies, and validates
          your JSON data — privately, instantly, and at no cost. No account required, no data
          ever leaves your device, and no file size limits apply.
        </p>

        <div className="space-y-16">

          {/* ── How to Format JSON Online ──────────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Format JSON Online
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_TO_STEPS.map(({ Icon, title, body }, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand/8 flex items-center justify-center">
                      <Icon aria-hidden="true" className="w-5 h-5 text-brand" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand/50">
                      Step {i + 1}
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-0.5 mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Privacy First ──────────────────────────────────── */}
          <section aria-labelledby="privacy-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-red-500" />
              </div>
              <h2 id="privacy-heading" className="text-xl font-black text-gray-900">
                Privacy First: No Server Processing
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Many online JSON tools send your data to remote servers for processing.
                  That means your API responses, configuration files, database exports, and
                  other potentially sensitive developer data travels across the internet —
                  creating real security and compliance concerns.
                  Toolyy's <strong className="text-gray-800">Free JSON Formatter</strong> works
                  completely differently.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Every operation — beautifying, minifying, and validating — happens
                  <strong className="text-gray-800"> directly in your browser</strong> using
                  native JavaScript JSON parsing. Your data never leaves your device. There is
                  nothing to intercept, nothing logged, and nothing stored. The moment you close
                  the tab, the data is gone.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Because there is no network round-trip, formatting is effectively instant.
                  A 5 MB JSON file formats in under a second on any modern device. There is no
                  upload queue, no bandwidth throttle, and no rate limit — format as many files
                  as you need, as often as you need.
                </p>
              </div>

              <aside
                aria-label="Privacy and performance highlights"
                className="mt-8 lg:mt-0 lg:w-56 flex-shrink-0 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3 bg-red-50/70 rounded-2xl p-4">
                  <ShieldCheck aria-hidden="true" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-600 mb-1">100% Private</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Zero uploads, zero data retention. Your JSON never leaves your device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-blue-50/70 rounded-2xl p-4">
                  <Gauge aria-hidden="true" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">Instant Results</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      No upload wait. Formatting happens in milliseconds, right in your browser.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50/70 rounded-2xl p-4">
                  <Code2 aria-hidden="true" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">Developer Friendly</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Syntax highlighting, validation errors, and one-click copy for fast workflows.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* ── Answer-First Snippet Blocks ─────────────────────────── */}
          <section aria-labelledby="snippets-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Zap aria-hidden="true" className="w-4 h-4 text-amber-500" />
              </div>
              <h2 id="snippets-heading" className="text-xl font-black text-gray-900">
                Quick Answers
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                  How can I format JSON online without exposing my API keys?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use Toolyy's JSON Formatter — it processes everything directly in your browser
                  using native JavaScript. Your data never leaves your device, so API keys, tokens,
                  and sensitive configuration values stay completely private. Paste your JSON, click
                  Beautify, and copy the formatted output.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                  What is the fastest way to validate JSON syntax?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Paste your JSON into Toolyy's formatter and click the Validate button. The tool
                  instantly checks your syntax and shows the exact error message with position
                  information if something is wrong. Validation runs locally in milliseconds —
                  no server round-trip, no rate limits.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                  How do I minify JSON for production API payloads?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Paste your JSON into Toolyy's formatter and click the Minify button. The tool
                  strips all whitespace and line breaks to produce the smallest possible output —
                  perfect for reducing bandwidth in API responses, configuration files, and
                  localStorage entries. One click, then copy or download.
                </p>
              </div>
            </div>
          </section>

          {/* ── Comparison Table ──────────────────────────────────────── */}
          <section aria-labelledby="compare-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-blue-500" />
              </div>
              <h2 id="compare-heading" className="text-xl font-black text-gray-900">
                Toolyy vs Other JSON Formatters
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-glass overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-extrabold text-gray-900 px-6 py-4">Feature</th>
                    <th className="text-left font-extrabold text-brand px-6 py-4">Toolyy</th>
                    <th className="text-left font-extrabold text-gray-400 px-6 py-4">Typical Online Formatters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Data sent to server</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">No — 100% local</td>
                    <td className="px-6 py-3 text-gray-400">Usually</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Syntax highlighting</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">Yes — colour-coded preview</td>
                    <td className="px-6 py-3 text-gray-400">Sometimes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Validation</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">Built-in with error location</td>
                    <td className="px-6 py-3 text-gray-400">Separate tool</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Minify support</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">One-click minify</td>
                    <td className="px-6 py-3 text-gray-400">Sometimes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">File size limit</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">None (device RAM only)</td>
                    <td className="px-6 py-3 text-gray-400">Varies</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Cost</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">Free — no ads</td>
                    <td className="px-6 py-3 text-gray-400">Free with ads</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Braces aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 id="faq-heading" className="text-xl font-black text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl px-8 shadow-glass divide-y divide-gray-100">
              {FAQS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>

        </div>
      </motion.article>
    </div>
  )
}
