import { useRef, useState } from 'react'
import { FolderOpen } from 'lucide-react'

export default function DropZone({ accept, onFile, hint }) {
  const inputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    onFile(e.dataTransfer?.files?.[0] ?? null)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleChange(e) {
    onFile(e.target.files?.[0] ?? null)
    e.target.value = ''
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      className={`
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragOver
          ? 'border-brand bg-blue-50 scale-[1.01]'
          : 'border-surface-border hover:border-brand hover:bg-gray-50'
        }
      `}
    >
      <FolderOpen aria-hidden="true" className={`w-14 h-14 mx-auto mb-4 transition-colors duration-200 ${isDragOver ? 'text-brand' : 'text-gray-300'}`} />
      <p className="text-brand-text font-medium">{hint}</p>
      <p className="mt-1 text-brand-muted text-sm">
        {accept === 'application/pdf' ? 'PDF files only' : accept}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
        aria-label="File upload"
      />
    </div>
  )
}
