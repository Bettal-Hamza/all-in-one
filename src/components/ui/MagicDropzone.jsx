import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, FileImage, Film, Music, Archive, Braces, Folder, Check } from 'lucide-react'
import { TOOLS } from '../../constants/tools.js'

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getFileIcon(file) {
  if (!file) return Folder
  if (file.type === 'application/pdf') return FileText
  if (file.type.startsWith('image/')) return FileImage
  if (file.type.startsWith('video/')) return Film
  if (file.type.startsWith('audio/')) return Music
  if (file.type.includes('zip') || file.type.includes('rar')) return Archive
  if (file.type.includes('json') || file.type.includes('xml')) return Braces
  return Folder
}

function detectTool(file) {
  if (!file) return null
  if (file.type === 'application/pdf') return TOOLS.find(t => t.id === 'pdf-splitter') ?? null
  if (file.type === 'application/json' || file.name?.endsWith('.json')) return TOOLS.find(t => t.id === 'json-formatter') ?? null
  if (file.type.startsWith('image/')) return TOOLS.find(t => t.id === 'image-converter') ?? null
  return null
}

// inputRef is forwarded from the parent so the hero "Browse Files" button can trigger the input
export default function MagicDropzone({ inputRef: externalInputRef }) {
  const [isDragging, setIsDragging]     = useState(false)
  const [dropped, setDropped]           = useState(null)   // { file, tool }
  const internalRef                     = useRef(null)
  const inputRef                        = externalInputRef ?? internalRef

  function handleFile(file) {
    if (!file) return
    setDropped({ file, tool: detectTool(file) })
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer?.files?.[0] ?? null)
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0] ?? null)
    e.target.value = ''
  }

  function reset() {
    setDropped(null)
  }

  const isIdle    = !dropped && !isDragging
  const isResult  = Boolean(dropped)

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      className={`
        relative rounded-3xl border-2 overflow-hidden
        bg-white/70 backdrop-blur-xl
        transition-all duration-300
        ${isDragging
          ? 'border-brand shadow-glow scale-[1.01]'
          : isResult
            ? 'border-white/60 shadow-glass-lg'
            : 'border-dashed border-gray-200 shadow-glass hover:border-brand/30 hover:shadow-glass-lg cursor-pointer'
        }
      `}
      onClick={!isResult ? () => inputRef.current?.click() : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="sr-only"
        aria-label="Drop any file"
      />

      <AnimatePresence mode="wait">

        {/* ── Idle / Dragging state ──────────────────────────── */}
        {!isResult && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center"
          >
            {/* Drag-over glow backdrop */}
            {isDragging && (
              <div className="absolute inset-0 bg-brand/[0.04] pointer-events-none rounded-3xl" />
            )}

            <motion.div
              animate={{
                scale:  isDragging ? 1.18 : 1,
                rotate: isDragging ? -8 : 0,
                y:      isDragging ? -6 : 0,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="mb-5"
            >
              <UploadCloud aria-hidden="true" className={`w-16 h-16 ${isDragging ? 'text-brand' : 'text-indigo-500'}`} />
            </motion.div>

            <p className="text-xl font-extrabold text-gray-800 mb-1.5">
              {isDragging ? 'Release to detect' : 'Drop any file to start'}
            </p>
            <p className="text-sm text-gray-400 font-medium mb-6">
              PDF, JPG, PNG, WebP, MP4 and more
            </p>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand text-white text-sm font-bold shadow-md pointer-events-none">
              Browse files
            </span>

            {/* Decorative format pills */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-6">
              {['PDF', 'JPG', 'PNG', 'MP4', 'JSON'].map(f => (
                <span key={f} className="text-[10px] font-bold text-gray-300 bg-gray-100 px-2.5 py-1 rounded-full tracking-wide">
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── File-dropped / Results state ──────────────────── */}
        {isResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* File info card */}
            <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl px-4 py-3 border border-gray-100">
              {(() => { const Icon = getFileIcon(dropped.file); return <Icon aria-hidden="true" className="w-6 h-6 flex-shrink-0 text-gray-400" /> })()}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-gray-900 truncate">{dropped.file.name}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {formatBytes(dropped.file.size)}
                  {dropped.file.type ? ` · ${dropped.file.type.split('/')[1]?.toUpperCase()}` : ''}
                </p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <Check aria-hidden="true" className="w-3 h-3" />
                Ready
              </span>
            </div>

            {/* Detected tool CTA or fallback */}
            {dropped.tool ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-400 font-semibold text-center">
                  Detected → {dropped.tool.label}
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={dropped.tool.path}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-brand hover:bg-brand-light text-white font-extrabold rounded-2xl text-sm transition-colors shadow-md"
                  >
                    Open {dropped.tool.label} →
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm font-bold text-gray-400">Format detected!</p>
                <p className="text-xs text-gray-300 mt-1">More tools for this type are coming soon.</p>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={reset}
              className="text-xs text-gray-300 hover:text-gray-500 font-semibold underline underline-offset-2 transition-colors text-center"
            >
              Drop another file
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
