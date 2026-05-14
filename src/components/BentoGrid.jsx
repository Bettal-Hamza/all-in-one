import { Link } from 'react-router-dom'
import {
  Scissors, FileImage, Music, QrCode, Share2, Braces, Ruler,
  TrendingUp, Palette, Code2, Wand2,
} from 'lucide-react'

const BADGE_STYLES = {
  blue:   'text-blue-600 bg-blue-50 border-blue-100',
  green:  'text-emerald-600 bg-emerald-50 border-emerald-100',
  purple: 'text-purple-600 bg-purple-50 border-purple-100',
  sky:    'text-sky-600 bg-sky-50 border-sky-100',
  amber:  'text-amber-600 bg-amber-50 border-amber-100',
}

const SECTIONS = [
  {
    id: 'most-popular',
    label: 'Most Popular',
    SectionIcon: TrendingUp,
    sectionColor: '#EF4444',
    tools: [
      {
        id: 'pdf-splitter',
        label: 'PDF Splitter',
        description: 'Split any multi-page PDF into individual pages instantly — no server needed.',
        Icon: Scissors,
        accent: '#EF4444',
        accentBg: '#FEF2F2',
        path: '/tools/pdf-splitter',
        live: true,
        badge: 'Instant',
        badgeStyle: 'blue',
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
        badge: 'Instant',
        badgeStyle: 'blue',
      },
      {
        id: 'mp4-to-mp3',
        label: 'MP4 to MP3',
        description: 'Extract audio from any video file directly in your browser.',
        Icon: Music,
        accent: '#EC4899',
        accentBg: '#FDF2F8',
        path: '/tools/mp4-to-mp3',
        live: false,
        badge: 'Free',
        badgeStyle: 'green',
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
        badge: 'AI Powered',
        badgeStyle: 'purple',
      },
    ],
  },
  {
    id: 'design-social',
    label: 'Design & Social',
    SectionIcon: Palette,
    sectionColor: '#10B981',
    tools: [
      {
        id: 'qr-stylizer',
        label: 'QR Stylizer',
        description: 'Generate beautiful, branded QR codes with custom colors and logos.',
        Icon: QrCode,
        accent: '#10B981',
        accentBg: '#ECFDF5',
        path: '/tools/qr-generator',
        live: true,
        badge: 'Customizable',
        badgeStyle: 'purple',
      },
      {
        id: 'social-resizer',
        label: 'Social Resizer',
        description: 'Resize images to perfect dimensions for every social media platform.',
        Icon: Share2,
        accent: '#3B82F6',
        accentBg: '#EFF6FF',
        path: '/tools/social-resizer',
        live: false,
        badge: 'Multi-size',
        badgeStyle: 'sky',
      },
    ],
  },
  {
    id: 'developer-tools',
    label: 'Developer Tools',
    SectionIcon: Code2,
    sectionColor: '#8B5CF6',
    tools: [
      {
        id: 'json-formatter',
        label: 'JSON Formatter',
        description: 'Beautify, validate and minify JSON with syntax highlighting.',
        Icon: Braces,
        accent: '#8B5CF6',
        accentBg: '#F5F3FF',
        path: '/tools/json-formatter',
        live: false,
        badge: 'Instant',
        badgeStyle: 'blue',
      },
      {
        id: 'unit-converter',
        label: 'Unit Converter',
        description: 'Convert between any units — length, weight, temperature and more.',
        Icon: Ruler,
        accent: '#0EA5E9',
        accentBg: '#F0F9FF',
        path: '/tools/unit-converter',
        live: false,
        badge: 'Offline',
        badgeStyle: 'green',
      },
    ],
  },
]

function SectionHeader({ label, SectionIcon, color }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '18' }}
      >
        <SectionIcon className="w-4 h-4" style={{ color }} />
      </div>
      <span
        className="text-xs font-extrabold tracking-widest uppercase"
        style={{ color }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100 ml-1" />
    </div>
  )
}

function BentoCard({ tool }) {
  const { Icon, label, description, accent, accentBg, path, live, badge, badgeStyle } = tool
  const badgeClasses = BADGE_STYLES[badgeStyle] || BADGE_STYLES.blue

  const card = (
    <div
      className={`
        relative bg-white border border-gray-100 rounded-2xl p-6 h-full
        transition-all duration-300 group
        hover:scale-[1.03] hover:shadow-glass-lg hover:border-gray-200
        ${live ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Corner badge */}
      <span
        className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClasses}`}
      >
        {badge}
      </span>

      {/* Tool icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: accentBg }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>

      {/* Label + live / soon pill */}
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

      <p className="text-xs text-gray-400 leading-relaxed pr-2">{description}</p>

      {/* Bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: accent }}
      />
    </div>
  )

  if (!live) return <div className="h-full">{card}</div>
  return (
    <Link to={path} className="block h-full">
      {card}
    </Link>
  )
}

export default function BentoGrid() {
  const allTools = SECTIONS.flatMap(s => s.tools)
  const liveCount = allTools.filter(t => t.live).length
  const soonCount = allTools.filter(t => !t.live).length

  return (
    <section className="max-w-6xl mx-auto px-4 pb-24 space-y-10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold tracking-widest uppercase text-gray-300">
          All Tools
        </p>
        <p className="text-xs text-gray-300 font-medium">
          {liveCount} live &middot; {soonCount} coming soon
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.id}>
          <SectionHeader
            label={section.label}
            SectionIcon={section.SectionIcon}
            color={section.sectionColor}
          />
          <div
            className={`grid grid-cols-1 gap-4 ${
              section.tools.length >= 4
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : section.tools.length === 3
                ? 'sm:grid-cols-3'
                : 'sm:grid-cols-2'
            }`}
          >
            {section.tools.map(tool => (
              <BentoCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
