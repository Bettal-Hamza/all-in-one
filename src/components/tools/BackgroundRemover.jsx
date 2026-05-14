import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { removeBackground } from '@imgly/background-removal'
import { Download, Sparkles, ChevronsLeftRight } from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'

const ACCEPT = 'image/jpeg,image/png,image/webp'

const CHECKERBOARD = {
  backgroundImage:
    'linear-gradient(45deg,#e5e7eb 25%,transparent 25%),' +
    'linear-gradient(-45deg,#e5e7eb 25%,transparent 25%),' +
    'linear-gradient(45deg,transparent 75%,#e5e7eb 75%),' +
    'linear-gradient(-45deg,transparent 75%,#e5e7eb 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0,0 8px,8px -8px,-8px 0px',
  backgroundColor: '#f9fafb',
}

const STAGE_MAP = {
  'compute:decode':    { pct: 68, label: 'Reading your image…' },
  'compute:inference': { pct: 80, label: 'AI is removing the background…' },
  'compute:mask':      { pct: 91, label: 'Refining edges…' },
  'compute:encode':    { pct: 96, label: 'Encoding result…' },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

// ── Before/After Slider ───────────────────────────────────────────────
function CompareSlider({ origUrl, resultUrl, dims }) {
  const [pos, setPos] = useState(50)           // 0-100 %
  const containerRef  = useRef(null)
  const dragging      = useRef(false)

  const getPos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 50
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const x = e.touches ? e.touches[0].clientX : e.clientX
      setPos(getPos(x))
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend',  onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend',  onUp)
    }
  }, [getPos])

  const startDrag = (e) => {
    dragging.current = true
    const x = e.touches ? e.touches[0].clientX : e.clientX
    setPos(getPos(x))
  }

  const aspect = dims.w && dims.h ? `${dims.w} / ${dims.h}` : '4 / 3'

  return (
    <div
      ref={containerRef}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      className="relative w-full overflow-hidden rounded-2xl cursor-ew-resize select-none"
      style={{ aspectRatio: aspect, maxHeight: '460px' }}
    >
      {/* Base: original image */}
      <img
        src={origUrl}
        alt="Original"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* After layer: clipped to left side of slider */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="absolute inset-0" style={CHECKERBOARD} />
        <img
          src={resultUrl}
          alt="Background removed"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)] pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.22)] flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight size={18} className="text-gray-500" strokeWidth={2.5} />
      </div>

      {/* Corner labels */}
      <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase text-white bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        After
      </span>
      <span className="absolute top-3 right-3 text-[10px] font-black tracking-widest uppercase text-white bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        Before
      </span>
    </div>
  )
}

// ── Magic loading animation ───────────────────────────────────────────
function MagicLoader({ label, pct }) {
  return (
    <div className="flex flex-col items-center gap-7 py-10">
      {/* Sparkles with orbit rings */}
      <div className="relative flex items-center justify-center w-24 h-24">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.04, 0.15] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-24 h-24 rounded-full bg-brand"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.06, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="absolute w-16 h-16 rounded-full bg-brand"
        />
        <motion.div
          animate={{
            rotate:  [0, 15, -10, 0],
            scale:   [1, 1.12, 0.94, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <Sparkles size={46} className="text-brand" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Stage label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-lg font-extrabold text-gray-800"
        >
          {label}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400 font-semibold text-center tabular-nums">
          {pct > 0 ? `${pct}%` : 'Starting…'}
        </p>
      </div>

      <p className="text-xs text-gray-300 font-medium">
        Processing on your device — nothing is uploaded.
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────
export default function BackgroundRemover() {
  const [phase, setPhase]         = useState('idle')   // idle | processing | done
  const [isDragOver, setIsDrag]   = useState(false)
  const [file, setFile]           = useState(null)
  const [origUrl, setOrigUrl]     = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [resultBlob, setResultBlob] = useState(null)
  const [dims, setDims]           = useState({ w: 0, h: 0 })
  const [progressPct, setProgressPct]     = useState(0)
  const [progressLabel, setProgressLabel] = useState('Loading AI model…')
  const [error, setError]         = useState(null)

  const inputRef    = useRef(null)
  const origRef     = useRef(null)
  const resultRef   = useRef(null)

  useEffect(() => {
    recordVisit('background-remover')
    return () => {
      if (origRef.current)   URL.revokeObjectURL(origRef.current)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    }
  }, [])

  function onProgress(key, current, total) {
    if (key.startsWith('fetch:')) {
      const pct = total > 0 ? Math.round((current / total) * 62) : 10
      setProgressPct(pct)
      setProgressLabel('Loading AI model…')
    } else {
      const stage = STAGE_MAP[key]
      if (stage) {
        const extra = key === 'compute:encode' ? current * 1.5 : 0
        setProgressPct(Math.round(stage.pct + extra))
        setProgressLabel(stage.label)
      }
    }
  }

  async function handleFile(f) {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please drop an image file (JPG, PNG, or WebP).')
      return
    }

    if (origRef.current)   URL.revokeObjectURL(origRef.current)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)

    const url = URL.createObjectURL(f)
    origRef.current = url

    // Read image dimensions
    const img = new Image()
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = url

    setFile(f)
    setOrigUrl(url)
    setResultUrl(null)
    setResultBlob(null)
    setError(null)
    setProgressPct(0)
    setProgressLabel('Loading AI model…')
    setPhase('processing')

    try {
      const blob = await removeBackground(f, {
        model: 'medium',
        output: { format: 'image/png', quality: 1 },
        progress: onProgress,
      })
      const outUrl = URL.createObjectURL(blob)
      resultRef.current = outUrl
      setResultBlob(blob)
      setResultUrl(outUrl)
      setProgressPct(100)
      setPhase('done')
    } catch (err) {
      console.error(err)
      setError(err?.message ?? 'Processing failed. Try a different image.')
      setPhase('idle')
    }
  }

  function handleDownload() {
    if (!resultBlob) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = (file?.name?.replace(/\.[^.]+$/, '') ?? 'image') + '-nobg.png'
    a.click()
  }

  function handleReset() {
    if (origRef.current)   URL.revokeObjectURL(origRef.current)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    origRef.current = null
    resultRef.current = null
    setFile(null); setOrigUrl(null); setResultUrl(null); setResultBlob(null)
    setDims({ w: 0, h: 0 }); setError(null); setProgressPct(0)
    setPhase('idle')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Image Tools</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Background Remover
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Remove any image background instantly with on-device AI — no uploads, no accounts.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── IDLE ─────────────────────────────────────────────── */}
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
                animate={{
                  rotate:  isDragOver ? [-5, 5, -5] : 0,
                  scale:   isDragOver ? 1.18 : 1,
                }}
                transition={isDragOver
                  ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 260, damping: 18 }
                }
                className="inline-block mb-6"
              >
                <Sparkles
                  size={64}
                  className={isDragOver ? 'text-brand' : 'text-violet-400'}
                  strokeWidth={1.5}
                />
              </motion.div>

              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to remove background' : 'Drop your photo here'}
              </p>
              <p className="text-gray-400 text-sm font-medium mb-6">
                or click to browse · JPG, PNG, WebP · processed locally
              </p>

              <div className="flex justify-center gap-2">
                {['JPG', 'PNG', 'WebP'].map(f => (
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
                aria-label="Image upload"
                onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
              />
            </div>
          </motion.div>
        )}

        {/* ── PROCESSING ───────────────────────────────────────── */}
        {phase === 'processing' && (
          <motion.div key="processing" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass px-8 py-6">
              {/* Thumbnail strip */}
              {origUrl && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <img
                    src={origUrl}
                    alt="Uploading"
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 truncate">{file?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Processing…</p>
                  </div>
                </div>
              )}
              <MagicLoader label={progressLabel} pct={progressPct} />
            </div>
          </motion.div>
        )}

        {/* ── DONE ─────────────────────────────────────────────── */}
        {phase === 'done' && (
          <motion.div key="done" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 sm:p-8 flex flex-col gap-6">

              {/* File header */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">Done</p>
                  <h2 className="text-xl font-black text-gray-900 truncate">{file?.name}</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    Background removed · PNG with transparency
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex-shrink-0 text-xs text-gray-300 hover:text-gray-600 font-semibold underline underline-offset-2 transition-colors"
                >
                  New image
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 -mt-2">
                <ChevronsLeftRight size={13} />
                Drag the handle to compare before and after
              </p>

              {/* Before / After slider */}
              {origUrl && resultUrl && (
                <CompareSlider origUrl={origUrl} resultUrl={resultUrl} dims={dims} />
              )}

              {/* Download */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-2xl shadow-lg transition-colors"
              >
                <Download size={20} strokeWidth={2.5} />
                Download PNG
                <span className="text-sm font-semibold text-white/60 ml-1">· transparent background</span>
              </motion.button>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
