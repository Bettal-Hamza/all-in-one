import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function MicroCard({ tool }) {
  const isLive = Boolean(tool.live)

  const inner = (
    <motion.div
      whileHover={isLive ? { y: -5, scale: 1.02 } : {}}
      whileTap={isLive ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={`
        relative bg-white/75 backdrop-blur-xl border border-white/70 rounded-2xl p-5 h-full
        shadow-glass overflow-hidden
        ${isLive ? 'cursor-pointer hover:shadow-glass-lg hover:border-white/90' : 'cursor-not-allowed'}
      `}
    >
      {/* Colored left accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ backgroundColor: isLive ? tool.accent : '#D1D5DB' }}
      />

      <div className="flex items-start gap-4 pl-3">
        {/* Icon badge */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${isLive ? tool.accent : '#9CA3AF'}18` }}
        >
          {tool.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className={`font-extrabold text-sm leading-tight ${isLive ? 'text-gray-900' : 'text-gray-400'}`}>
              {tool.label}
            </h3>
            {isLive ? (
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/80">
                Live
              </span>
            ) : (
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                Soon
              </span>
            )}
          </div>
          <p className={`text-xs leading-snug ${isLive ? 'text-gray-400' : 'text-gray-300'}`}>
            {tool.description}
          </p>
        </div>
      </div>

      {/* Arrow for live tools */}
      {isLive && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-200">
          →
        </span>
      )}

      {/* Skeleton shimmer overlay for coming-soon */}
      {!isLive && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="h-full w-[200%] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse-slow" />
        </div>
      )}
    </motion.div>
  )

  if (!isLive) return <div className="h-full">{inner}</div>
  return (
    <Link to={tool.path} className="block h-full">
      {inner}
    </Link>
  )
}
