import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Zap, LayoutGrid, Download, Check, X,
  ChevronDown, ShieldCheck, Gauge, FileType, FileText,
  RotateCcw, Files, FileOutput, CheckSquare, Square,
} from 'lucide-react'
import { splitPdf, mergePages } from '../../lib/pdfSplitter.js'
import { recordVisit } from '../../lib/recentTools.js'
import ProgressBar from '../ui/ProgressBar.jsx'
import SEOManager from '../SEOManager.jsx'

const ACCEPT = 'application/pdf'
const THUMB_SCALE = 0.5

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

function parseRangeInput(input, max) {
  const indices = new Set()
  const parts = input.split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = Math.max(1, parseInt(rangeMatch[1], 10))
      const end = Math.min(max, parseInt(rangeMatch[2], 10))
      for (let i = start; i <= end; i++) indices.add(i - 1)
    } else {
      const num = parseInt(trimmed, 10)
      if (num >= 1 && num <= max) indices.add(num - 1)
    }
  }
  return [...indices].sort((a, b) => a - b)
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
    title: 'Select your pages',
    body: 'Click page thumbnails to select the ones you need, use "Select All", or type a custom range like "1-3, 5, 8-10". Visual previews make it easy to find the right pages.',
  },
  {
    Icon: Download,
    title: 'Download your way',
    body: 'Choose to download selected pages as separate PDF files, or merge them into a single combined PDF. One click and your files are ready.',
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
    q: 'Can I merge selected pages into one PDF?',
    a: 'Yes! After splitting, select the pages you want, then choose "Merged PDF" as your download mode. Toolyy will combine those pages into a single PDF file in the order they appear in the original document. This is perfect for extracting specific chapters or sections.',
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

// ─── THUMBNAIL RENDERER ─────────────────────────────────────────────────────

function PageThumbnail({ fileArrayBuffer, pageIndex, selected, onToggle }) {
  const canvasRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function render() {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString()

      const pdf = await pdfjsLib.getDocument({ data: fileArrayBuffer.slice(0) }).promise
      const page = await pdf.getPage(pageIndex + 1)
      const viewport = page.getViewport({ scale: THUMB_SCALE })
      const canvas = canvasRef.current
      if (!canvas || cancelled) return
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')
      await page.render({ canvasContext: ctx, viewport }).promise
      if (!cancelled) setRendered(true)
    }
    render()
    return () => { cancelled = true }
  }, [fileArrayBuffer, pageIndex])

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative group rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand
        ${selected
          ? 'border-brand shadow-glow ring-2 ring-brand/20 scale-[1.02]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-glass'
        }
      `}
    >
      <div className="bg-white">
        <canvas
          ref={canvasRef}
          className={`w-full h-auto block transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0'}`}
        />
        {!rendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-brand rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Selection overlay */}
      <div className={`absolute inset-0 transition-colors duration-200 ${selected ? 'bg-brand/10' : 'bg-transparent group-hover:bg-gray-900/5'}`} />

      {/* Checkbox */}
      <div className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
        selected ? 'bg-brand text-white shadow-md' : 'bg-white/90 border border-gray-300 text-transparent group-hover:border-gray-400'
      }`}>
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </div>

      {/* Page number */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
        <p className="text-white text-xs font-bold text-center">Page {pageIndex + 1}</p>
      </div>
    </button>
  )
}

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
  const [selected, setSelected]         = useState(new Set())
  const [rangeInput, setRangeInput]     = useState('')
  const [downloadMode, setDownloadMode] = useState('separate')
  const [merging, setMerging]           = useState(false)
  const inputRef      = useRef(null)
  const urlsRef       = useRef([])
  const fileRef       = useRef(null)
  const arrayBufRef   = useRef(null)

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
    setSelected(new Set())
    setRangeInput('')
    setDownloadMode('separate')
    fileRef.current = file
    arrayBufRef.current = await file.arrayBuffer()

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
    setSelected(new Set())
    setRangeInput('')
    fileRef.current = null
    arrayBufRef.current = null
  }

  const togglePage = useCallback((index) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
    setRangeInput('')
  }, [])

  function selectAll() {
    setSelected(new Set(pages.map((_, i) => i)))
    setRangeInput('')
  }

  function deselectAll() {
    setSelected(new Set())
    setRangeInput('')
  }

  function applyRange() {
    if (!rangeInput.trim()) return
    const indices = parseRangeInput(rangeInput, pages.length)
    setSelected(new Set(indices))
  }

  async function handleDownload() {
    const indices = [...selected].sort((a, b) => a - b)
    if (indices.length === 0) return

    if (downloadMode === 'merged') {
      setMerging(true)
      try {
        const result = await mergePages(fileRef.current, indices)
        const a = document.createElement('a')
        a.href = result.url
        a.download = result.filename
        a.click()
        setTimeout(() => URL.revokeObjectURL(result.url), 5000)
      } finally {
        setMerging(false)
      }
    } else {
      indices.forEach((pageIdx, i) => {
        setTimeout(() => {
          const { url, filename } = pages[pageIdx]
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.click()
        }, i * 150)
      })
    }
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

  const selectedCount = selected.size

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Free PDF Splitter Online | Extract Pages Instantly"
        description="Split files and extract specific pages from your PDF documents completely client-side. Fast, safe, and works entirely in your browser without uploading data."
        appName="Free PDF Splitter Online"
        appDescription="Split and extract specific pages from multi-page PDFs entirely in your browser. Select pages visually, download separately or merged — no uploads, no servers."
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

        {phase === 'processing' && (
          <motion.div key="processing" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="min-w-0 pr-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">
                    Splitting PDF…
                  </p>
                  <h2 className="text-xl font-black text-gray-900 truncate">{fileName}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">{formatBytes(fileSize)}</p>
                </div>
              </div>
              <ProgressBar pct={progress} />
              <p className="mt-3 text-sm text-gray-400 font-medium">{progressLabel || 'Starting…'}</p>
            </div>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" {...fadeUp}>

            {/* ── Toolbar ──────────────────────────────────────── */}
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-2xl shadow-glass p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                {/* File info + reset */}
                <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{fileName}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{pages.length} pages · {formatBytes(fileSize)}</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="ml-1 p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    title="Start over"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-200" />

                {/* Selection controls */}
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <button
                    onClick={selectAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" /> None
                  </button>

                  <div className="hidden sm:block w-px h-6 bg-gray-200" />

                  {/* Range input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') applyRange() }}
                      placeholder="e.g. 1-3, 5, 8-10"
                      className="w-36 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition-all"
                    />
                    <button
                      onClick={applyRange}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Selection count */}
                <div className="flex-shrink-0">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                    selectedCount > 0
                      ? 'bg-brand/10 text-brand'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {selectedCount} selected
                  </span>
                </div>
              </div>
            </div>

            {/* ── Thumbnail Grid ───────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-5">
              {pages.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.3 }}
                >
                  <PageThumbnail
                    fileArrayBuffer={arrayBufRef.current}
                    pageIndex={i}
                    selected={selected.has(i)}
                    onToggle={() => togglePage(i)}
                  />
                </motion.div>
              ))}
            </div>

            {/* ── Download Bar ──────────────────────────────────── */}
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-2xl shadow-glass p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                {/* Download mode toggle */}
                <div className="flex rounded-xl bg-gray-100 p-1 flex-shrink-0">
                  <button
                    onClick={() => setDownloadMode('separate')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      downloadMode === 'separate'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Files className="w-3.5 h-3.5" /> Separate PDFs
                  </button>
                  <button
                    onClick={() => setDownloadMode('merged')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      downloadMode === 'merged'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FileOutput className="w-3.5 h-3.5" /> Merged PDF
                  </button>
                </div>

                <div className="flex-1" />

                {/* Download buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadAll}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Download All Pages
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={selectedCount === 0 || merging}
                    className={`px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                      selectedCount > 0 && !merging
                        ? 'bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/25'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {merging
                      ? 'Merging…'
                      : selectedCount > 0
                        ? `Download ${selectedCount} ${selectedCount === 1 ? 'Page' : 'Pages'}`
                        : 'Select Pages'
                    }
                  </button>
                </div>
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
