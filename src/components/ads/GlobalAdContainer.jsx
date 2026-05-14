/**
 * GlobalAdContainer — the single swap point for Google AdSense.
 *
 * To go live: replace the inner <span> in each slot with your <ins class="adsbygoogle"> tag.
 *
 * Slots:
 *   sponsor    → 728×90   between hero and tool grid
 *   sidebar    → 300×250  beside processing area or inside dropzone results
 *   postAction → 728×90   below download results
 *   hero       → 728×90   alias for sponsor (legacy)
 */
const AD_CONFIG = {
  sponsor:    { width: 728, height: 90,  label: '✦ Sponsor · 728×90' },
  hero:       { width: 728, height: 90,  label: '✦ Sponsor · 728×90' },
  sidebar:    { width: 300, height: 250, label: 'Ad · 300×250' },
  postAction: { width: 728, height: 90,  label: 'Ad · 728×90' },
}

export default function GlobalAdContainer({ slot = 'sponsor', className = '' }) {
  const { width, height, label } = AD_CONFIG[slot] ?? AD_CONFIG.sponsor

  return (
    <div
      style={{ width: '100%', maxWidth: width, height }}
      className={`mx-auto flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 backdrop-blur-sm ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      {/* ── Replace the span below with your AdSense <ins> tag ── */}
      <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase select-none">
        {label}
      </span>
    </div>
  )
}
