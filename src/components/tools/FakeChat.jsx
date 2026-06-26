import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Share2, Plus, Trash2, ArrowUp, ArrowDown,
  ChevronDown, MessageCircle, ShieldCheck, Zap, Smartphone,
  Sparkles, LayoutGrid, Sun, Moon, Droplet,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import SEOManager from '../SEOManager.jsx'
import FAQSchema from '../FAQSchema.jsx'
import HowToSchema from '../HowToSchema.jsx'
import RelatedToolsNav from '../ui/RelatedToolsNav.jsx'

// ─── THEME CONFIG ────────────────────────────────────────────────────────────

const THEMES = {
  imessage: {
    label: 'iMessage',
    sub: 'iMessage',
    light: {
      bg: '#FFFFFF', headerBg: '#F7F7F7', headerText: '#000000', subText: '#8E8E93',
      accent: '#1A8CFF',
      sent:     { bg: '#1A8CFF', text: '#FFFFFF' },
      received: { bg: '#E9E9EB', text: '#000000' },
    },
    dark: {
      bg: '#000000', headerBg: '#1C1C1E', headerText: '#FFFFFF', subText: '#8E8E93',
      accent: '#1A8CFF',
      sent:     { bg: '#1A8CFF', text: '#FFFFFF' },
      received: { bg: '#262629', text: '#FFFFFF' },
    },
  },
  whatsapp: {
    label: 'WhatsApp',
    sub: 'online',
    light: {
      bg: '#E5DDD5', headerBg: '#075E54', headerText: '#FFFFFF', subText: '#CFE9E2',
      accent: '#FFFFFF',
      sent:     { bg: '#DCF8C6', text: '#111111' },
      received: { bg: '#FFFFFF', text: '#111111' },
    },
    dark: {
      bg: '#0B141A', headerBg: '#1F2C34', headerText: '#E9EDEF', subText: '#8FA3AD',
      accent: '#E9EDEF',
      sent:     { bg: '#005C4B', text: '#E9EDEF' },
      received: { bg: '#202C33', text: '#E9EDEF' },
    },
  },
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

const DEFAULT_MESSAGES = [
  { id: 1, side: 'received', text: 'omg did you see what just happened 😭' },
  { id: 2, side: 'sent',     text: 'no?? tell me everything' },
  { id: 3, side: 'received', text: 'ok so you are NOT going to believe this…' },
]

// ─── CANVAS RENDERER (for crisp PNG download) ────────────────────────────────

function wrapLines(ctx, text, maxWidth) {
  const lines = []
  for (const para of String(text || '').split('\n')) {
    const words = para.split(' ')
    let line = ''
    const breakLong = (word) => {
      let w = word
      while (ctx.measureText(w).width > maxWidth && w.length > 1) {
        let i = 1
        while (i < w.length && ctx.measureText(w.slice(0, i + 1)).width <= maxWidth) i++
        lines.push(w.slice(0, i))
        w = w.slice(i)
      }
      return w
    }
    for (const word of words) {
      const test = line ? line + ' ' + word : word
      if (ctx.measureText(test).width <= maxWidth) {
        line = test
      } else {
        if (line) { lines.push(line); line = '' }
        line = breakLong(word)
      }
    }
    lines.push(line)
  }
  return lines.length ? lines : ['']
}

function roundRectPath(ctx, x, y, w, h, r) {
  const c = typeof r === 'number' ? { tl: r, tr: r, br: r, bl: r } : r
  ctx.beginPath()
  ctx.moveTo(x + c.tl, y)
  ctx.lineTo(x + w - c.tr, y); ctx.arcTo(x + w, y, x + w, y + c.tr, c.tr)
  ctx.lineTo(x + w, y + h - c.br); ctx.arcTo(x + w, y + h, x + w - c.br, y + h, c.br)
  ctx.lineTo(x + c.bl, y + h); ctx.arcTo(x, y + h, x, y + h - c.bl, c.bl)
  ctx.lineTo(x, y + c.tl); ctx.arcTo(x, y, x + c.tl, y, c.tl)
  ctx.closePath()
}

function buildChatCanvas({ platform, dark, contactName, time, messages, watermark = true }) {
  const scale = 2
  const W = 384
  const padX = 14
  const bubblePadX = 13
  const bubblePadY = 9
  const fontSize = 16
  const lineHeight = 21
  const msgFont = `400 ${fontSize}px ${FONT}`
  const maxBubble = Math.round(W * 0.74)
  const gap = 8
  const statusH = 28
  const headerH = 62
  const topPad = 14
  const bottomPad = watermark ? 28 : 18

  const theme = THEMES[platform][dark ? 'dark' : 'light']
  const clean = messages.filter(m => m.text.trim() !== '')

  // ── measure pass
  const mctx = document.createElement('canvas').getContext('2d')
  mctx.font = msgFont
  const laid = clean.map(msg => {
    const lines = wrapLines(mctx, msg.text, maxBubble - bubblePadX * 2)
    let textW = 0
    for (const l of lines) textW = Math.max(textW, mctx.measureText(l).width)
    const bw = Math.min(maxBubble, Math.ceil(textW) + bubblePadX * 2)
    const bh = lines.length * lineHeight + bubblePadY * 2
    return { ...msg, lines, bw, bh }
  })

  let contentH = topPad
  for (const l of laid) contentH += l.bh + gap
  contentH += bottomPad
  const H = Math.ceil(statusH + headerH + contentH)

  // ── draw
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  ctx.textBaseline = 'top'

  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, W, H)

  // header block (status + header)
  ctx.fillStyle = theme.headerBg
  ctx.fillRect(0, 0, W, statusH + headerH)

  // status bar
  ctx.fillStyle = theme.headerText
  ctx.textAlign = 'left'
  ctx.font = `600 13px ${FONT}`
  ctx.fillText(time || '9:41', 16, 8)
  ctx.textAlign = 'right'
  ctx.font = `600 12px ${FONT}`
  ctx.fillText('5G  100%', W - 14, 8)
  ctx.textAlign = 'left'

  // back chevron
  const hMid = statusH + headerH / 2
  ctx.strokeStyle = platform === 'imessage' ? theme.accent : theme.headerText
  ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(20, hMid - 7); ctx.lineTo(12, hMid); ctx.lineTo(20, hMid + 7)
  ctx.stroke()

  // avatar
  const avR = 17
  const avCx = 34 + avR
  const avCy = hMid
  ctx.fillStyle = platform === 'imessage' ? '#C7C7CC' : '#6E7B82'
  ctx.beginPath(); ctx.arc(avCx, avCy, avR, 0, Math.PI * 2); ctx.fill()
  const initial = (contactName || '?').trim().charAt(0).toUpperCase() || '?'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `600 16px ${FONT}`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText(initial, avCx, avCy + 1)
  ctx.textBaseline = 'top'; ctx.textAlign = 'left'

  // name + subtitle
  const nameX = avCx + avR + 12
  ctx.fillStyle = theme.headerText
  ctx.font = `600 16px ${FONT}`
  ctx.fillText(contactName || 'Contact', nameX, statusH + 14)
  ctx.fillStyle = theme.subText
  ctx.font = `400 12px ${FONT}`
  ctx.fillText(THEMES[platform].sub, nameX, statusH + 35)

  // bubbles
  let y = statusH + headerH + topPad
  for (const msg of laid) {
    const sent = msg.side === 'sent'
    const colors = sent ? theme.sent : theme.received
    const x = sent ? (W - padX - msg.bw) : padX
    const radii = sent
      ? { tl: 18, tr: 18, br: 6, bl: 18 }
      : { tl: 18, tr: 18, br: 18, bl: 6 }
    roundRectPath(ctx, x, y, msg.bw, msg.bh, radii)
    ctx.fillStyle = colors.bg
    ctx.fill()
    ctx.fillStyle = colors.text
    ctx.font = msgFont
    let ty = y + bubblePadY
    for (const line of msg.lines) {
      ctx.fillText(line, x + bubblePadX, ty)
      ty += lineHeight
    }
    y += msg.bh + gap
  }

  // faint "toolyy.net" watermark in the bottom-right corner
  if (watermark) {
    ctx.save()
    ctx.font = `600 11px ${FONT}`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'alphabetic'
    ctx.globalAlpha = dark ? 0.5 : 0.42
    ctx.fillStyle = dark ? '#FFFFFF' : '#000000'
    ctx.fillText('toolyy.net', W - padX, H - 9)
    ctx.restore()
  }

  return canvas
}

// ─── SEO CONTENT ─────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: MessageCircle,
    title: 'Type your conversation',
    body: 'Add messages one by one and choose who sent each — tap "Them" for received grey/white bubbles or "Me" for the sent blue/green bubbles. Set the contact name and the status-bar time.',
  },
  {
    Icon: Smartphone,
    title: 'Pick the look',
    body: 'Switch between iMessage and WhatsApp styles, and toggle light or dark mode. The phone preview updates live so you can see exactly how the screenshot will look before you export.',
  },
  {
    Icon: Download,
    title: 'Download the screenshot',
    body: 'Hit "Download PNG" to save a high-resolution chat image — no sign-up. A small toolyy.net watermark sits in the corner by default; flip the "Watermark off" toggle for a completely clean export. Share it straight to TikTok, Reels, or Reddit.',
  },
]

const FAQS = [
  {
    q: 'Is this fake chat generator free?',
    a: 'Yes — completely free with no sign-up and no limits. Images get a small toolyy.net watermark in the corner by default, but you can switch it off with one toggle for a clean export. The tool runs entirely in your browser, so there are no server costs and nothing to pay for.',
  },
  {
    q: 'Are my conversations private?',
    a: 'Completely. Every message you type and every image you export is processed locally in your browser using the HTML canvas. Nothing is uploaded to any server, logged, or stored. When you close the tab, it is gone.',
  },
  {
    q: 'Can I make both iMessage and WhatsApp screenshots?',
    a: 'Yes. Toggle between the iMessage (blue) and WhatsApp (green) styles, each with accurate light and dark modes. You control the contact name, the status-bar time, and the full back-and-forth of the conversation.',
  },
  {
    q: 'What can I use a fake text screenshot for?',
    a: 'The most popular uses are short "text story" videos on TikTok and Instagram Reels, memes, comedy skits, app and UI design mockups, presentations, and writing or screenwriting. It is a storytelling and design tool.',
  },
  {
    q: 'Does the image have a watermark?',
    a: 'By default there is a small, faint "toolyy.net" watermark in the bottom corner. It is optional — just click the "Watermark off" toggle before you download and the PNG exports completely clean, so it looks like a real screenshot for your videos and mockups.',
  },
  {
    q: 'Is it okay to make fake chat screenshots?',
    a: 'For parody, storytelling, memes, and design mockups — absolutely, and that is what this tool is for. Do not use fabricated screenshots to deceive, defame, harass, scam, or impersonate real people. Use it responsibly and for fun.',
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
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">{q}</span>
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

// Live phone preview (DOM)
function PhonePreview({ platform, dark, contactName, time, messages, watermark }) {
  const theme = THEMES[platform][dark ? 'dark' : 'light']
  const clean = messages.filter(m => m.text.trim() !== '')
  const initial = (contactName || '?').trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className="relative w-full max-w-[340px] mx-auto rounded-[2.2rem] overflow-hidden shadow-glass-lg border border-black/5"
      style={{ backgroundColor: theme.bg }}
    >
      {watermark && (
        <span
          className="absolute bottom-2.5 right-4 z-10 text-[10px] font-semibold pointer-events-none select-none"
          style={{ color: dark ? '#FFFFFF' : '#000000', opacity: 0.42 }}
        >
          toolyy.net
        </span>
      )}
      {/* status + header */}
      <div style={{ backgroundColor: theme.headerBg }}>
        <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[12px] font-semibold" style={{ color: theme.headerText }}>
          <span>{time || '9:41'}</span>
          <span className="opacity-90">5G · 100%</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <ChevronDown className="w-5 h-5 rotate-90" style={{ color: platform === 'imessage' ? theme.accent : theme.headerText }} aria-hidden="true" />
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
               style={{ backgroundColor: platform === 'imessage' ? '#C7C7CC' : '#6E7B82' }}>
            {initial}
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-[15px] font-semibold truncate" style={{ color: theme.headerText }}>{contactName || 'Contact'}</p>
            <p className="text-[11px] truncate" style={{ color: theme.subText }}>{THEMES[platform].sub}</p>
          </div>
        </div>
      </div>

      {/* messages */}
      <div className="px-3 py-4 flex flex-col gap-1.5 min-h-[260px] max-h-[420px] overflow-y-auto">
        {clean.length === 0 && (
          <p className="text-center text-xs mt-12" style={{ color: theme.subText }}>Your messages will appear here…</p>
        )}
        {clean.map((m, i) => {
          const sent = m.side === 'sent'
          const colors = sent ? theme.sent : theme.received
          return (
            <div key={m.id ?? i} className={`flex ${sent ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[74%] px-3 py-2 text-[14.5px] leading-snug whitespace-pre-wrap break-words"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderRadius: 18,
                  borderBottomRightRadius: sent ? 6 : 18,
                  borderBottomLeftRadius: sent ? 18 : 6,
                }}
              >
                {m.text}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function FakeChat() {
  const [platform, setPlatform]   = useState('imessage')
  const [dark, setDark]           = useState(false)
  const [contactName, setContact] = useState('Alex')
  const [time, setTime]           = useState('9:41')
  const [messages, setMessages]   = useState(DEFAULT_MESSAGES)
  const [watermark, setWatermark] = useState(true)
  const [shareLabel, setShareLabel] = useState('Share')
  const idRef = useRef(100)

  useEffect(() => { recordVisit('fake-chat') }, [])

  function addMessage() {
    const last = messages[messages.length - 1]
    const nextSide = last?.side === 'sent' ? 'received' : 'sent'
    setMessages(m => [...m, { id: ++idRef.current, side: nextSide, text: '' }])
  }
  function updateText(id, text) {
    setMessages(m => m.map(x => x.id === id ? { ...x, text } : x))
  }
  function setSide(id, side) {
    setMessages(m => m.map(x => x.id === id ? { ...x, side } : x))
  }
  function removeMessage(id) {
    setMessages(m => m.filter(x => x.id !== id))
  }
  function move(id, dir) {
    setMessages(m => {
      const i = m.findIndex(x => x.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= m.length) return m
      const copy = [...m]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  function handleDownload() {
    const canvas = buildChatCanvas({ platform, dark, contactName, time, messages, watermark })
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${platform}-chat.png`
    link.click()
  }

  async function handleShare() {
    const canvas = buildChatCanvas({ platform, dark, contactName, time, messages, watermark })
    const shared = await new Promise((resolve) => {
      if (!navigator.share) return resolve(false)
      canvas.toBlob(async (blob) => {
        try {
          const file = new File([blob], `${platform}-chat.png`, { type: 'image/png' })
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Chat screenshot' })
            resolve(true)
          } else resolve(false)
        } catch { resolve(false) }
      })
    })
    if (!shared) {
      setShareLabel('Use Download ↓')
      setTimeout(() => setShareLabel('Share'), 2200)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="Fake Chat Generator — Make iMessage &amp; WhatsApp Screenshots"
        description="Free fake chat generator. Create realistic iMessage and WhatsApp chat screenshots for memes, TikTok text stories, and mockups. No sign-up, optional watermark, 100% in your browser."
        appName="Fake Chat Generator"
        appDescription="Create realistic fake iMessage and WhatsApp chat screenshots in your browser. Light and dark mode, optional watermark, no sign-up — perfect for memes, TikTok stories, and UI mockups."
      />
      <HowToSchema
        name="How to Make a Fake Text Message Screenshot"
        description="Create a realistic fake iMessage or WhatsApp chat screenshot online with Toolyy."
        steps={[
          'Open the Fake Chat Generator on toolyy.net.',
          'Add your messages and pick who sent each one, then set the name, time, and style.',
          'Choose iMessage or WhatsApp, light or dark, and download your screenshot as a PNG.',
        ]}
        totalTime="PT1M"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Free Online Tool</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Fake Chat Generator
        </h1>
        <p className="mt-2 text-gray-400 font-medium max-w-2xl">
          Create realistic iMessage &amp; WhatsApp chat screenshots for memes, TikTok text stories, and mockups — no sign-up, watermark you can toggle off. Everything stays in your browser.
        </p>
      </motion.div>

      {/* ── Tool area ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-20"
      >
        {/* ── Controls ─────────────────────────────────────── */}
        <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 flex flex-col gap-5">

          {/* Platform + theme toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-gray-100 rounded-full p-1 gap-0.5">
              {['imessage', 'whatsapp'].map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${platform === p ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {THEMES[p].label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDark(d => !d)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {dark ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={() => setWatermark(w => !w)}
              title="Toggle the small toolyy.net watermark on the exported image"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${watermark ? 'bg-brand/10 text-brand hover:bg-brand/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              <Droplet className="w-4 h-4" />
              {watermark ? 'Watermark on' : 'Watermark off'}
            </button>
          </div>

          {/* Contact name + time */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-black uppercase tracking-wide text-gray-400">Contact name</label>
              <input
                value={contactName}
                onChange={e => setContact(e.target.value)}
                placeholder="Alex"
                className="mt-1 w-full px-3 py-2.5 text-sm font-semibold bg-gray-50/80 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-wide text-gray-400">Time</label>
              <input
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="9:41"
                className="mt-1 w-full px-3 py-2.5 text-sm font-semibold bg-gray-50/80 border border-gray-100 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-black uppercase tracking-wide text-gray-400">Messages</label>
            {messages.map((m, i) => (
              <div key={m.id} className="flex items-start gap-2 bg-gray-50/70 border border-gray-100 rounded-xl p-2">
                <div className="flex bg-white rounded-lg p-0.5 border border-gray-100 shrink-0">
                  <button
                    onClick={() => setSide(m.id, 'received')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${m.side === 'received' ? 'bg-gray-200 text-gray-800' : 'text-gray-400'}`}
                  >Them</button>
                  <button
                    onClick={() => setSide(m.id, 'sent')}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${m.side === 'sent' ? 'bg-brand text-white' : 'text-gray-400'}`}
                  >Me</button>
                </div>
                <input
                  value={m.text}
                  onChange={e => updateText(m.id, e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-sm bg-white border border-gray-100 rounded-lg text-gray-800 placeholder-gray-300 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => move(m.id, -1)} disabled={i === 0} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30" aria-label="Move up"><ArrowUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => move(m.id, 1)} disabled={i === messages.length - 1} className="p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30" aria-label="Move down"><ArrowDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => removeMessage(m.id)} className="p-1 text-gray-300 hover:text-red-500" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button
              onClick={addMessage}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-gray-200 text-sm font-bold text-gray-400 hover:text-brand hover:border-brand/40 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add message
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
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
              {shareLabel}
            </motion.button>
          </div>
        </div>

        {/* ── Preview ──────────────────────────────────────── */}
        <div className="flex items-start justify-center lg:pt-2">
          <PhonePreview platform={platform} dark={dark} contactName={contactName} time={time} messages={messages} watermark={watermark} />
        </div>
      </motion.div>

      {/* ── SEO Article ──────────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        aria-label="Fake chat generator — complete guide"
      >
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Make a Fake Text Message Screenshot — Free &amp; Private
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          This free fake chat generator builds realistic iMessage and WhatsApp conversation screenshots right in your
          browser. Write the back-and-forth, pick the contact name and time, switch between light and dark mode, and
          export a PNG with no sign-up and an optional watermark you can toggle off. Perfect for TikTok text stories, memes, comedy skits,
          and design mockups — and because everything runs locally, your conversation never leaves your device.
        </p>

        <div className="space-y-16">
          {/* How to */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <MessageCircle aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h2 id="howto-heading" className="text-xl font-black text-gray-900">How to Make a Fake Chat in 3 Steps</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HOW_TO_STEPS.map(({ Icon, title, body }, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center">
                      <Icon aria-hidden="true" className="w-5 h-5 text-brand" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand/50">Step {i + 1}</span>
                    <h3 className="text-sm font-extrabold text-gray-900 mt-0.5 mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section aria-labelledby="why-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Sparkles aria-hidden="true" className="w-4 h-4 text-amber-500" />
              </div>
              <h2 id="why-heading" className="text-xl font-black text-gray-900">What People Make With It</h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Fake text screenshots power one of the most popular formats on social media: the <strong className="text-gray-800">"text story"</strong>.
                Creators script a dramatic or funny conversation, screen-record it message by message, and post it to TikTok
                or Instagram Reels — these videos routinely reach millions of views without the creator ever showing their face.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Beyond storytelling, designers and developers use fake chat screenshots as <strong className="text-gray-800">UI mockups</strong> for
                app concepts and pitch decks. Marketers use them for testimonial-style graphics, teachers and writers use them
                for scripts and roleplay, and millions of people simply make <strong className="text-gray-800">memes</strong> to send to friends.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Toolyy supports both the blue iMessage look and the green WhatsApp look, each in accurate light and dark modes,
                so your screenshot matches whatever device or vibe your story needs.
              </p>
            </div>
          </section>

          {/* Quick answers */}
          <section aria-labelledby="snippets-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Zap aria-hidden="true" className="w-4 h-4 text-blue-500" />
              </div>
              <h2 id="snippets-heading" className="text-xl font-black text-gray-900">Quick Answers</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">How do I make a fake iMessage screenshot?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Open Toolyy's Fake Chat Generator, keep the style on iMessage, and add your messages — tap "Them" or "Me"
                  for each bubble. Set the contact name and time, then click Download PNG. The whole thing takes under a minute,
                  and you can toggle the small watermark off for a clean image.
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass">
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">Is it safe and private to use?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Yes. The generator runs 100% in your browser using the HTML canvas — your messages are never uploaded to a
                  server, stored, or logged. It is the most private way to create a chat mockup online.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy / ethics callout */}
          <section aria-labelledby="note-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 id="note-heading" className="text-xl font-black text-gray-900">Use It Responsibly</h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <p className="text-sm text-gray-600 leading-relaxed">
                This is a tool for parody, storytelling, memes, and design mockups. Please don't use fabricated screenshots
                to deceive, defame, harass, scam, or impersonate real people. Fake conversations can be convincing — keep them
                clearly in the realm of fun and fiction.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-amber-500" />
              </div>
              <h2 id="faq-heading" className="text-xl font-black text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl px-8 shadow-glass divide-y divide-gray-100">
              {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </section>
        </div>

        <RelatedToolsNav currentToolId="fake-chat" />
      </motion.article>
    </div>
  )
}
