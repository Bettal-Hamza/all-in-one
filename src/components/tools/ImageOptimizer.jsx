import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Zap, FileImage, ChevronDown, ShieldCheck, Gauge, Globe } from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import SEOManager from '../SEOManager.jsx'
import FAQSchema from '../FAQSchema.jsx'

const ACCEPT       = 'image/jpeg,image/png'
const DEFAULT_QUALITY = 82

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
    title: 'Drop your JPG or PNG',
    body: 'Drag your image onto the upload area, or click to open the file picker. Any JPEG or PNG — photo, screenshot, or graphic — is accepted. Processing starts immediately.',
  },
  {
    Icon: Gauge,
    title: 'Adjust quality to taste',
    body: 'Use the quality slider to balance file size against visual fidelity. 80% is the recommended sweet spot for most web images — about 60–75% smaller than the original with no visible quality loss at normal screen sizes.',
  },
  {
    Icon: Download,
    title: 'Download your WebP file',
    body: 'Click "Download WebP" to save the converted file. Your filename is preserved with a .webp extension. The file is ready to drop straight into your CMS, design tool, or web server.',
  },
]

const FAQS = [
  {
    q: 'Why should I convert images to WebP format?',
    a: 'WebP is Google\'s open-source image format, engineered to produce smaller file sizes than JPEG and PNG at equivalent visual quality. Studies show WebP images are typically 25–34% smaller than comparable JPEGs, and up to 80% smaller than PNGs. Smaller images mean faster page loads, which directly improves your Core Web Vitals score — a confirmed Google ranking signal. If you\'re serious about site performance and SEO, converting your images to WebP is one of the highest-return optimisations you can make.',
  },
  {
    q: 'Is there a file size limit for conversion?',
    a: 'There is no server-side file size limit because your image never gets uploaded. All conversion happens inside your browser using the Canvas API. The practical limit is your device\'s available RAM — most modern laptops and phones can comfortably handle images up to 30–40 megapixels (roughly 200–300 MB as a raw PNG). Very high-resolution files may take a few extra seconds, but they will convert successfully.',
  },
  {
    q: 'Will the converted WebP look different from my original image?',
    a: 'At quality settings of 75% and above, the difference is imperceptible at normal viewing sizes. The quality slider lets you find the exact balance that works for your content. Photography typically tolerates 75–85% with invisible quality loss. Flat graphics, logos, and screenshots with fine text are better served at 85–95%. The before/after comparison panel lets you evaluate both side by side before committing to a download.',
  },
  {
    q: 'Do all browsers support WebP images?',
    a: 'Yes — as of 2023, WebP has universal support across all modern browsers: Chrome, Firefox, Safari (since version 14 on macOS Big Sur and iOS 14), Edge, Opera, and Samsung Internet. According to caniuse.com, WebP is supported by over 97% of global browser usage. If you need to support very old Safari or Internet Explorer, you can serve WebP as the primary source and use the HTML <picture> element with a JPEG fallback.',
  },
  {
    q: 'Can I convert multiple images at once?',
    a: 'Toolyy currently converts one image per session. Batch conversion — processing an entire folder or zip archive — is on our product roadmap. If this is a feature you need regularly, reach out at hello@toolyy.net and we\'ll prioritise accordingly.',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

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
      canvas.width  = img.naturalWidth
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function ImageOptimizer() {
  const [phase, setPhase]       = useState('idle')   // 'idle' | 'loading' | 'done'
  const [isDragOver, setIsDrag] = useState(false)
  const [file, setFile]         = useState(null)
  const [origUrl, setOrigUrl]   = useState(null)
  const [quality, setQuality]   = useState(DEFAULT_QUALITY)
  const [result, setResult]     = useState(null)     // { blob, url }
  const [converting, setConv]   = useState(false)
  const [error, setError]       = useState(null)

  const inputRef    = useRef(null)
  const origRef     = useRef(null)
  const resultRef   = useRef(null)
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
    origRef.current   = null
    resultRef.current = null
    setFile(null); setOrigUrl(null); setResult(null)
    setError(null); setQuality(DEFAULT_QUALITY); setPhase('idle')
  }

  const origSize   = file?.size ?? 0
  const webpSize   = result?.blob.size ?? 0
  const savedPct   = origSize > 0 && webpSize > 0
    ? Math.round((1 - webpSize / origSize) * 100)
    : null
  const sizeGrew   = savedPct !== null && savedPct < 0
  const savedBytes = origSize - webpSize

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Convert JPG & PNG to WebP Free — Image Optimizer"
        description="Convert JPEG and PNG images to WebP and reduce file sizes by up to 80%. Runs 100% in your browser — no upload, no account, free forever."
        appName="Free Image to WebP Converter"
        appDescription="A free, private image converter that converts JPG and PNG to WebP format entirely in your browser. No uploads, no server, adjustable quality slider."
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
          Image to WebP
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Convert JPG &amp; PNG to WebP for faster websites — runs entirely in your browser, zero uploads.
        </p>
      </motion.div>

      {/* ── Tool ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ── IDLE ──────────────────────────────────────────────── */}
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
                <FileImage aria-hidden="true" className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to convert' : 'Drop your image here'}
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

        {/* ── LOADING ─────────────────────────────────────────────── */}
        {phase === 'loading' && (
          <motion.div key="loading" {...fadeUp}>
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-16 flex flex-col items-center gap-5">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap aria-hidden="true" size={44} className="text-brand" />
              </motion.div>
              <p className="text-lg font-extrabold text-gray-800">Converting to WebP…</p>
              <p className="text-sm text-gray-400 font-medium">Running on-device. Nothing leaves your browser.</p>
            </div>
          </motion.div>
        )}

        {/* ── DONE ─────────────────────────────────────────────────── */}
        {phase === 'done' && (
          <motion.div key="done" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* ── Main panel ─────────────────────────────────────── */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 sm:p-8 flex flex-col gap-6">

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
                </div>

                {/* Before / After */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Before</p>
                    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50/80 h-48 flex items-center justify-center">
                      {origUrl && (
                        <img
                          src={origUrl}
                          alt="Original uploaded image before WebP conversion — shown in the online image converter tool"
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
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
                              <Zap aria-hidden="true" size={22} className="text-brand" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {result?.url && (
                        <img
                          src={result.url}
                          alt="Converted WebP image output from the online secure file conversion tool, with reduced file size"
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      )}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">WebP</p>
                        <p className="text-2xl font-black text-gray-800 mt-0.5 tabular-nums">
                          {result ? formatBytes(webpSize) : '—'}
                        </p>
                      </div>

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

                {/* Savings callout */}
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

                {/* Quality slider */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold text-gray-700">Quality</p>
                    <span className="text-sm font-black text-brand tabular-nums">{quality}%</span>
                  </div>
                  <div className="relative py-1">
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

              </div>

              {/* ── Sidebar: download ────────────────────────────── */}
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  onClick={handleDownload}
                  disabled={!result || converting}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-2xl shadow-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download aria-hidden="true" size={20} strokeWidth={2.5} />
                  Download WebP
                  {result && !converting && (
                    <span className="text-sm font-semibold text-white/60 ml-1">
                      · {formatBytes(webpSize)}
                    </span>
                  )}
                </motion.button>

                <button
                  onClick={handleReset}
                  className="text-xs text-gray-300 hover:text-gray-500 font-semibold underline underline-offset-2 transition-colors text-center"
                >
                  Start over
                </button>
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
        aria-label="Free Image to WebP Converter — complete guide"
      >

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free Image to WebP Converter — Improve Your Website's SEO Score
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based image converter transforms any JPEG or PNG into a WebP file
          instantly — with no upload, no account, and an adjustable quality slider. Your files never
          leave your device.
        </p>

        <div className="space-y-16">

          {/* ── How to Convert Images to WebP ────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <FileImage aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Convert Images to WebP in 3 Steps
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

          {/* ── Why WebP Images Improve SEO ───────────────────── */}
          <section aria-labelledby="why-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Globe aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 id="why-heading" className="text-xl font-black text-gray-900">
                Why WebP Images Improve Your Site's SEO Score
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Images are the single largest contributor to page weight on most websites. A typical
                  JPEG photograph saved at web quality hovers around 200–500 KB. The same image
                  converted to <strong className="text-gray-800">WebP — Google's open-source image format</strong> — comes
                  in at 30–50% less, often with no perceptible difference to the human eye. For PNG
                  graphics with transparency, the savings can reach 80%.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Those file-size reductions translate directly into better <strong className="text-gray-800">Core Web Vitals</strong>,
                  specifically Largest Contentful Paint (LCP) — the metric that measures how quickly
                  the main content of a page loads. LCP is a confirmed Google ranking signal. Pages
                  that load their hero images faster rank higher, get lower bounce rates, and convert
                  better. Converting your images to WebP is one of the highest-return technical SEO
                  improvements available with almost zero engineering effort.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Toolyy's <strong className="text-gray-800">secure file conversion</strong> happens entirely inside your
                  browser using the HTML5 Canvas API — a built-in browser feature that's been
                  available since 2013. There is no upload, no third-party processing, and no latency
                  from round-tripping your image to a remote server. Even a 10 MB PNG converts in
                  under a second on any modern laptop or smartphone.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  As of 2023, WebP has <strong className="text-gray-800">universal browser support</strong> — Chrome, Firefox,
                  Safari (since iOS 14), Edge, and Opera all render WebP natively. If you still need
                  to support older browsers, you can use the HTML <code className="bg-gray-100 text-gray-700 rounded px-1 text-xs">&lt;picture&gt;</code> element to
                  serve WebP to modern browsers and fall back to JPEG for everything else.
                </p>
              </div>

              <aside
                aria-label="WebP conversion highlights"
                className="mt-8 lg:mt-0 lg:w-52 flex-shrink-0 flex flex-col gap-3"
              >
                {[
                  {
                    Icon: Zap,
                    bg: 'bg-amber-50/70',
                    color: 'text-amber-500',
                    label: 'Up to 80% Smaller',
                    desc: 'WebP outperforms JPEG and PNG at equivalent visual quality every time.',
                  },
                  {
                    Icon: Globe,
                    bg: 'bg-emerald-50/70',
                    color: 'text-emerald-500',
                    label: 'Better Core Web Vitals',
                    desc: 'Faster LCP directly improves your Google ranking signals.',
                  },
                  {
                    Icon: ShieldCheck,
                    bg: 'bg-blue-50/70',
                    color: 'text-blue-500',
                    label: 'No Upload Required',
                    desc: 'Conversion runs in your browser — your image never leaves your device.',
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
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <FileImage aria-hidden="true" className="w-4 h-4 text-indigo-500" />
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
