import { motion } from 'framer-motion'
import Hero from '../components/Hero.jsx'
import BentoGrid from '../components/BentoGrid.jsx'
import TrustBar from '../components/ui/TrustBar.jsx'

export default function HomePage() {
  return (
    <div>
      {/* ══════════════════════════════════════════════
          HERO — split layout
      ══════════════════════════════════════════════ */}
      <Hero />

      {/* ══════════════════════════════════════════════
          TRUST BAR — scrolling format ticker
      ══════════════════════════════════════════════ */}
      <TrustBar />

      {/* ══════════════════════════════════════════════
          SPONSOR — 728×90 reserved slot
      ══════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center px-4 py-8"
      >
        <div className="w-full max-w-[728px] h-[90px] flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-xs font-bold text-gray-300 tracking-widest uppercase select-none">
          Sponsor
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════
          BENTO GRID — 4 tool cards
      ══════════════════════════════════════════════ */}
      <BentoGrid />
    </div>
  )
}
