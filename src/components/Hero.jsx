import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Lock, Zap, BadgeCheck } from 'lucide-react'
import MagicDropzone from './ui/MagicDropzone.jsx'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const TRUST_PILLS = [
  { Icon: Lock,      text: 'No Upload'  },
  { Icon: Zap,       text: 'Instant'    },
  { Icon: BadgeCheck, text: '100% Free' },
]

export default function Hero() {
  const dropzoneInputRef = useRef(null)

  return (
    <section className="max-w-6xl mx-auto px-4 pt-16 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* ── Left: headline + trust pills + CTA ─────────── */}
        <div className="flex flex-col justify-center py-4">

          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center self-start gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-extrabold tracking-widest uppercase mb-6"
          >
            All-in-One Browser Toolkit
          </motion.span>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-6xl sm:text-7xl font-black tracking-tight text-gray-900 leading-[1.04]"
          >
            <span className="inline-flex items-baseline gap-3">
              File magic,
              <Sparkles className="w-10 h-10 text-indigo-500 shrink-0 self-center" />
            </span>
            <br />
            <span className="text-brand">no friction.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-5 text-lg text-gray-400 font-medium max-w-sm leading-relaxed"
          >
            Powerful browser utilities for PDFs, images and more.
            Your files never leave your device.
          </motion.p>

          {/* Trust pills */}
          <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-2.5 mt-7">
            {TRUST_PILLS.map(({ Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-xs font-bold text-gray-600 shadow-sm"
              >
                <Icon className="w-3.5 h-3.5 text-brand" />
                {text}
              </span>
            ))}
          </motion.div>

          {/* Browse Files CTA */}
          <motion.div {...fadeUp(0.28)} className="mt-8 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              onClick={() => dropzoneInputRef.current?.click()}
              className="px-7 py-3.5 bg-brand text-white font-extrabold rounded-2xl shadow-lg hover:bg-brand-light transition-colors text-sm"
            >
              Browse Files
            </motion.button>
            <span className="text-xs text-gray-300 font-medium">or drag one over</span>
          </motion.div>
        </div>

        {/* ── Right: Magic Dropzone ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MagicDropzone inputRef={dropzoneInputRef} />
        </motion.div>

      </div>
    </section>
  )
}
