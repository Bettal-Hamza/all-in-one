import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Scissors, FileImage, Wand2, QrCode,
  Music, Braces, Share2, Ruler,
} from 'lucide-react'

const CATALOG = [
  {
    id: 'pdf-splitter',
    Icon: Scissors,
    label: 'PDF Splitter',
    category: 'PDF',
    accent: '#EF4444',
    accentBg: '#FEF2F2',
    path: '/tools/pdf-splitter',
    live: true,
    description:
      'Our PDF Splitter lets you extract individual pages from any multi-page document without losing metadata quality, bookmarks, or embedded fonts. The entire operation runs inside your browser — no upload required, and no file size ceiling beyond your device\'s available memory.',
  },
  {
    id: 'image-converter',
    Icon: FileImage,
    label: 'Image to WebP',
    category: 'Image',
    accent: '#F59E0B',
    accentBg: '#FFFBEB',
    path: '/tools/image-converter',
    live: true,
    description:
      'Our Image to WebP converter compresses JPG and PNG files into the modern WebP format, reducing payload by up to 80 % with no perceptible quality loss — a critical optimisation for page-speed scores. Secure file conversion happens entirely client-side, keeping confidential product photos or proprietary assets private.',
  },
  {
    id: 'background-remover',
    Icon: Wand2,
    label: 'Background Remover',
    category: 'Image',
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
    path: '/tools/background-remover',
    live: true,
    description:
      'Our Background Remover uses an on-device AI model to isolate subjects and erase backgrounds in seconds, producing a transparent PNG without uploading your photo to any server. Privacy-focused by design, the neural network inference runs locally via WebAssembly — your original image never leaves your machine.',
  },
  {
    id: 'qr-generator',
    Icon: QrCode,
    label: 'QR Generator',
    category: 'Utility',
    accent: '#10B981',
    accentBg: '#ECFDF5',
    path: '/tools/qr-generator',
    live: true,
    description:
      'Our QR Generator creates clean, scannable QR codes from any URL, plain text, phone number, or Wi-Fi credentials in a single click, with adjustable error-correction levels. No upload required: the output renders directly in your browser and can be saved as a high-resolution PNG.',
  },
  {
    id: 'mp4-to-mp3',
    Icon: Music,
    label: 'MP4 to MP3',
    category: 'Audio',
    accent: '#EC4899',
    accentBg: '#FDF2F8',
    path: '/tools/mp4-to-mp3',
    live: true,
    description:
      'Our MP4 to MP3 converter will extract the audio track from any MP4, MOV, or WebM file and save it as a standard MP3 — without uploading your video to any server. Useful for pulling podcast recordings, lecture audio, or music from locally saved video files.',
  },
  {
    id: 'json-formatter',
    Icon: Braces,
    label: 'JSON Formatter',
    category: 'Developer',
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
    path: '/tools/json-formatter',
    live: true,
    description:
      'Our JSON Formatter will beautify, validate, and minify any raw or malformed JSON payload with syntax highlighting and line-level error reporting. No upload required — all formatting runs in your browser, keeping API tokens or private response bodies in your hands only.',
  },
  {
    id: 'social-resizer',
    Icon: Share2,
    label: 'Social Resizer',
    category: 'Design',
    accent: '#3B82F6',
    accentBg: '#EFF6FF',
    path: '/tools/social-resizer',
    live: true,
    description:
      'Our Social Image Resizer will resize a single source image to perfect pixel dimensions for every major platform — Instagram, X, LinkedIn, Facebook, and more — in one step. Secure file conversion happens via the Canvas API with zero cloud processing involved.',
  },
  {
    id: 'unit-converter',
    Icon: Ruler,
    label: 'Unit Converter',
    category: 'Utility',
    accent: '#0EA5E9',
    accentBg: '#F0F9FF',
    path: '/tools/unit-converter',
    live: true,
    description:
      'Our Unit Converter will instantly translate values across length, weight, temperature, volume, speed, data, and dozens of other categories as you type, with no round-trip to a server. Privacy-focused and offline-capable, it works in full once the page has loaded.',
  },
]

function CatalogCard({ tool, index }) {
  const { Icon, label, category, accent, accentBg, path, live, description } = tool

  const inner = (
    <div
      className={`
        relative h-full bg-white border border-gray-100 rounded-2xl p-6
        transition-all duration-300 group
        ${live
          ? 'hover:shadow-glass-lg hover:border-gray-200 hover:-translate-y-0.5'
          : 'opacity-70'
        }
      `}
    >
      {/* Live / Soon badge */}
      <span
        className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          live
            ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
            : 'text-gray-400 bg-gray-100 border-gray-200'
        }`}
      >
        {live ? 'Live' : 'Soon'}
      </span>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: accentBg }}
      >
        <Icon aria-hidden="true" className="w-5 h-5" style={{ color: accent }} />
      </div>

      {/* Category label */}
      <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: accent }}>
        {category}
      </p>

      {/* Tool name */}
      <h3 className="font-extrabold text-gray-900 text-base mb-3 leading-tight">{label}</h3>

      {/* 2-sentence description */}
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>

      {/* Bottom accent bar on hover */}
      {live && (
        <div
          className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: accent }}
        />
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="h-full"
    >
      {live && path
        ? <Link to={path} className="block h-full">{inner}</Link>
        : inner
      }
    </motion.div>
  )
}

export default function ToolCatalog() {
  return (
    <section
      aria-labelledby="catalog-heading"
      className="bg-gray-50/60 border-t border-b border-gray-100 py-20"
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10"
        >
          <p className="text-xs font-black uppercase tracking-widest text-brand mb-3">
            Detailed Tool Catalog
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2
              id="catalog-heading"
              className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900"
            >
              Every tool, explained.
            </h2>
            <p className="text-sm text-gray-400 font-medium sm:text-right max-w-xs">
              {CATALOG.filter(t => t.live).length} live today &middot;{' '}
              {CATALOG.filter(t => !t.live).length} launching soon
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATALOG.map((tool, i) => (
            <CatalogCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
