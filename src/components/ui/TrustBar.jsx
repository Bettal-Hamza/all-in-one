import {
  FileText, FileImage, Zap, Film, Music,
  PenTool, Braces, Table2, Archive, FileSpreadsheet, Layout,
} from 'lucide-react'

const FORMATS = [
  { label: 'PDF',  Icon: FileText },
  { label: 'JPG',  Icon: FileImage },
  { label: 'PNG',  Icon: FileImage },
  { label: 'WebP', Icon: Zap },
  { label: 'MP4',  Icon: Film },
  { label: 'GIF',  Icon: Film },
  { label: 'MP3',  Icon: Music },
  { label: 'SVG',  Icon: PenTool },
  { label: 'JSON', Icon: Braces },
  { label: 'CSV',  Icon: Table2 },
  { label: 'ZIP',  Icon: Archive },
  { label: 'DOCX', Icon: FileText },
  { label: 'XLSX', Icon: FileSpreadsheet },
  { label: 'PPTX', Icon: Layout },
]

const ITEMS = [...FORMATS, ...FORMATS]

export default function TrustBar() {
  return (
    <div className="w-full overflow-hidden border-y border-gray-100/80 bg-white/40 backdrop-blur-sm py-3">
      <p className="sr-only">Supported file formats: {FORMATS.map(f => f.label).join(', ')}</p>

      <div className="flex animate-trust-scroll gap-0 w-max" aria-hidden="true">
        {ITEMS.map(({ label, Icon }, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 mx-4 text-xs font-semibold text-gray-400 whitespace-nowrap select-none"
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
