import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Music, Upload, Download, RotateCcw, ChevronDown,
  ShieldCheck, Gauge, LayoutGrid, FileAudio, Loader2,
  AlertCircle, CheckCircle2, Zap,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import FAQSchema from '../FAQSchema.jsx'
import SEOManager from '../SEOManager.jsx'
import HowToSchema from '../HowToSchema.jsx'

const ACCEPT = 'video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.webm,.mov,.avi,.mkv'

const QUALITY_OPTIONS = [
  { id: '128', label: '128 kbps', description: 'Smaller file, good quality', kbps: '128k' },
  { id: '192', label: '192 kbps', description: 'Balanced', kbps: '192k' },
  { id: '256', label: '256 kbps', description: 'High quality', kbps: '256k' },
  { id: '320', label: '320 kbps', description: 'Maximum quality', kbps: '320k' },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

// ─── SEO CONTENT ────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: Upload,
    title: 'Upload your video',
    body: 'Drag and drop any MP4, WebM, MOV, AVI, or MKV file onto the upload area, or click to browse. Any file size is supported — processing happens locally on your device.',
  },
  {
    Icon: Music,
    title: 'Choose audio quality',
    body: 'Select your preferred bitrate: 128 kbps for compact files, up to 320 kbps for studio-quality audio. Higher bitrates produce larger files with richer sound.',
  },
  {
    Icon: Gauge,
    title: 'Wait for conversion',
    body: 'The tool extracts the audio track and converts it to MP3 format using FFmpeg running directly in your browser. A progress bar shows real-time status.',
  },
  {
    Icon: Download,
    title: 'Download your MP3',
    body: 'Once conversion completes, click the download button to save your MP3 file. The original video is never uploaded anywhere — everything stays on your device.',
  },
]

const FAQS = [
  {
    q: 'Is my video data safe when using this converter?',
    a: 'Yes — Toolyy\'s MP4 to MP3 converter processes your video entirely in your browser using FFmpeg compiled to WebAssembly. Your file is never uploaded to any server. No one can see, access, or store your video. The moment you close the tab, the data is gone.',
  },
  {
    q: 'What video formats are supported?',
    a: 'The tool supports MP4, WebM, MOV, AVI, and MKV container formats. Most common video codecs (H.264, H.265, VP8, VP9, AV1) are supported. The audio track is extracted regardless of the video codec used.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'There is no hard limit, but processing happens in your browser\'s memory. Most devices handle files up to 500 MB–1 GB comfortably. For very large files (2 GB+), you may need a device with sufficient RAM. The tool will notify you if it runs out of memory.',
  },
  {
    q: 'Which audio quality should I choose?',
    a: '128 kbps is suitable for spoken-word content like podcasts and lectures. 192 kbps offers a good balance for music listening. 256–320 kbps is ideal for high-fidelity music where quality matters most. Higher bitrates produce proportionally larger files.',
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

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  return (bytes / 1073741824).toFixed(2) + ' GB'
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Mp4ToMp3() {
  const [phase, setPhase]           = useState('idle')
  const [file, setFile]             = useState(null)
  const [fileName, setFileName]     = useState('')
  const [fileSize, setFileSize]     = useState(0)
  const [duration, setDuration]     = useState(0)
  const [quality, setQuality]       = useState('192')
  const [progress, setProgress]     = useState(0)
  const [statusMsg, setStatusMsg]   = useState('')
  const [error, setError]           = useState(null)
  const [resultUrl, setResultUrl]   = useState(null)
  const [resultSize, setResultSize] = useState(0)
  const [isDragOver, setIsDragOver]  = useState(false)

  const inputRef  = useRef(null)
  const ffmpegRef = useRef(null)

  useEffect(() => { recordVisit('mp4-to-mp3') }, [])

  useEffect(() => {
    return () => { if (resultUrl) URL.revokeObjectURL(resultUrl) }
  }, [resultUrl])

  function handleFile(f) {
    if (!f) return
    setFile(f)
    setFileName(f.name)
    setFileSize(f.size)
    setError(null)

    const video = document.createElement('video')
    video.preload = 'metadata'
    const url = URL.createObjectURL(f)
    video.onloadedmetadata = () => {
      setDuration(video.duration || 0)
      URL.revokeObjectURL(url)
      setPhase('ready')
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      setPhase('ready')
    }
    video.src = url
  }

  async function handleConvert() {
    if (!file) return
    setPhase('converting')
    setProgress(0)
    setError(null)
    setStatusMsg('Loading FFmpeg engine...')

    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util')

      if (!ffmpegRef.current) {
        const ffmpeg = new FFmpeg()

        ffmpeg.on('log', ({ message }) => {
          const timeMatch = message.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/)
          if (timeMatch && duration > 0) {
            const t = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3])
            setProgress(Math.min(Math.round((t / duration) * 100), 99))
          }
        })

        setStatusMsg('Downloading FFmpeg core (~32 MB, cached after first use)...')

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })

        ffmpegRef.current = ffmpeg
      }

      const ffmpeg = ffmpegRef.current
      const selectedQuality = QUALITY_OPTIONS.find(q => q.id === quality)

      setStatusMsg('Reading video file...')
      await ffmpeg.writeFile('input', await fetchFile(file))

      setStatusMsg('Extracting & converting audio...')
      await ffmpeg.exec([
        '-i', 'input',
        '-vn',
        '-acodec', 'libmp3lame',
        '-b:a', selectedQuality.kbps,
        '-y',
        'output.mp3',
      ])

      const data = await ffmpeg.readFile('output.mp3')
      const blob = new Blob([data.buffer], { type: 'audio/mpeg' })

      if (resultUrl) URL.revokeObjectURL(resultUrl)
      const url = URL.createObjectURL(blob)

      setResultUrl(url)
      setResultSize(blob.size)
      setProgress(100)
      setPhase('done')

      await ffmpeg.deleteFile('input')
      await ffmpeg.deleteFile('output.mp3')
    } catch (err) {
      console.error('FFmpeg error:', err)
      setError(err.message || 'Conversion failed. The video format may not be supported.')
      setPhase('ready')
    }
  }

  function handleDownload() {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = fileName.replace(/\.[^.]+$/, '') + '.mp3'
    a.click()
  }

  function handleReset() {
    setPhase('idle')
    setFile(null)
    setFileName('')
    setFileSize(0)
    setDuration(0)
    setProgress(0)
    setStatusMsg('')
    setError(null)
    if (resultUrl) { URL.revokeObjectURL(resultUrl); setResultUrl(null) }
    setResultSize(0)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Convert MP4 to MP3 Audio Online | High-Quality Audio Extractor"
        description="Extract crystal clear MP3 audio files from any MP4 video natively in your browser. Fast conversion speeds with zero file-size limitations or data tracking."
        appName="MP4 to MP3 Audio Extractor"
        appDescription="Extract high-quality MP3 audio from MP4, MOV, and WebM video files entirely in your browser. No uploads, no file-size limits, no data tracking."
      />
      <HowToSchema
        name="How to Convert MP4 to MP3 Free Online"
        description="Extract high-quality MP3 audio from any video file directly in your browser using Toolyy."
        steps={[
          'Go to toolyy.net and select the MP4 to MP3 converter.',
          'Drag and drop your video file (MP4, WebM, MOV, AVI, or MKV) into the workspace.',
          'Choose your preferred audio quality bitrate and wait for conversion to complete.',
          'Download your extracted MP3 audio file.',
        ]}
        totalTime="PT2M"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page title ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Audio &amp; Video</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          MP4 to MP3
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Extract audio from any video — entirely in your browser.
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
                <Music aria-hidden="true" className={`w-20 h-20 mx-auto transition-colors duration-300 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
              </motion.div>
              <p className="text-2xl font-extrabold text-gray-800 mb-2">
                {isDragOver ? 'Release to convert' : 'Drop your video here'}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                or click to browse · MP4, WebM, MOV, AVI, MKV · processed locally
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
                className="sr-only"
                aria-label="Video file upload"
              />
            </div>
          </motion.div>
        )}

        {(phase === 'ready' || phase === 'converting' || phase === 'done') && (
          <motion.div key="processing" {...fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Main area */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 flex flex-col gap-5">
                {/* File info header */}
                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-4">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-brand mb-1">
                      {phase === 'done' ? 'Conversion Complete' : phase === 'converting' ? 'Converting...' : 'Ready to Convert'}
                    </p>
                    <h2 className="text-xl font-black text-gray-900 truncate">{fileName}</h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {formatFileSize(fileSize)}
                      {duration > 0 && ` · ${formatDuration(duration)}`}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-600 font-semibold underline underline-offset-2 transition-colors"
                    disabled={phase === 'converting'}
                  >
                    <RotateCcw aria-hidden="true" className="w-3 h-3" />
                    Start over
                  </button>
                </div>

                {/* Progress / Result */}
                {phase === 'converting' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Loader2 aria-hidden="true" className="w-5 h-5 text-brand animate-spin flex-shrink-0" />
                      <p className="text-sm text-gray-600 font-medium">{statusMsg}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="h-full bg-brand rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium text-right">{progress}%</p>
                  </div>
                )}

                {phase === 'done' && resultUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-emerald-50/70 rounded-2xl p-4">
                      <CheckCircle2 aria-hidden="true" className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Audio extracted successfully</p>
                        <p className="text-xs text-emerald-600/70 font-medium">
                          MP3 · {QUALITY_OPTIONS.find(q => q.id === quality)?.label} · {formatFileSize(resultSize)}
                        </p>
                      </div>
                    </div>

                    {/* Audio preview */}
                    <audio controls src={resultUrl} className="w-full rounded-xl" />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDownload}
                      className="w-full py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Download aria-hidden="true" className="w-5 h-5" />
                      Download MP3
                    </motion.button>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 bg-red-50/70 rounded-2xl p-4">
                    <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Conversion failed</p>
                      <p className="text-xs text-red-600/70 font-medium mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {phase === 'ready' && !error && (
                  <div className="bg-gray-50/50 rounded-2xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <FileAudio aria-hidden="true" className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-medium">
                        Select quality and click Convert
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                {/* Quality selector */}
                <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                    Audio Quality
                  </p>
                  <div className="space-y-2">
                    {QUALITY_OPTIONS.map((q) => {
                      const active = q.id === quality
                      return (
                        <button
                          key={q.id}
                          onClick={() => setQuality(q.id)}
                          disabled={phase === 'converting'}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200
                            ${active
                              ? 'bg-brand text-white shadow-md'
                              : 'bg-gray-50/80 text-gray-700 hover:bg-gray-100 border border-gray-100'}
                            ${phase === 'converting' ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-extrabold ${active ? 'text-white' : 'text-gray-800'}`}>
                              {q.label}
                            </p>
                            <p className={`text-[10px] font-medium ${active ? 'text-white/60' : 'text-gray-400'}`}>
                              {q.description}
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

                {/* Convert / Download button */}
                {phase === 'ready' && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleConvert}
                    className="w-full py-4 bg-brand hover:bg-brand-light text-white font-extrabold text-lg rounded-3xl shadow-lg transition-colors"
                  >
                    Convert to MP3
                  </motion.button>
                )}

                {phase === 'converting' && (
                  <div className="w-full py-4 bg-gray-200 text-gray-400 font-extrabold text-lg rounded-3xl text-center cursor-not-allowed">
                    Converting...
                  </div>
                )}
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
        aria-label="Free MP4 to MP3 Converter — complete guide"
      >
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free MP4 to MP3 Converter
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based MP4 to MP3 converter extracts audio from any video file
          and converts it to high-quality MP3 — instantly, privately, and at no cost. No account
          needed, no watermarks, and your files never leave your device.
        </p>

        <div className="space-y-16">

          {/* ── How to Convert ──────────────────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Convert MP4 to MP3
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

          {/* ── Privacy ──────────────────────────────────────── */}
          <section aria-labelledby="privacy-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-red-500" />
              </div>
              <h2 id="privacy-heading" className="text-xl font-black text-gray-900">
                Privacy First: Your Videos Never Leave Your Device
              </h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Most online video converters require you to upload your files to remote servers.
                That means personal videos, copyrighted content, and private recordings travel
                across the internet before you get the result.
                Toolyy's <strong className="text-gray-800">MP4 to MP3 converter</strong> works
                completely differently.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                The entire conversion happens <strong className="text-gray-800">directly in your
                browser</strong> using FFmpeg compiled to WebAssembly. Your video file stays on
                your device the entire time. There is nothing to intercept, nothing stored on any
                server, and nothing accessible to anyone but you.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The FFmpeg WebAssembly core is downloaded once (~32 MB) and cached by your browser
                for future use. After the initial load, conversions start instantly with no
                network activity required.
              </p>
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
                  How can I extract audio from a video without installing software?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Open Toolyy.net and select the MP4 to MP3 converter. Drop your video file into
                  the workspace — MP4, WebM, MOV, AVI, and MKV are all supported. The tool uses
                  FFmpeg compiled to WebAssembly, running entirely in your browser. Choose your
                  bitrate (128–320 kbps) and download the MP3 when conversion completes.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                  What is the safest way to convert MP4 to MP3 with private content?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use a client-side converter like Toolyy that processes your video entirely in
                  your browser. Unlike server-based tools, your video file never leaves your
                  device — nothing is uploaded, stored, or accessible to anyone but you. This
                  makes it safe for personal recordings, lectures, and copyrighted material.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">
                  Can I convert video to MP3 on my phone?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Yes — Toolyy's MP4 to MP3 converter works on any modern mobile browser. Open
                  the page, tap to upload your video from your device or cloud storage, select
                  your preferred audio quality, and download the extracted MP3. No app needed.
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
                Toolyy vs Other Video Converters
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-glass overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-extrabold text-gray-900 px-6 py-4">Feature</th>
                    <th className="text-left font-extrabold text-brand px-6 py-4">Toolyy</th>
                    <th className="text-left font-extrabold text-gray-400 px-6 py-4">Typical Online Converters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Video uploaded to server</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">No — 100% local</td>
                    <td className="px-6 py-3 text-gray-400">Yes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Account required</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">No</td>
                    <td className="px-6 py-3 text-gray-400">Usually</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Supported formats</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">MP4, WebM, MOV, AVI, MKV</td>
                    <td className="px-6 py-3 text-gray-400">Usually just MP4</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Quality selection</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">128, 192, 256, 320 kbps</td>
                    <td className="px-6 py-3 text-gray-400">Fixed quality</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">File size limit</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">None (device RAM only)</td>
                    <td className="px-6 py-3 text-gray-400">50–200 MB</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-medium text-gray-700">Cost</td>
                    <td className="px-6 py-3 text-emerald-600 font-bold">Free — no limits</td>
                    <td className="px-6 py-3 text-gray-400">Free trial, then paid</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Music aria-hidden="true" className="w-4 h-4 text-emerald-500" />
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
