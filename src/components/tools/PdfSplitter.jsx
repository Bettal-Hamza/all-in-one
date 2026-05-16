import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Zap, LayoutGrid, Download,
  ChevronDown, ShieldCheck, Gauge, FileType, FileText,
} from 'lucide-react'
import { splitPdf } from '../../lib/pdfSplitter.js'
import { recordVisit } from '../../lib/recentTools.js'
import ProgressBar from '../ui/ProgressBar.jsx'
import GlobalAdContainer from '../ads/GlobalAdContainer.jsx'
import SEOManager from '../SEOManager.jsx'

const ACCEPT = 'application/pdf'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// ─── SEO CONTENT ────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: Upload,
    title: 'Upload your PDF',
    body: 'Drag and drop your file onto the upload area, or click to open the file picker. Any PDF — single page or hundreds of pages — is accepted.',
  },
  {
    Icon: Zap,
    title: 'Processing happens instantly',
    body: 'Toolyy reads and splits your PDF directly inside your browser using the pdf-lib engine. There is no upload step, so processing starts immediately.',
  },
  {
    Icon: LayoutGrid,
    title: 'Review your pages',
    body: 'Every page appears as a labelled entry in the results list. You can see exactly how many pages were extracted before downloading anything.',
  },
  {
    Icon: Download,
    title: 'Download what you need',
    body: 'Click any page entry to save that single page, or hit "Download All" to grab every page at once. Each page is saved as its own clean PDF file.',
  },
]

const FAQS = [
  {
    q: 'Is it safe to use this Free PDF Splitter?',
    a: 'Absolutely. Unlike most online PDF tools, Toolyy never sends your file to a server. All processing happens locally in your browser using JavaScript. Your document never leaves your device, so there is nothing to intercept, log, or accidentally leak — even if the file contains sensitive personal or business information.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'There is no hard server-side limit because your file never gets uploaded. The practical limit is your device\'s available RAM. Most modern computers and phones can comfortably handle PDFs up to several hundred megabytes. Very large files (500 MB+) may take a little longer, but they will process successfully.',
  },
  {
    q: 'Does this online PDF tool work on mobile?',
    a: 'Yes — this Free PDF Splitter works on any modern browser, including Safari on iPhone and Chrome on Android. Simply open the page, tap the upload area to choose your PDF from your device or cloud storage, and download your pages when ready.',
  },
  {
    q: 'Can I split a password-protected PDF?',
    a: 'Currently, encrypted or password-protected PDFs are not supported. You will need to remove the password protection first using your PDF viewer (e.g., Adobe Acrobat or Preview on Mac), then use Toolyy to split the unlocked file.',
  },
  {
    q: 'What output format will I get?',
    a: 'Each extracted page is saved as a standard, fully compatible PDF file. The output files are named sequentially (e.g., page-1.pdf, page-2.pdf) and can be opened in any PDF viewer, printed, emailed, or uploaded anywhere PDFs are accepted.',
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
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">
          {q}
        </span>
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

export default function PdfSplitter() {
  const [phase, setPhase]               = useState('idle')
  const [progress, setProgress]         = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [pages, setPages]               = useState([])
  const [error, setError]               = useState(null)
  const [fileName, setFileName]         = useState('')
  const [fileSize, setFileSize]         = useState(0)
  const [isDragOver, setIsDragOver]     = useState(false)
  const inputRef = useRef(null)
  const urlsRef  = useRef([])

  useEffect(() => {
    recordVisit('pdf-splitter')
    return () => urlsRef.current.forEach(url => URL.revokeObjectURL(url))
  }, [])

  async function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Please drop a valid PDF file.')
      return
    }
    urlsRef.current.forEach(url => URL.revokeObjectURL(url))
    urlsRef.current = []
    setError(null)
    setFileName(file.name)
    setFileSize(file.size)
    setProgress(0)
    setProgressLabel('')
    setPhase('processing')

    try {
      const results = await splitPdf(file, (current, total) => {
        setProgress(Math.round((current / total) * 100))
        setProgressLabel(`Splitting page ${current} of ${total}…`)
      })
      urlsRef.current = results.map(r => r.url)
      setPages(results)
      setPhase('done')
    } catch (err) {
      setPhase('idle')
      setError(err.message || 'Failed to split the PDF. Please try another file.')
    }
  }

  function handleReset() {
    urlsRef.current.forEach(url => URL.revokeObjectURL(url))
    urlsRef.current = []
    setPages([])
    setProgress(0)
    setProgressLabel('')
    setError(null)
    setFileName('')
    setFileSize(0)
    setPhase('idle')
  }

  function handleDownloadAll() {
    pages.forEach(({ url, filename }, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
      }, i * 150)
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Split PDF Online — 100% Private &amp; Free"
        description="Free PDF splitter that runs entirely in your browser. No uploads, no server, instant results. Split any multi-page PDF into individual pages — 100% private."
        appName="Free PDF Splitter"
        appDescription="A free online PDF tool that splits multi-page PDFs into individual pages entirely in your browser. No uploads, no servers — 100% private and instant."
      />

      {/* ── Page title ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">PDF Tools</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          PDF Splitter
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Split any PDF into individual pages — entirely in your browser. Zero uploads.
        </p>
      </motion.div>

      {/* ── Tool ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {phase === 'idle' && (
          <motion.div key="idle" {...fadeUp}>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer?.files?.[0]) }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              className={`
                relative cursor-pointer rounded-3xl border-2 p-16 text-center
                bg-surface-card backdrop-blur-xl transition-all duration-300
                ${isDragOver
                  ? 'border-brand shadow-glow scale-[1.01]'
                  : 'border-white/50 shadow-glass hover:border-brand/25 hover:shadow-glass-lg'
                }
              `}
            >
              {isDragOver && (
                <div className="absolute inset-0 rounded-3xl bg-brand/[0.04] pointer-events-none" />
              )}
              <motion.div
                animate={{ scale: isDragOver ? 1.15 : 1, rotate: isDragOver ? -5 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="mb-6"
              >
                <FileText aria-hidden="true" className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to split' : 'Drop your PDF here'}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                or click to browse · PDF files only · processed locally
              </p>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 text-sm text-red-500 font-semibold"
                >
                  {error}
                </motion.p>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
                className="sr-only"
                aria-label="PDF file upload"
              />
            </div>
          </motion.div>
        )}

        {(phase === 'processing' || phase === 'done') && (
          <motion.div key="split" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="min-w-0 pr-4">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">
                      {phase === 'processing' ? 'Splitting PDF…' : `${pages.length} pages ready`}
                    </p>
                    <h2 className="text-xl font-black text-gray-900 truncate">{fileName}</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">{formatBytes(fileSize)}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 text-xs text-gray-300 hover:text-gray-600 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Start over
                  </button>
                </div>

                {phase === 'processing' && (
                  <div className="flex-1">
                    <ProgressBar pct={progress} />
                    <p className="mt-3 text-sm text-gray-400 font-medium">{progressLabel || 'Starting…'}</p>
                  </div>
                )}

                {phase === 'done' && (
                  <ul className="flex-1 space-y-1.5 overflow-y-auto max-h-80 pr-1 -mr-1">
                    {pages.map(({ url, filename }, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.035, duration: 0.3 }}
                      >
                        <a
                          href={url}
                          download={filename}
                          className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 rounded-2xl hover:bg-brand/5 hover:text-brand transition-all group"
                        >
                          <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 group-hover:text-brand">
                            <FileText aria-hidden="true" className="w-4 h-4 text-gray-300 group-hover:text-brand transition-colors" />
                            Page {i + 1}
                          </span>
                          <span className="text-xs font-semibold text-gray-300 group-hover:text-brand transition-colors">
                            Download ↓
                          </span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {phase === 'done' && (
                  <div className="mt-6">
                    <GlobalAdContainer slot="postAction" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <GlobalAdContainer slot="sidebar" className="rounded-3xl" />
                <AnimatePresence mode="wait">
                  {phase === 'done' ? (
                    <motion.button
                      key="download"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                      onClick={handleDownloadAll}
                      className="w-full py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-3xl shadow-lg transition-colors"
                    >
                      Download All
                    </motion.button>
                  ) : (
                    <motion.div
                      key="waiting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full py-4 bg-gray-100 text-gray-300 font-extrabold text-lg rounded-3xl text-center select-none cursor-not-allowed"
                    >
                      Processing…
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── SEO Content Article ──────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20"
        aria-label="Free PDF Splitter Online — complete guide"
      >

        {/* Article H1 — the page's primary semantic heading */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free PDF Splitter Online
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based PDF splitter extracts every page of your document into a
          separate, download-ready PDF file — instantly, privately, and at no cost. No account
          required, no file size cap, no watermarks.
        </p>

        <div className="space-y-16">

          {/* ── How to Split PDF Pages Fast ─────────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Split PDF Pages Fast
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

          {/* ── Ad slot between sections ──────────────────────────── */}
          <GlobalAdContainer slot="midContent" />

          {/* ── Privacy First: No Server Uploads ─────────────────── */}
          <section aria-labelledby="privacy-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-red-500" />
              </div>
              <h2 id="privacy-heading" className="text-xl font-black text-gray-900">
                Privacy First: No Server Uploads
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">

              {/* Main privacy copy */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Most online PDF tools quietly upload your file to a remote server the moment you drop
                  it in. That means your contracts, invoices, medical records, or personal documents
                  travel across the internet — raising real privacy concerns.
                  Toolyy's <strong className="text-gray-800">Free PDF Splitter Online</strong> works
                  completely differently.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Every byte of processing happens <strong className="text-gray-800">directly in your
                  browser</strong> using the pdf-lib engine — a battle-tested JavaScript library that
                  reads and rewrites PDF files without any server contact. Your file never leaves your
                  device. There is nothing to intercept, nothing logged, and nothing retained. The
                  moment you close the tab the data is gone.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Speed is the other major advantage. Because there is no upload step, this
                  online PDF splitter starts working the instant you choose a file. A 50-page PDF
                  typically splits in under two seconds on any modern device — laptop, tablet, or
                  phone — with no queue and no bandwidth cap.
                </p>
              </div>

              {/* Aside — supplementary privacy highlights */}
              <aside
                aria-label="Privacy and performance highlights"
                className="mt-8 lg:mt-0 lg:w-56 flex-shrink-0 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3 bg-red-50/70 rounded-2xl p-4">
                  <ShieldCheck aria-hidden="true" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-red-600 mb-1">100% Private</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Zero uploads, zero data retention. Your file never leaves your device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-blue-50/70 rounded-2xl p-4">
                  <Gauge aria-hidden="true" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">Instant Results</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      No upload wait, no server queue. Processing starts immediately.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50/70 rounded-2xl p-4">
                  <FileType aria-hidden="true" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">No Watermarks</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Clean, standard PDF output with no branding added.
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          </section>

          {/* ── Frequently Asked Questions ────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileType aria-hidden="true" className="w-4 h-4 text-emerald-500" />
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
