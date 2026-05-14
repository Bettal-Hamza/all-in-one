import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Zap, FileImage } from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'

const ACCEPT = 'image/jpeg,image/png'
const DEFAULT_QUALITY = 82

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function toWebP(objectUrl, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject(new Error('WebP conversion failed'))),
        'image/webp',
        quality / 100,
      )
    }
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = objectUrl
  })
}

export default function ImageOptimizer() {
  const [phase, setPhase]       = useState('idle')       // 'idle' | 'loading' | 'done'
  const [isDragOver, setIsDrag] = useState(false)
  const [file, setFile]         = useState(null)
  const [origUrl, setOrigUrl]   = useState(null)
  const [quality, setQuality]   = useState(DEFAULT_QUALITY)
  const [result, setResult]     = useState(null)          // { blob, url }
  const [converting, setConv]   = useState(false)
  const [error, setError]       = useState(null)

  const inputRef    = useRef(null)
  const origRef     = useRef(null)   // tracks object URL for cleanup
  const resultRef   = useRef(null)   // tracks object URL for cleanup
  const debounceRef = useRef(null)

  useEffect(() => {
    recordVisit('image-converter')
    return () => {
      if (origRef.current)   URL.revokeObjectURL(origRef.current)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    }
  }, [])

  async function runConvert(objectUrl, q) {
    setConv(true)
    try {
      const blob = await toWebP(objectUrl, q)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
      const url = URL.createObjectURL(blob)
      resultRef.current = url
      setResult({ blob, url })
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setConv(false)
    }
  }

  async function handleFile(f) {
    if (!f) return
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      setError('Only JPG and PNG files are supported.')
      return
    }
    clearTimeout(debounceRef.current)
    if (origRef.current)   URL.revokeObjectURL(origRef.current)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    resultRef.current = null

    const url = URL.createObjectURL(f)
    origRef.current = url
    setFile(f)
    setOrigUrl(url)
    setResult(null)
    setError(null)
    setQuality(DEFAULT_QUALITY)
    setPhase('loading')
    await runConvert(url, DEFAULT_QUALITY)
    setPhase('done')
  }

  function handleQualityChange(val) {
    setQuality(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (origRef.current) runConvert(origRef.current, val)
    }, 260)
  }

  function handleDownload() {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = file.name.replace(/\.[^.]+$/, '') + '.webp'
    a.click()
  }

  function handleReset() {
    clearTimeout(debounceRef.current)
    if (origRef.current)   URL.revokeObjectURL(origRef.current)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    origRef.current = null
    resultRef.current = null
    setFile(null); setOrigUrl(null); setResult(null)
    setError(null); setQuality(DEFAULT_QUALITY); setPhase('idle')
  }

  const origSize  = file?.size ?? 0
  const webpSize  = result?.blob.size ?? 0
  const savedPct  = origSize > 0 && webpSize > 0
    ? Math.round((1 - webpSize / origSize) * 100)
    : null
  const sizeGrew  = savedPct !== null && savedPct < 0
  const savedBytes = origSize - webpSize

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* ── Page header ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Image Tools</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Image Optimizer
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Convert JPG &amp; PNG to WebP for faster websites — runs entirely in your browser, zero uploads.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── IDLE ──────────────────────────────────────────────────── */}
        {phase === 'idle' && (
          <motion.div key="idle" {...fadeUp}>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={e => { e.preventDefault(); setIsDrag(false); handleFile(e.dataTransfer?.files?.[0]) }}
              onDragOver={e => { e.preventDefault(); setIsDrag(true) }}
              onDragLeave={() => setIsDrag(false)}
              className={`
                relative cursor-pointer rounded-3xl border-2 p-16 text-center
                bg-surface-card backdrop-blur-xl transition-all duration-300
                ${isDragOver
                  ? 'border-brand shadow-glow scale-[1.01]'
                  : 'border-white/50 shadow-glass hover:border-brand/25 hover:shadow-glass-lg'}
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
                <FileImage className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to optimize' : 'Drop your image here'}
              </p>
              <p className="text-gray-400 text-sm font-medium mb-6">
                or click to browse · JPG and PNG only · processed locally
              </p>
              <div className="flex justify-center gap-2">
                {['JPG', 'JPEG', 'PNG'].map(f => (
                  <span key={f} className="text-[10px] font-bold text-gray-300 bg-gray-100 px-2.5 py-1 rounded-full tracking-wide">
                    {f}
                  </span>
                ))}
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-5 text-sm text-red-500 font-semibold"
                >
                  {error}
                </motion.p>
              )}
              <input
                ref={inputRef} type="file" accept={ACCEPT} className="sr-only"
                aria-label="Image file upload"
                onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
              />
            </div>
          </motion.div>
        )}

        {/* ── LOADING (first conversion) ─────────────────────────── */}
        {phase === 'loading' && (
          <motion.div key="loading" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-16 flex flex-col items-center gap-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={44} className="text-brand" />
              </motion.div>
              <p className="text-lg font-extrabold text-gray-800">Converting to WebP…</p>
              <p className="text-sm text-gray-400 font-medium">Running on-device. Nothing leaves your browser.</p>
            </div>
          </motion.div>
        )}

        {/* ── DONE ──────────────────────────────────────────────────── */}
        {phase === 'done' && (
          <motion.div key="done" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 sm:p-8 flex flex-col gap-6">

              {/* File header */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">
                    Optimized
                  </p>
                  <h2 className="text-xl font-black text-gray-900 truncate">{file?.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {file?.type?.split('/')[1]?.toUpperCase()} · {formatBytes(origSize)}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex-shrink-0 text-xs text-gray-300 hover:text-gray-600 font-semibold underline underline-offset-2 transition-colors"
                >
                  Start over
                </button>
              </div>

              {/* Before / After */}
              <div className="grid grid-cols-2 gap-4">

                {/* BEFORE */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Before</p>
                  <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50/80 h-48 flex items-center justify-center">
                    {origUrl && (
                      <img src={origUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {file?.type?.split('/')[1]?.toUpperCase()}
                    </p>
                    <p className="text-2xl font-black text-gray-800 mt-0.5 tabular-nums">
                      {formatBytes(origSize)}
                    </p>
                  </div>
                </div>

                {/* AFTER */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">After</p>
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50/80 h-48 flex items-center justify-center">
                    <AnimatePresence>
                      {converting && (
                        <motion.div
                          key="conv-overlay"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-white/75 backdrop-blur-sm flex items-center justify-center z-10"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                          >
                            <Zap size={22} className="text-brand" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {result?.url && (
                      <img src={result.url} alt="Optimized WebP" className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">WebP</p>
                      <p className="text-2xl font-black text-gray-800 mt-0.5 tabular-nums">
                        {result ? formatBytes(webpSize) : '—'}
                      </p>
                    </div>

                    {/* Compact delta badge */}
                    {savedPct !== null && (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={savedPct}
                          initial={{ opacity: 0, scale: 0.8, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                          className={`
                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black
                            ${sizeGrew
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}
                          `}
                        >
                          {sizeGrew ? '▲' : '▼'}&nbsp;{Math.abs(savedPct)}%
                        </motion.span>
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Savings callout ────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {savedPct !== null && (
                  <motion.div
                    key={savedPct}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      flex items-center justify-between rounded-2xl px-5 py-4
                      ${sizeGrew
                        ? 'bg-amber-50 border border-amber-100'
                        : 'bg-emerald-50 border border-emerald-100'}
                    `}
                  >
                    <div>
                      <p className={`text-sm font-extrabold ${sizeGrew ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {sizeGrew
                          ? `File grew by ${Math.abs(savedPct)}% at this quality`
                          : `Saved ${savedPct}% — nice!`}
                      </p>
                      <p className={`text-xs font-medium mt-0.5 ${sizeGrew ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {formatBytes(origSize)} → {formatBytes(webpSize)}
                        {!sizeGrew && ` · ${formatBytes(savedBytes)} freed`}
                        {sizeGrew && ' · Try lowering the quality slider'}
                      </p>
                    </div>
                    <p className={`text-4xl font-black tabular-nums leading-none ${sizeGrew ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {sizeGrew ? '+' : '−'}{Math.abs(savedPct)}%
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Quality slider ─────────────────────────────────── */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-gray-700">Quality</p>
                  <span className="text-sm font-black text-brand tabular-nums">{quality}%</span>
                </div>
                <div className="relative py-1">
                  {/* Filled track */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-gray-100 pointer-events-none" />
                  <div
                    className="absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full bg-brand pointer-events-none transition-all duration-150"
                    style={{ width: `${quality}%` }}
                  />
                  <input
                    type="range" min={1} max={100} value={quality}
                    onChange={e => handleQualityChange(Number(e.target.value))}
                    className="relative w-full appearance-none bg-transparent cursor-pointer h-2
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand
                      [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand
                      [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-300 tracking-widest">
                  <span>SMALLEST FILE</span>
                  <span>BEST QUALITY</span>
                </div>
              </div>

              {/* ── Download button ────────────────────────────────── */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={handleDownload}
                disabled={!result || converting}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-2xl shadow-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={20} strokeWidth={2.5} />
                Download WebP
                {result && !converting && (
                  <span className="text-sm font-semibold text-white/60 ml-1">
                    · {formatBytes(webpSize)}
                  </span>
                )}
              </motion.button>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
