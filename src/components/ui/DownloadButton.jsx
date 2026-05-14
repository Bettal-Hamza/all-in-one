export default function DownloadButton({ url, filename, label }) {
  return (
    <a
      href={url}
      download={filename}
      className="flex items-center justify-between px-4 py-3 bg-surface border border-surface-border rounded-xl hover:bg-gray-50 hover:border-brand/40 transition-all group"
    >
      <span className="flex items-center gap-3">
        <span className="text-lg">📄</span>
        <span className="text-sm font-medium text-brand-text">{label}</span>
        <span className="text-xs text-brand-muted">{filename}</span>
      </span>
      <span className="text-sm font-medium text-brand group-hover:underline">
        Download
      </span>
    </a>
  )
}
