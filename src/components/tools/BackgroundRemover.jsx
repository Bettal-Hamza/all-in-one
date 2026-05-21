import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { removeBackground } from '@imgly/background-removal'
import {
  Download, Sparkles, ChevronsLeftRight,
  FileImage, ChevronDown, ShieldCheck, Cpu,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import SEOManager from '../SEOManager.jsx'
import FAQSchema from '../FAQSchema.jsx'
import HowToSchema from '../HowToSchema.jsx'

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
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

// ─── SEO CONTENT ─────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: FileImage,
    title: 'Upload your photo',
    body: 'Drag any JPG, PNG, or WebP image onto the upload area, or click to browse. On first use, the AI model downloads once (~25 MB) and is cached by your browser for instant future runs.',
  },
  {
    Icon: Cpu,
    title: 'On-device AI processes it',
    body: 'The neural network runs entirely in your browser via WebAssembly and ONNX Runtime. No data is sent to any server. Processing typically completes in 3–10 seconds depending on image resolution.',
  },
  {
    Icon: Download,
    title: 'Download transparent PNG',
    body: 'Save the result as a lossless PNG with a full alpha-channel transparent background. Drop it straight into Figma, Canva, Photoshop, or your CMS — no extra editing needed.',
  },
]

const FAQS = [
  {
    q: 'Does the AI background remover work on all types of photos?',
    a: 'Yes — the model handles people, products, animals, objects, and most complex scenes. It performs best on images with clear subject-to-background contrast. Very fine details like loose hair strands or transparent objects may show minor edge artefacts, but results are clean on the vast majority of everyday photos. Portrait and product photography consistently yield excellent results.',
  },
  {
    q: 'Is my photo uploaded to a server?',
    a: 'No. Toolyy\'s background remover runs 100% in your browser using WebAssembly and ONNX Runtime — the same underlying technology used by native desktop AI tools, but packaged to run inside a web page. Your image pixels never leave your device. There is no server endpoint that receives file data, which means complete privacy even for sensitive photos such as headshots, ID documents, or personal images.',
  },
  {
    q: 'Why does it take time on the first use?',
    a: 'The first time you use the tool, your browser downloads the AI model weights — roughly 25 MB. This happens automatically in the background while you select your image. After that initial download, your browser caches the model, so every subsequent run on the same device starts almost instantly without re-downloading anything.',
  },
  {
    q: 'What format is the output file?',
    a: 'The output is always a lossless PNG with full alpha-channel transparency. PNG is the correct format for transparent images — JPEG does not support transparency. The downloaded file is named with a "-nobg.png" suffix so it is easy to identify. You can open it in any image editor, design tool, or browser that supports PNG transparency.',
  },
  {
    q: 'Can I use the processed images for commercial purposes?',
    a: 'Yes. Toolyy does not claim any rights over files you process. The output images are yours to use for any personal or commercial purpose. Just ensure you hold the rights to the original photo before processing — Toolyy is a tool, not a licence to use third-party images.',
  },
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

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
          aria-hidden="true"
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

function CompareSlider({ origUrl, resultUrl, dims }) {
  const [pos, setPos]     = useState(50)
  const containerRef      = useRef(null)
  const dragging          = useRef(false)

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

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchmove',  onMove, { passive: true })
    window.addEventListener('touchend',   onUp)
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchmove',  onMove)
      window.removeEventListener('touchend',   onUp)
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
      <img
        src={origUrl}
        alt="Original uploaded photo before AI background removal — before state of the comparison slider"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div className="absolute inset-0" style={CHECKERBOARD} />
        <img
          src={resultUrl}
          alt="Processed photo with background removed, showing transparent checkerboard areas — after state of the comparison slider"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)] pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.22)] flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight aria-hidden="true" size={18} className="text-gray-500" strokeWidth={2.5} />
      </div>
      <span className="absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase text-white bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        After
      </span>
      <span className="absolute top-3 right-3 text-[10px] font-black tracking-widest uppercase text-white bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        Before
      </span>
    </div>
  )
}

function MagicLoader({ label, pct, slowNetwork }) {
  return (
    <div className="flex flex-col items-center gap-7 py-10">
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
          animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <Sparkles aria-hidden="true" size={46} className="text-brand" strokeWidth={1.5} />
        </motion.div>
      </div>

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

      <AnimatePresence>
        {slowNetwork && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 max-w-xs"
          >
            <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠</span>
            <p className="text-xs text-amber-700 font-semibold leading-relaxed">
              This is taking longer than usual. The AI model is ~25 MB and download speed depends
              on your network connection. Sorry for the wait — please hang tight!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function BackgroundRemover() {
  const [phase, setPhase]               = useState('idle')
  const [isDragOver, setIsDrag]         = useState(false)
  const [file, setFile]                 = useState(null)
  const [origUrl, setOrigUrl]           = useState(null)
  const [resultUrl, setResultUrl]       = useState(null)
  const [resultBlob, setResultBlob]     = useState(null)
  const [dims, setDims]                 = useState({ w: 0, h: 0 })
  const [progressPct, setProgressPct]   = useState(0)
  const [progressLabel, setProgressLabel] = useState('Loading AI model…')
  const [isSlowNetwork, setIsSlowNetwork] = useState(false)
  const [error, setError]               = useState(null)

  const inputRef    = useRef(null)
  const origRef     = useRef(null)
  const resultRef   = useRef(null)
  const slowTimerRef = useRef(null)

  useEffect(() => {
    recordVisit('background-remover')
    return () => {
      if (origRef.current)   URL.revokeObjectURL(origRef.current)
      if (resultRef.current) URL.revokeObjectURL(resultRef.current)
      clearTimeout(slowTimerRef.current)
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
    setIsSlowNetwork(false)
    clearTimeout(slowTimerRef.current)
    slowTimerRef.current = setTimeout(() => setIsSlowNetwork(true), 15000)
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
      clearTimeout(slowTimerRef.current)
      setProgressPct(100)
      setPhase('done')
    } catch (err) {
      clearTimeout(slowTimerRef.current)
      setIsSlowNetwork(false)
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
    clearTimeout(slowTimerRef.current)
    setIsSlowNetwork(false)
    if (origRef.current)   URL.revokeObjectURL(origRef.current)
    if (resultRef.current) URL.revokeObjectURL(resultRef.current)
    origRef.current = null
    resultRef.current = null
    setFile(null); setOrigUrl(null); setResultUrl(null); setResultBlob(null)
    setDims({ w: 0, h: 0 }); setError(null); setProgressPct(0)
    setPhase('idle')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="AI Background Remover Online | Remove Backgrounds Instantly"
        description="Erase image backgrounds in seconds using on-device AI powered by WebAssembly. No uploads to any server, no sign-up, and outputs clean transparent PNGs."
        appName="AI Background Remover"
        appDescription="Remove image backgrounds instantly using on-device AI inference via WebAssembly. Outputs transparent PNG, runs entirely in your browser — zero uploads."
      />
      <HowToSchema
        name="How to Remove Image Backgrounds Free Online"
        description="Remove backgrounds from photos instantly using on-device AI at Toolyy — no uploads, no sign-up."
        steps={[
          'Go to toolyy.net and select the Background Remover tool.',
          'Drag and drop your JPG, PNG, or WebP photo into the workspace.',
          'The AI processes your image locally, then download the transparent PNG result.',
        ]}
        totalTime="PT30S"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page hero ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Image Tools</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Background Remover
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Remove any image background instantly with on-device AI — no uploads, no accounts.
        </p>
      </motion.div>

      {/* ── Tool ─────────────────────────────────────────────── */}
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
                  rotate: isDragOver ? [-5, 5, -5] : 0,
                  scale:  isDragOver ? 1.18 : 1,
                }}
                transition={isDragOver
                  ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 260, damping: 18 }
                }
                className="inline-block mb-6"
              >
                <Sparkles
                  aria-hidden="true"
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
              {origUrl && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <img
                    src={origUrl}
                    alt="Small thumbnail preview of the image currently being processed by the background removal tool"
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-gray-800 truncate">{file?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Processing…</p>
                  </div>
                </div>
              )}
              <MagicLoader label={progressLabel} pct={progressPct} slowNetwork={isSlowNetwork} />
            </div>
          </motion.div>
        )}

        {/* ── DONE ─────────────────────────────────────────────── */}
        {phase === 'done' && (
          <motion.div key="done" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* ── Main panel: slider ───────────────────────── */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 sm:p-8 flex flex-col gap-5">

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

                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 -mt-1">
                  <ChevronsLeftRight aria-hidden="true" size={13} />
                  Drag the handle to compare before and after
                </p>

                {origUrl && resultUrl && (
                  <CompareSlider origUrl={origUrl} resultUrl={resultUrl} dims={dims} />
                )}
              </div>

              {/* ── Sidebar: download ────────────────────────── */}
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-2xl shadow-lg transition-colors"
                >
                  <Download aria-hidden="true" size={20} strokeWidth={2.5} />
                  Download PNG
                </motion.button>

                <p className="text-[11px] text-gray-300 font-medium text-center leading-relaxed">
                  Transparent background · lossless PNG
                </p>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── SEO Article ──────────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20"
        aria-label="AI Background Remover — complete guide"
      >

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          AI Background Remover — Free Online Tool, No Upload Required
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's background remover uses a neural network running directly in your browser to
          isolate subjects and erase backgrounds in seconds — with no account, no watermark, and no
          file ever leaving your device.
        </p>

        <div className="space-y-16">

          {/* ── How to Remove a Background ───────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <Sparkles aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Remove an Image Background in 3 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_TO_STEPS.map(({ Icon, title, body }, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center">
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

          {/* ── Why use a browser-based background remover ───── */}
          <section aria-labelledby="why-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-violet-500" />
              </div>
              <h2 id="why-heading" className="text-xl font-black text-gray-900">
                Why Use a Browser-Based AI Background Remover?
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Background removal used to require Photoshop expertise or a paid subscription
                  to services like remove.bg. Toolyy changes that equation entirely. Our
                  <strong className="text-gray-800"> free AI background remover</strong> uses the
                  same class of neural network — a U²-Net architecture — but runs it directly in
                  your browser via <strong className="text-gray-800">WebAssembly and ONNX Runtime</strong>,
                  without routing your image through any external server.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  This matters most for sensitive images. Headshots for job applications, product
                  photos containing proprietary designs, and personal photographs are all examples
                  of files you may not want processed on a stranger's server. Toolyy's
                  architecture makes that concern irrelevant — <strong className="text-gray-800">your photo never leaves
                  your device</strong>. The AI model runs locally, producing a result that is
                  identical in quality to server-based alternatives.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  The output is a <strong className="text-gray-800">lossless PNG with full alpha-channel
                  transparency</strong> — the correct format for backgrounds that need to be
                  invisible. Drop the result straight into Figma, Canva, Adobe Illustrator, or
                  your e-commerce product listing. The checkerboard pattern you see in the
                  preview is just how transparency is visualised on screen; your exported file
                  contains a clean transparent background.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  After the first run, the AI model is cached by your browser. Subsequent
                  background removals start instantly — no re-download, no waiting. The tool
                  works entirely offline once the model is cached, which also means no bandwidth
                  costs for repeat use.
                </p>
              </div>

              <aside
                aria-label="Background remover highlights"
                className="mt-8 lg:mt-0 lg:w-52 flex-shrink-0 flex flex-col gap-3"
              >
                {[
                  {
                    Icon: ShieldCheck,
                    bg: 'bg-emerald-50/70',
                    color: 'text-emerald-500',
                    label: '100% Private',
                    desc: 'Your photo never leaves your device — no server receives your image.',
                  },
                  {
                    Icon: Cpu,
                    bg: 'bg-violet-50/70',
                    color: 'text-violet-500',
                    label: 'On-Device AI',
                    desc: 'Neural network runs in your browser via WebAssembly and ONNX Runtime.',
                  },
                  {
                    Icon: Download,
                    bg: 'bg-blue-50/70',
                    color: 'text-blue-500',
                    label: 'Transparent PNG',
                    desc: 'Full alpha-channel output ready for design tools, print, or web.',
                  },
                ].map(({ Icon, bg, color, label, desc }) => (
                  <div key={label} className={`flex items-start gap-3 ${bg} rounded-2xl p-4`}>
                    <Icon aria-hidden="true" className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-xs font-black uppercase tracking-wider ${color} mb-1`}>{label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </aside>

            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Sparkles aria-hidden="true" className="w-4 h-4 text-violet-500" />
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
