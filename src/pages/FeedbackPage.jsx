import { motion } from 'framer-motion'
import { MessageSquare, Lightbulb, Bug, HelpCircle } from 'lucide-react'
import SEOManager from '../components/SEOManager.jsx'
import SuggestionForm from '../components/SuggestionForm.jsx'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
})

const PROMPTS = [
  {
    Icon: Lightbulb,
    color: 'text-amber-500',
    bg:    'bg-amber-50',
    text:  '"I\'d love a tool that converts HEIC photos to JPG without losing quality."',
  },
  {
    Icon: Bug,
    color: 'text-red-500',
    bg:    'bg-red-50',
    text:  '"The QR code download button doesn\'t work on my iPhone — can this be fixed?"',
  },
  {
    Icon: HelpCircle,
    color: 'text-blue-500',
    bg:    'bg-blue-50',
    text:  '"Could you add batch image conversion so I can convert a whole folder at once?"',
  },
]

export default function FeedbackPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SEOManager
        title="Suggest a Tool or Leave Feedback — Toolyy"
        description="Have an idea for a new browser utility, or spotted a bug? Tell us — every submission is read personally and used to shape Toolyy's roadmap."
        appName="Toolyy Feedback"
        appDescription="Submit tool suggestions and feedback for Toolyy — free browser-based file utilities."
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/15 mb-5">
          <MessageSquare aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-brand">Feedback</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.1] mb-4">
          Shape what we build next.
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
          Toolyy's roadmap is driven by real user requests. Suggest a new tool, report a bug,
          or tell us how we can make an existing feature better — we read every single submission.
        </p>
      </motion.div>

      {/* ── Example prompts ───────────────────────────────────── */}
      <motion.div {...fadeUp(0.07)} className="flex flex-col gap-2.5 mb-9">
        {PROMPTS.map(({ Icon, color, bg, text }) => (
          <div key={text} className={`flex items-start gap-3 rounded-2xl ${bg} px-4 py-3`}>
            <Icon aria-hidden="true" className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} />
            <p className="text-xs font-semibold text-gray-600 italic leading-relaxed">{text}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Form ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.13)}>
        <SuggestionForm />
      </motion.div>

      {/* ── What happens next ─────────────────────────────────── */}
      <motion.div {...fadeUp(0.2)} className="mt-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-glass">
          <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-3">
            What happens next?
          </p>
          <ul className="space-y-2">
            {[
              'Your suggestion is saved privately — no email blast, no spam.',
              'We review all submissions weekly and tag high-priority requests.',
              'If you left your email, we\'ll reach out when your suggestion ships.',
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-black text-brand mt-0.5">
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

    </div>
  )
}
