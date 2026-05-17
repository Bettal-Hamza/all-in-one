import { useRef, lazy, Suspense } from 'react'
import { Sparkles, Lock, Zap, BadgeCheck } from 'lucide-react'

const MagicDropzone = lazy(() => import('./ui/MagicDropzone.jsx'))

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

        {/* Left: headline + trust pills + CTA */}
        <div className="flex flex-col justify-center py-4">

          <span
            className="animate-fade-up inline-flex items-center self-start gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-extrabold tracking-widest uppercase mb-6"
          >
            Toolyy Browser Toolkit
          </span>

          <h1
            className="animate-fade-up animate-delay-1 text-6xl sm:text-7xl font-black tracking-tight text-gray-900 leading-[1.04]"
          >
            <span className="inline-flex items-baseline gap-3">
              File magic,
              <Sparkles aria-hidden="true" className="w-10 h-10 text-indigo-500 shrink-0 self-center" />
            </span>
            <br />
            <span className="text-brand">no friction.</span>
          </h1>

          <p
            className="animate-fade-up animate-delay-2 mt-5 text-lg text-gray-400 font-medium max-w-sm leading-relaxed"
          >
            Powerful browser utilities for PDFs, images and more.
            Your files never leave your device.
          </p>

          {/* Trust pills */}
          <div className="animate-fade-up animate-delay-3 flex flex-wrap gap-2.5 mt-7">
            {TRUST_PILLS.map(({ Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-xs font-bold text-gray-600 shadow-sm"
              >
                <Icon aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
                {text}
              </span>
            ))}
          </div>

          {/* Browse Files CTA */}
          <div className="animate-fade-up animate-delay-4 mt-8 flex items-center gap-3">
            <button
              onClick={() => dropzoneInputRef.current?.click()}
              className="px-7 py-3.5 bg-brand text-white font-extrabold rounded-2xl shadow-lg hover:bg-brand-light hover:scale-[1.04] active:scale-[0.96] transition-all text-sm"
            >
              Browse Files
            </button>
            <span className="text-xs text-gray-300 font-medium">or drag one over</span>
          </div>
        </div>

        {/* Right: Magic Dropzone — lazy-loaded (not LCP) */}
        <div className="animate-fade-up animate-delay-1">
          <Suspense fallback={
            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 backdrop-blur-xl min-h-[360px] flex items-center justify-center">
              <span className="text-sm text-gray-300 font-medium">Loading...</span>
            </div>
          }>
            <MagicDropzone inputRef={dropzoneInputRef} />
          </Suspense>
        </div>

      </div>
    </section>
  )
}
