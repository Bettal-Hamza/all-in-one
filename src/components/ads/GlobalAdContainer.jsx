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
  return null
}
