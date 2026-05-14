import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ToolCard({ tool, isRecent }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
      <Link
        to={tool.path}
        className="relative flex flex-col h-full bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 overflow-hidden group"
      >
        {/* Subtle indigo gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/5 group-hover:to-brand/[0.02] transition-all duration-500 rounded-3xl" />

        {isRecent && (
          <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase bg-brand/10 text-brand px-2.5 py-1 rounded-full">
            Recent
          </span>
        )}

        <span className="text-4xl mb-4 relative">{tool.icon}</span>
        <h3 className="font-bold text-gray-900 text-base relative">{tool.label}</h3>
        <p className="mt-1.5 text-sm text-gray-400 leading-snug relative flex-1">{tool.description}</p>

        <div className="mt-4 flex items-center justify-between relative">
          <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">{tool.category}</span>
          <span className="text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Open →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
