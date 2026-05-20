import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, Download, Share2, Square, Smartphone, Monitor,
  ChevronDown, ShieldCheck, Gauge, LayoutGrid, FileType,
  ImageIcon, Move, RotateCcw, ZoomIn, ZoomOut, Crop,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import FAQSchema from '../FAQSchema.jsx'
import SEOManager from '../SEOManager.jsx'

const ACCEPT = 'image/jpeg,image/png,image/webp'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

const PRESETS = [
  { id: 'ig-post',   label: 'Instagram Post',    platform: 'Instagram',  ratio: 1,        w: 1080, h: 1080, Icon: Square },
  { id: 'tiktok',    label: 'TikTok / IG Story',  platform: 'TikTok',     ratio: 9 / 16,   w: 1080, h: 1920, Icon: Smartphone },
  { id: 'yt-thumb',  label: 'YouTube Thumbnail',  platform: 'YouTube',    ratio: 16 / 9,   w: 1280, h: 720,  Icon: Monitor },
  { id: 'free',      label: 'Custom Size',        platform: 'Custom',     ratio: null,     w: null, h: null, Icon: Crop },
]

function calcCropRect(imgW, imgH, ratio) {
  let cropW, cropH
  if (imgW / imgH > ratio) {
    cropH = imgH
    cropW = imgH * ratio
  } else {
    cropW = imgW
    cropH = imgW / ratio
  }
  return {
    x: (imgW - cropW) / 2,
    y: (imgH - cropH) / 2,
    w: cropW,
    h: cropH,
  }
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function renderCanvas(canvas, img, crop) {
  const ctx = canvas.getContext('2d')
  const cw = canvas.width
  const ch = canvas.height

  const scale = Math.min(cw / img.width, ch / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = (cw - dw) / 2
  const dy = (ch - dh) / 2

  ctx.clearRect(0, 0, cw, ch)
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, cw, ch)

  ctx.drawImage(img, dx, dy, dw, dh)

  const ccx = dx + crop.x * scale
  const ccy = dy + crop.y * scale
  const ccw = crop.w * scale
  const cch = crop.h * scale

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.fillRect(dx, dy, dw, ccy - dy)
  ctx.fillRect(dx, ccy + cch, dw, dy + dh - ccy - cch)
  ctx.fillRect(dx, ccy, ccx - dx, cch)
  ctx.fillRect(ccx + ccw, ccy, dx + dw - ccx - ccw, cch)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.lineWidth = 2
  ctx.strokeRect(ccx, ccy, ccw, cch)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1
  for (let i = 1; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(ccx + (ccw * i) / 3, ccy)
    ctx.lineTo(ccx + (ccw * i) / 3, ccy + cch)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(ccx, ccy + (cch * i) / 3)
    ctx.lineTo(ccx + ccw, ccy + (cch * i) / 3)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = 'bold 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Drag to reposition', ccx + ccw / 2, ccy + cch / 2 + 4)
}

// ─── SEO CONTENT ────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: Upload,
    title: 'Upload your image',
    body: 'Drag and drop any JPG, PNG, or WebP file onto the upload area, or click to browse. Any image size and resolution is accepted — the tool adapts automatically.',
  },
  {
    Icon: Share2,
    title: 'Choose a platform preset',
    body: 'Select the platform you need: Instagram (1:1), TikTok or Instagram Stories (9:16), or YouTube Thumbnail (16:9). The crop frame adjusts to the exact required aspect ratio instantly.',
  },
  {
    Icon: Move,
    title: 'Adjust the crop position',
    body: 'Drag inside the crop area to reposition your image within the frame. The rule-of-thirds grid helps you compose the perfect shot for maximum engagement on every platform.',
  },
  {
    Icon: Download,
    title: 'Download your resized image',
    body: 'Click Download to save your cropped image at the platform\'s recommended resolution. The output is a high-quality PNG file ready to upload directly to your social media account.',
  },
]

const FAQS = [
  {
    q: 'Is my image data safe when using this Social Resizer?',
    a: 'Yes — Toolyy\'s Social Resizer processes your image entirely in your browser using the HTML5 Canvas API. Your photo is never uploaded to any server, never stored, and never seen by anyone. You can safely resize sensitive or private images without any privacy concerns.',
  },
  {
    q: 'What image formats are supported?',
    a: 'The tool accepts JPEG, PNG, and WebP images of any resolution. Output is always saved as a high-quality PNG file, which is universally supported by every social media platform. If you need JPEG output, most operating systems let you convert PNG to JPEG in their default image viewer.',
  },
  {
    q: 'Will resizing reduce my image quality?',
    a: 'No — the tool crops and exports your image at the platform\'s native recommended resolution (e.g., 1080×1080 for Instagram posts). If your original image is larger than the target size, the output is sharp and clean. If your original is smaller, some upscaling may occur, but the tool always produces the best possible quality from the source material.',
  },
  {
    q: 'Can I resize one image for multiple platforms?',
    a: 'Yes — after downloading one version, simply select a different platform preset and the crop frame will adjust to the new aspect ratio. Reposition the crop if needed, then download again. You can produce versions for Instagram, TikTok, and YouTube from the same image in seconds.',
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

export default function SocialResizer() {
  const [phase, setPhase]           = useState('idle')
  const [img, setImg]               = useState(null)
  const [fileName, setFileName]     = useState('')
  const [preset, setPreset]         = useState(PRESETS[0])
  const [crop, setCrop]             = useState(null)
  const [isDragOver, setIsDragOver]  = useState(false)
  const [resultUrl, setResultUrl]   = useState(null)
  const [cropScale, setCropScale]   = useState(1)
  const [freeW, setFreeW]           = useState(1080)
  const [freeH, setFreeH]           = useState(1080)

  const isFree = preset.id === 'free'
  const outW = isFree ? freeW : preset.w
  const outH = isFree ? freeH : preset.h
  const effectiveRatio = outW / outH

  const canvasRef   = useRef(null)
  const imgRef      = useRef(null)
  const inputRef    = useRef(null)
  const dragState   = useRef(null)

  useEffect(() => { recordVisit('social-resizer') }, [])

  useEffect(() => {
    return () => { if (resultUrl) URL.revokeObjectURL(resultUrl) }
  }, [resultUrl])

  useEffect(() => {
    if (!crop || !imgRef.current) return
    let raf
    let attempts = 0
    function tryDraw() {
      if (canvasRef.current) {
        renderCanvas(canvasRef.current, imgRef.current, crop)
      } else if (attempts < 30) {
        attempts++
        raf = requestAnimationFrame(tryDraw)
      }
    }
    tryDraw()
    return () => cancelAnimationFrame(raf)
  }, [crop])

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      imgRef.current = image
      const newCrop = calcCropRect(image.width, image.height, effectiveRatio)
      setCrop(newCrop)
      setCropScale(1)
      setPhase('editing')
      URL.revokeObjectURL(url)
    }
    image.src = url
  }

  function handlePresetChange(newPreset) {
    setPreset(newPreset)
    setCropScale(1)
    if (imgRef.current) {
      const r = newPreset.id === 'free' ? freeW / freeH : newPreset.ratio
      const newCrop = calcCropRect(imgRef.current.width, imgRef.current.height, r)
      setCrop(newCrop)
      if (resultUrl) { URL.revokeObjectURL(resultUrl); setResultUrl(null) }
    }
  }

  function handleFreeSizeChange(w, h) {
    const cw = clamp(Math.round(w) || 1, 1, 10000)
    const ch = clamp(Math.round(h) || 1, 1, 10000)
    setFreeW(cw)
    setFreeH(ch)
    setCropScale(1)
    if (imgRef.current) {
      const newCrop = calcCropRect(imgRef.current.width, imgRef.current.height, cw / ch)
      setCrop(newCrop)
      if (resultUrl) { URL.revokeObjectURL(resultUrl); setResultUrl(null) }
    }
  }

  function handleScaleChange(newScale) {
    setCropScale(newScale)
    if (!imgRef.current) return
    const maxCrop = calcCropRect(imgRef.current.width, imgRef.current.height, effectiveRatio)
    const newW = maxCrop.w * newScale
    const newH = maxCrop.h * newScale
    setCrop(prev => {
      if (!prev) return prev
      const centerX = prev.x + prev.w / 2
      const centerY = prev.y + prev.h / 2
      return {
        x: clamp(centerX - newW / 2, 0, imgRef.current.width - newW),
        y: clamp(centerY - newH / 2, 0, imgRef.current.height - newH),
        w: newW,
        h: newH,
      }
    })
    if (resultUrl) { URL.revokeObjectURL(resultUrl); setResultUrl(null) }
  }

  function getCanvasScale() {
    if (!canvasRef.current || !imgRef.current) return 1
    const canvas = canvasRef.current
    return Math.min(canvas.width / imgRef.current.width, canvas.height / imgRef.current.height)
  }

  function handlePointerDown(e) {
    if (!crop || !imgRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
      scaleX,
      scaleY,
    }
    canvasRef.current.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!dragState.current || !crop || !imgRef.current) return
    const ds = dragState.current
    const scale = getCanvasScale()
    const dx = ((e.clientX - ds.startX) * ds.scaleX) / scale
    const dy = ((e.clientY - ds.startY) * ds.scaleY) / scale
    const newX = clamp(ds.cropX + dx, 0, imgRef.current.width - crop.w)
    const newY = clamp(ds.cropY + dy, 0, imgRef.current.height - crop.h)
    setCrop(prev => ({ ...prev, x: newX, y: newY }))
  }

  function handlePointerUp() {
    dragState.current = null
  }

  async function handleExport() {
    if (!imgRef.current || !crop) return
    const offscreen = document.createElement('canvas')
    offscreen.width = outW
    offscreen.height = outH
    const ctx = offscreen.getContext('2d')
    ctx.drawImage(imgRef.current, crop.x, crop.y, crop.w, crop.h, 0, 0, outW, outH)
    const blob = await new Promise(resolve => offscreen.toBlob(resolve, 'image/png'))
    if (resultUrl) URL.revokeObjectURL(resultUrl)
    const url = URL.createObjectURL(blob)
    setResultUrl(url)

    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName.replace(/\.[^.]+$/, '')}-${preset.id}.png`
    a.click()
  }

  function handleReset() {
    imgRef.current = null
    setCrop(null)
    setCropScale(1)
    setFileName('')
    setPhase('idle')
    setPreset(PRESETS[0])
    if (resultUrl) { URL.revokeObjectURL(resultUrl); setResultUrl(null) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Social Media Image Resizer | Crop for Every Platform"
        description="Resize and crop images to pixel-perfect dimensions for Instagram, TikTok, YouTube, LinkedIn, and X. Client-side processing keeps your photos private."
        appName="Social Media Image Resizer"
        appDescription="Resize images to exact dimensions for Instagram, TikTok, YouTube, LinkedIn, and X in one step. Canvas API processing — zero cloud uploads, zero data tracking."
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page title ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Design &amp; Social</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Social Resizer
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Crop images for Instagram, TikTok &amp; YouTube — entirely in your browser.
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
                <ImageIcon aria-hidden="true" className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to crop' : 'Drop your image here'}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                or click to browse · JPG, PNG, WebP · processed locally
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
                className="sr-only"
                aria-label="Image file upload"
              />
            </div>
          </motion.div>
        )}

        {phase === 'editing' && (
          <motion.div key="editing" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Canvas area */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 pr-4">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">
                      {preset.label}
                    </p>
                    <h2 className="text-xl font-black text-gray-900 truncate">{fileName}</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {outW} × {outH}px
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-600 font-semibold underline underline-offset-2 transition-colors"
                  >
                    <RotateCcw aria-hidden="true" className="w-3 h-3" />
                    Start over
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center bg-gray-100/50 rounded-2xl overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="max-w-full h-auto cursor-move touch-none select-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  />
                </div>

              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                {/* Preset buttons */}
                <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                    Platform Preset
                  </p>
                  <div className="space-y-2">
                    {PRESETS.map((p) => {
                      const active = p.id === preset.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => handlePresetChange(p)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200
                            ${active
                              ? 'bg-brand text-white shadow-md'
                              : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100 border border-gray-100'}
                          `}
                        >
                          <p.Icon aria-hidden="true" className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white/80' : 'text-gray-400'}`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-extrabold truncate ${active ? 'text-white' : 'text-gray-800'}`}>
                              {p.label}
                            </p>
                            <p className={`text-[10px] font-medium ${active ? 'text-white/60' : 'text-gray-400'}`}>
                              {p.id === 'free' ? 'Any size' : `${p.w} × ${p.h}`}
                            </p>
                          </div>
                          {active && (
                            <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom size inputs */}
                {isFree && (
                  <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                      Output Dimensions
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 block">Width</label>
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          value={freeW}
                          onChange={(e) => handleFreeSizeChange(Number(e.target.value), freeH)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/80 text-sm font-bold text-gray-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                        />
                      </div>
                      <span className="text-gray-300 font-bold mt-4">×</span>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 mb-1 block">Height</label>
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          value={freeH}
                          onChange={(e) => handleFreeSizeChange(freeW, Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/80 text-sm font-bold text-gray-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 mt-4">px</span>
                    </div>
                  </div>
                )}

                {/* Crop zoom slider */}
                <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                    Crop Size
                  </p>
                  <div className="flex items-center gap-3">
                    <ZoomOut aria-hidden="true" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={Math.round(cropScale * 100)}
                      onChange={(e) => handleScaleChange(Number(e.target.value) / 100)}
                      className="w-full accent-brand h-1.5 rounded-full appearance-none bg-gray-200 cursor-pointer"
                    />
                    <ZoomIn aria-hidden="true" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                    {Math.round(cropScale * 100)}%
                  </p>
                </div>

                {/* Download button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleExport}
                  className="w-full py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-3xl shadow-lg transition-colors"
                >
                  Download {isFree ? `${outW}×${outH}` : preset.platform}
                </motion.button>
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
        aria-label="Free Social Media Image Resizer — complete guide"
      >
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free Social Media Image Resizer
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based Social Resizer lets you crop and resize any image to the
          exact dimensions required by Instagram, TikTok, and YouTube — instantly, privately,
          and at no cost. No account needed, no watermarks, and your photos never leave your device.
        </p>

        <div className="space-y-16">

          {/* ── How to Resize Images for Social Media ──────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Resize Images for Social Media
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
                Privacy First: Your Images Stay on Your Device
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Most online image resizers upload your photos to remote servers for processing.
                  That means personal photos, brand assets, and unreleased content travel across
                  the internet before you even see the result — creating real privacy and
                  intellectual-property concerns.
                  Toolyy's <strong className="text-gray-800">Social Resizer</strong> works
                  completely differently.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Every operation — loading, cropping, resizing, and exporting — happens
                  <strong className="text-gray-800"> directly in your browser</strong> using
                  the HTML5 Canvas API. Your image never leaves your device. There is nothing
                  to intercept, nothing stored on any server, and nothing accessible to anyone
                  but you. The moment you close the tab, the data is gone.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Because there is no upload step, cropping is effectively instant. You can
                  switch between platform presets, reposition the crop, and download multiple
                  versions in seconds — with zero wait time and no bandwidth cost. The tool
                  works fully offline once the page has loaded.
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
                      Zero uploads. Your images never leave your device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-blue-50/70 rounded-2xl p-4">
                  <Gauge aria-hidden="true" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">Instant Crop</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      No upload wait. Crop and download in under a second.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50/70 rounded-2xl p-4">
                  <FileType aria-hidden="true" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">Platform-Ready</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Pixel-perfect output at each platform's recommended resolution.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Share2 aria-hidden="true" className="w-4 h-4 text-emerald-500" />
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
