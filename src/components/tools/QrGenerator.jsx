import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Download, Share2, Link2, QrCode,
  ChevronDown, ShieldCheck, Gauge, Palette, Smartphone,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import SEOManager from '../SEOManager.jsx'
import FAQSchema from '../FAQSchema.jsx'
import HowToSchema from '../HowToSchema.jsx'

const BRAND_COLOR   = '#4F46E5'
const CLASSIC_COLOR = '#18181B'
const FALLBACK_URL  = 'https://example.com'

// ─── SEO CONTENT ─────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: Link2,
    title: 'Enter your URL or text',
    body: 'Paste any URL, phone number, email address, Wi-Fi password, or plain text into the input field. Your QR code updates live as you type — no button click needed.',
  },
  {
    Icon: Palette,
    title: 'Choose your style',
    body: 'Toggle between Classic black or Branded indigo to match your identity. Both colour options produce a fully scannable code on any QR reader — iPhone, Android, or dedicated scanner.',
  },
  {
    Icon: Download,
    title: 'Download or share instantly',
    body: 'Hit "Download PNG" to save a 216px image ready for print or digital use. On supported mobile devices, tap "Share" to send the QR image directly to any app without saving a file first.',
  },
]

const FAQS = [
  {
    q: 'Are my QR codes stored on a server?',
    a: 'No. Toolyy generates QR codes entirely inside your browser using the qrcode.react library. The URL or text you type never leaves your device — it is not sent to any server, logged, or stored anywhere. Once you close the tab, the code is gone.',
  },
  {
    q: 'Can I generate a QR code for text, not just URLs?',
    a: 'Yes. While URLs are the most common use case, you can encode any plain text — a phone number, email address, Wi-Fi credentials (SSID and password), a vCard contact block, or a short message. Any modern camera QR app on iPhone or Android will display and act on the raw text when scanned.',
  },
  {
    q: 'What image size should I use when printing a QR code?',
    a: 'For reliable scanning, a printed QR code should be at least 2 cm × 2 cm (roughly ¾ inch square). The PNG downloaded from Toolyy is 216 × 216 pixels at screen resolution. When placing it in design software (Figma, Illustrator, InDesign), scale it up proportionally — QR codes scale without loss of scan accuracy provided the aspect ratio stays square.',
  },
  {
    q: 'Can I change the QR code colour to match my brand?',
    a: 'Yes — switch to the "Branded" style to generate a QR code in Toolyy\'s signature indigo (#4F46E5). For fully custom hex colours beyond these two presets, this is on our roadmap. In the meantime you can open the downloaded PNG in any image editor and apply a colour overlay while keeping the code scannable (maintain sufficient contrast against the white background).',
  },
  {
    q: 'Do QR codes generated here ever expire?',
    a: 'Never. Unlike many free QR services that store your URL on their servers and route every scan through their redirect infrastructure, Toolyy encodes your destination directly into the QR pattern. There is no middleman server, no tracking pixel, and no subscription keeping the code alive. As long as your destination URL is live, your QR code will work indefinitely.',
  },
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">
          {q}
        </span>
        <ChevronDown
          aria-hidden="true"
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function QrGenerator() {
  const [inputValue, setInputValue] = useState('')
  const [qrValue, setQrValue]       = useState(FALLBACK_URL)
  const [branded, setBranded]       = useState(false)
  const [shareLabel, setShareLabel] = useState('Share')
  const qrWrapRef   = useRef(null)
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="QR Code Generator Online | Create &amp; Download Instantly"
        description="Generate scannable QR codes from URLs, text, Wi-Fi credentials, or phone numbers. Customizable colors, high-res PNG download, and zero data collection."
        appName="QR Code Generator"
        appDescription="Generate custom QR codes from any URL or text instantly in your browser. Adjustable error correction, branded colors, high-resolution PNG export — no sign-up."
      />
      <HowToSchema
        name="How to Generate a QR Code Free Online"
        description="Create scannable QR codes from any URL, text, or Wi-Fi credentials instantly using Toolyy."
        steps={[
          'Go to toolyy.net and select the QR Code Generator.',
          'Paste your URL, text, or Wi-Fi credentials into the input field.',
          'Choose your style and download the QR code as a high-res PNG.',
        ]}
        totalTime="PT15S"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page hero ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Utility Tools</p>
        <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          QR Generator
        </p>
        <p className="mt-2 text-gray-400 font-medium">
          Paste any URL, text, or contact info — get a scannable QR code instantly. Nothing leaves your browser.
        </p>
      </motion.div>

      {/* ── Tool area ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-20"
      >

        {/* ── QR card ───────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-8 flex flex-col gap-7">

          {/* URL input */}
          <div className="relative">
            <Link2
              aria-hidden="true"
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

          {/* QR preview */}
          <div className="flex flex-col items-center gap-5">
            <div
              ref={qrWrapRef}
              className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
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

            {/* Style toggle */}
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

          {/* Action buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-light text-white font-extrabold text-[15px] rounded-2xl shadow-lg transition-colors"
            >
              <Download aria-hidden="true" size={17} strokeWidth={2.5} />
              Download PNG
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[15px] rounded-2xl transition-colors"
            >
              <Share2 aria-hidden="true" size={17} strokeWidth={2.5} />
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
        </div>

        {/* ── Sidebar: trust cards ────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-glass flex flex-col gap-3">
            {[
              {
                Icon: ShieldCheck,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50',
                label: '100% Private',
                desc: 'Your content never leaves your device.',
              },
              {
                Icon: Gauge,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                label: 'Instant',
                desc: 'Generated in milliseconds, on-device.',
              },
              {
                Icon: Smartphone,
                color: 'text-purple-500',
                bg: 'bg-purple-50',
                label: 'Scan Anywhere',
                desc: 'Works with every camera QR reader.',
              },
            ].map(({ Icon, color, bg, label, desc }) => (
              <div key={label} className={`flex items-start gap-3 rounded-2xl ${bg} p-3`}>
                <Icon aria-hidden="true" className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-[11px] font-black uppercase tracking-wide ${color}`}>{label}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

      {/* ── SEO Article ──────────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        aria-label="Professional QR Code Generator — complete guide"
      >

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Professional QR Code Generator — Free &amp; Private
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based QR code generator encodes any URL, text, phone number, or email
          address into a ready-to-scan QR pattern — instantly, privately, and for free. No account,
          no watermark, no expiry date.
        </p>

        <div className="space-y-16">

          {/* ── How to Create a QR Code ──────────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <QrCode aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Create a QR Code in 3 Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_TO_STEPS.map(({ Icon, title, body }, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center">
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

          {/* ── Why use a browser-based QR generator ─────────── */}
          <section aria-labelledby="why-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 id="why-heading" className="text-xl font-black text-gray-900">
                Why Use a Browser-Based QR Code Generator?
              </h2>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass lg:flex lg:gap-10">

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  QR codes are now essential across virtually every industry — restaurant menus,
                  event tickets, product packaging, business cards, and contactless payments all rely
                  on them. The problem with most free QR generators is that they operate as middleman
                  redirect services: your URL is stored on their servers, every scan is tracked, and
                  the code stops working if the company shuts down or you stop paying.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Toolyy takes a fundamentally different approach. Our <strong className="text-gray-800">free QR code
                  generator</strong> encodes your content directly into the QR pattern using the
                  open-source <em>qrcode.react</em> library — entirely within your web browser. There
                  is no redirect URL, no server that stores your code, and no third-party analytics
                  attached to scans. The PNG you download is entirely self-contained and will work
                  anywhere in the world, for as long as your destination URL remains live.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  For <strong className="text-gray-800">marketing professionals</strong>, this means you can print thousands
                  of flyers or business cards without worrying about a subscription lapsing and
                  silently breaking your codes. For <strong className="text-gray-800">privacy-conscious users</strong>,
                  it means your URLs and personal data are never processed on a remote server.
                  Everything happens in milliseconds, on your own device.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The tool also handles plain text — not just URLs. Use it to encode Wi-Fi credentials
                  (SSID and password), vCard contact information, phone numbers, or any short message
                  up to several hundred characters. QR scanning apps on both iPhone and Android
                  recognise and act on all of these formats natively. No special setup, no additional
                  app required.
                </p>
              </div>

              <aside
                aria-label="QR code generator highlights"
                className="mt-8 lg:mt-0 lg:w-52 flex-shrink-0 flex flex-col gap-3"
              >
                {[
                  {
                    Icon: ShieldCheck,
                    bg: 'bg-emerald-50/70',
                    color: 'text-emerald-500',
                    label: '100% Private',
                    desc: 'Zero data sent to any server. Your content stays entirely on your device.',
                  },
                  {
                    Icon: Gauge,
                    bg: 'bg-blue-50/70',
                    color: 'text-blue-500',
                    label: 'No Expiry',
                    desc: 'Codes encode content directly — no redirect, no subscription required.',
                  },
                  {
                    Icon: Smartphone,
                    bg: 'bg-purple-50/70',
                    color: 'text-purple-500',
                    label: 'Universal Scan',
                    desc: 'Works with every modern camera app on any operating system.',
                  },
                ].map(({ Icon, bg, color, label, desc }) => (
                  <div key={label} className={`flex items-start gap-3 ${bg} rounded-2xl p-4`}>
                    <Icon aria-hidden="true" className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-xs font-black uppercase tracking-wider ${color} mb-1`}>{label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </aside>

            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <QrCode aria-hidden="true" className="w-4 h-4 text-amber-500" />
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
