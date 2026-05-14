import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { splitPdf } from '../../lib/pdfSplitter.js'
import { recordVisit } from '../../lib/recentTools.js'
import ProgressBar from '../ui/ProgressBar.jsx'
import GlobalAdContainer from '../ads/GlobalAdContainer.jsx'

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

export default function PdfSplitter() {
  const [phase, setPhase] = useState('idle')      // 'idle' | 'processing' | 'done'
  const [progress, setProgress]       = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [pages, setPages]             = useState([])
  const [error, setError]             = useState(null)
  const [fileName, setFileName]       = useState('')
  const [fileSize, setFileSize]       = useState(0)
  const [isDragOver, setIsDragOver]   = useState(false)
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
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">PDF Tools</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          PDF Splitter
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Split any PDF into individual pages — entirely in your browser. Zero uploads.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── IDLE: full-width glass drop card ─────────────────── */}
        {phase === 'idle' && (
          <motion.div key="idle" {...fadeUp}>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer?.files?.[0]) }}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
              onDragLeave={() => setIsDragOver(false)}
              className={`
                relative cursor-pointer rounded-3xl border-2 p-16 text-center
                bg-surface-card backdrop-blur-xl
                transition-all duration-300
                ${isDragOver
                  ? 'border-brand shadow-glow scale-[1.01]'
                  : 'border-white/50 shadow-glass hover:border-brand/25 hover:shadow-glass-lg'
                }
              `}
            >
              {/* Drag-over glow overlay */}
              {isDragOver && (
                <div className="absolute inset-0 rounded-3xl bg-brand/[0.04] pointer-events-none" />
              )}

              <motion.div
                animate={{ scale: isDragOver ? 1.15 : 1, rotate: isDragOver ? -5 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="text-7xl mb-6 select-none inline-block"
              >
                📄
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

        {/* ── PROCESSING / DONE: side-by-side split layout ────── */}
        {(phase === 'processing' || phase === 'done') && (
          <motion.div key="split" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Left panel — file info + progress or results list */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8 flex flex-col">

                {/* File metadata header */}
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

                {/* Processing state */}
                {phase === 'processing' && (
                  <div className="flex-1">
                    <ProgressBar pct={progress} />
                    <p className="mt-3 text-sm text-gray-400 font-medium">{progressLabel || 'Starting…'}</p>
                  </div>
                )}

                {/* Done state — scrollable page list */}
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
                            <span className="text-base">📄</span>
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

                {/* Post-action ad zone below the results list */}
                {phase === 'done' && (
                  <div className="mt-6">
                    <GlobalAdContainer slot="postAction" />
                  </div>
                )}
              </div>

              {/* Right panel — sidebar ad + action button */}
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
    </div>
  )
}
