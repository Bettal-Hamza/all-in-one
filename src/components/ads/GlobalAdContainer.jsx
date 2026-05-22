import { useEffect, useRef, useState } from 'react'

const ADSENSE_ENABLED = false
const ADSENSE_CLIENT  = 'ca-pub-XXXXXXXXXX'

const AD_CONFIG = {
  sponsor:    { width: 728, height: 90,  slot: '',  label: '✦ Sponsor · 728×90' },
  hero:       { width: 728, height: 90,  slot: '',  label: '✦ Sponsor · 728×90' },
  sidebar:    { width: 300, height: 250, slot: '',  label: 'Ad · 300×250' },
  postAction: { width: 728, height: 90,  slot: '',  label: 'Ad · 728×90' },
}

let scriptLoaded = false
let scriptLoading = false

function loadAdSenseScript() {
  if (scriptLoaded || scriptLoading) return
  scriptLoading = true
  const s = document.createElement('script')
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
  s.async = true
  s.crossOrigin = 'anonymous'
  s.onload = () => { scriptLoaded = true }
  document.head.appendChild(s)
}

function initOnInteraction() {
  if (scriptLoaded || scriptLoading) return
  const trigger = () => {
    loadAdSenseScript()
    window.removeEventListener('scroll', trigger)
    window.removeEventListener('click', trigger)
    window.removeEventListener('touchstart', trigger)
  }
  window.addEventListener('scroll', trigger, { once: true, passive: true })
  window.addEventListener('click', trigger, { once: true })
  window.addEventListener('touchstart', trigger, { once: true, passive: true })
}

export default function GlobalAdContainer({ slot = 'sponsor', className = '' }) {
  if (!ADSENSE_ENABLED) return null

  const config = AD_CONFIG[slot] || AD_CONFIG.sponsor
  const ref = useRef(null)
  const [pushed, setPushed] = useState(false)

  useEffect(() => {
    initOnInteraction()
  }, [])

  useEffect(() => {
    if (!scriptLoaded || pushed || !ref.current) return
    const timer = setTimeout(() => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        setPushed(true)
      } catch {}
    }, 100)
    return () => clearTimeout(timer)
  }, [scriptLoaded, pushed])

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: config.height, minWidth: Math.min(config.width, 320) }}
    >
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', width: config.width, height: config.height }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={config.slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
