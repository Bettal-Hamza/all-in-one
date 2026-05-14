const FORMATS = [
  { label: 'PDF',  emoji: '📄' },
  { label: 'JPG',  emoji: '🖼️' },
  { label: 'PNG',  emoji: '🖼️' },
  { label: 'WebP', emoji: '⚡' },
  { label: 'MP4',  emoji: '🎬' },
  { label: 'GIF',  emoji: '🎞️' },
  { label: 'MP3',  emoji: '🎵' },
  { label: 'SVG',  emoji: '✏️' },
  { label: 'JSON', emoji: '{ }' },
  { label: 'CSV',  emoji: '📊' },
  { label: 'ZIP',  emoji: '📦' },
  { label: 'DOCX', emoji: '📝' },
  { label: 'XLSX', emoji: '📈' },
  { label: 'PPTX', emoji: '📋' },
]

// Duplicate for seamless infinite loop
const ITEMS = [...FORMATS, ...FORMATS]

export default function TrustBar() {
  return (
    <div className="w-full overflow-hidden border-y border-gray-100/80 bg-white/40 backdrop-blur-sm py-3">
      {/* Screen-reader context */}
      <p className="sr-only">Supported file formats: {FORMATS.map(f => f.label).join(', ')}</p>

      <div className="flex animate-trust-scroll gap-0 w-max" aria-hidden="true">
        {ITEMS.map((f, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 mx-4 text-xs font-semibold text-gray-400 whitespace-nowrap select-none"
          >
            <span className="text-sm">{f.emoji}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  )
}
