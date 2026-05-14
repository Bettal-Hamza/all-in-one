import { Link } from 'react-router-dom'
import { Scissors, QrCode, FileImage, Wand2 } from 'lucide-react'

const BENTO_TOOLS = [
  {
    id: 'pdf-splitter',
    label: 'PDF Splitter',
    description: 'Split any multi-page PDF into individual pages instantly — no server needed.',
    Icon: Scissors,
    accent: '#EF4444',
    accentBg: '#FEF2F2',
    path: '/tools/pdf-splitter',
    live: true,
  },
  {
    id: 'qr-generator',
    label: 'QR Generator',
    description: 'Generate scannable QR codes from any URL or text, ready to download.',
    Icon: QrCode,
    accent: '#10B981',
    accentBg: '#ECFDF5',
    path: '/tools/qr-generator',
    live: true,
  },
  {
    id: 'image-converter',
    label: 'Image to WebP',
    description: 'Convert JPG and PNG to WebP for faster, leaner websites.',
    Icon: FileImage,
    accent: '#F59E0B',
    accentBg: '#FFFBEB',
    path: '/tools/image-converter',
    live: true,
  },
  {
    id: 'background-remover',
    label: 'Background Remover',
    description: 'Remove any image background instantly with on-device AI — no uploads.',
    Icon: Wand2,
    accent: '#8B5CF6',
    accentBg: '#F5F3FF',
    path: '/tools/background-remover',
    live: true,
  },
]

function BentoCard({ tool }) {
  const { Icon, label, description, accent, accentBg, path, live } = tool

  const card = (
    <div
      className={`
        relative bg-white border border-gray-100 rounded-2xl p-6 h-full
        transition-all duration-300
        hover:scale-105 hover:shadow-glass-lg hover:border-gray-200
        ${live ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Icon badge */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: accentBg }}
      >
        <Icon className="w-7 h-7" style={{ color: accent }} />
      </div>

      {/* Label + badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-extrabold text-gray-900 text-sm leading-tight">{label}</h3>
        {live ? (
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Live
          </span>
        ) : (
          <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Soon
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: accent }}
      />
    </div>
  )

  if (!live) return <div className="h-full group">{card}</div>
  return (
    <Link to={path} className="block h-full group">
      {card}
    </Link>
  )
}

export default function BentoGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-extrabold tracking-widest uppercase text-gray-300">
          All Tools
        </p>
        <p className="text-xs text-gray-300 font-medium">
          {BENTO_TOOLS.filter(t => t.live).length} live &middot; {BENTO_TOOLS.filter(t => !t.live).length} coming soon
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BENTO_TOOLS.map(tool => (
          <BentoCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}
