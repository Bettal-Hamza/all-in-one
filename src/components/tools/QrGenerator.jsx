import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Share2, Link2 } from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'

const BRAND_COLOR = '#4F46E5'
const CLASSIC_COLOR = '#18181B'
const FALLBACK_URL = 'https://example.com'

export default function QrGenerator() {
  const [inputValue, setInputValue] = useState('')
  const [qrValue, setQrValue]       = useState(FALLBACK_URL)
  const [branded, setBranded]       = useState(false)
  const [shareLabel, setShareLabel] = useState('Share')
  const qrWrapRef  = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    recordVisit('qr-generator')
    return () => clearTimeout(debounceRef.current)
  }, [])

  function handleInput(e) {
    const val = e.target.value
    setInputValue(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQrValue(val.trim() || FALLBACK_URL)
    }, 380)
  }

  function getCanvas() {
    return qrWrapRef.current?.querySelector('canvas') ?? null
  }

  function handleDownload() {
    const canvas = getCanvas()
    if (!canvas) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'qrcode.png'
    link.click()
  }

  async function handleShare() {
    const canvas = getCanvas()
    if (!canvas) return

    const tryFileShare = () =>
      new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          try {
            const file = new File([blob], 'qrcode.png', { type: 'image/png' })
            if (navigator.canShare?.({ files: [file] })) {
              await navigator.share({ files: [file], title: 'QR Code', text: qrValue })
              resolve(true)
            } else {
              resolve(false)
            }
          } catch {
            resolve(false)
          }
        })
      })

    const shared = navigator.share ? await tryFileShare() : false

    if (!shared) {
      await navigator.clipboard.writeText(qrValue).catch(() => {})
      setShareLabel('Copied!')
      setTimeout(() => setShareLabel('Share'), 2200)
    }
  }

  const fgColor = branded ? BRAND_COLOR : CLASSIC_COLOR

  return (
    <div className="max-w-xl mx-auto px-4 py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Utility</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          QR Generator
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Paste any URL — get a scannable QR code instantly. Nothing leaves your browser.
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8 flex flex-col gap-7"
      >

        {/* URL Input */}
        <div className="relative">
          <Link2
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
          />
          <input
            type="url"
            value={inputValue}
            onChange={handleInput}
            placeholder="https://your-url.com"
            spellCheck={false}
            className="
              w-full pl-11 pr-4 py-4 text-[17px] font-semibold
              bg-gray-50/80 border border-gray-100 rounded-2xl
              text-gray-800 placeholder-gray-300
              outline-none focus:border-brand focus:ring-2 focus:ring-brand/20
              transition-all duration-200
            "
          />
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-5">
          <div
            ref={qrWrapRef}
            className="relative p-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={qrValue + fgColor}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <QRCodeCanvas
                  value={qrValue}
                  size={216}
                  fgColor={fgColor}
                  bgColor="#FFFFFF"
                  level="M"
                  marginSize={1}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Style Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-400">Style</span>
            <div className="flex bg-gray-100 rounded-full p-1 gap-0.5">
              <button
                onClick={() => setBranded(false)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200
                  ${!branded ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                Classic
              </button>
              <button
                onClick={() => setBranded(true)}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200
                  ${branded ? 'bg-brand text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                Branded
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-light text-white font-extrabold text-[15px] rounded-2xl shadow-lg transition-colors"
          >
            <Download size={17} strokeWidth={2.5} />
            Download PNG
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[15px] rounded-2xl transition-colors"
          >
            <Share2 size={17} strokeWidth={2.5} />
            <AnimatePresence mode="wait">
              <motion.span
                key={shareLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {shareLabel}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

      </motion.div>
    </div>
  )
}
