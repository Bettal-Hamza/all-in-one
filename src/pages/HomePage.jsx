import Hero        from '../components/Hero.jsx'
import TrustBar    from '../components/ui/TrustBar.jsx'
import BentoGrid   from '../components/BentoGrid.jsx'
import UtilityPitch from '../components/sections/UtilityPitch.jsx'
import ToolCatalog  from '../components/sections/ToolCatalog.jsx'
import HowItWorks   from '../components/sections/HowItWorks.jsx'
import ExpertFAQ    from '../components/sections/ExpertFAQ.jsx'

function Divider() {
  return <div aria-hidden="true" className="border-t border-gray-100 mx-4 lg:mx-8" />
}

export default function HomePage() {
  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <TrustBar />

      {/* ── Bento grid (quick-pick tool cards) ────────────────── */}
      <BentoGrid />

      <Divider />

      {/* ── "The All-in-One Utility" — 300-word editorial copy ── */}
      <UtilityPitch />

      {/* ── Detailed Tool Catalog — 8-card grid ───────────────── */}
      <ToolCatalog />

      <Divider />

      {/* ── How It Works — 3-step visual ──────────────────────── */}
      <HowItWorks />

      <Divider />

      {/* ── Expert FAQ — native details/summary accordion ──────── */}
      <ExpertFAQ />

    </div>
  )
}
