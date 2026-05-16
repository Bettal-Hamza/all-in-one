import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles, Lock, Zap, Heart,
  Globe, ArrowRight, ShieldCheck, BadgeCheck,
} from 'lucide-react'
import SEOManager from '../components/SEOManager.jsx'
import { LIVE_TOOLS } from '../constants/tools.js'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})

const VALUES = [
  {
    Icon: Lock,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
    accent: '#4F46E5',
    title: 'Privacy by Architecture',
    body: 'We don\'t ask you to trust our privacy policy — we make trust unnecessary. Every tool on Toolyy runs entirely inside your browser. There is no server that could receive your files even if we wanted it to. Your documents, photos, and data belong to you alone.',
  },
  {
    Icon: Zap,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    accent: '#F59E0B',
    title: 'No Upload Wait, No Queue',
    body: 'Because processing happens in your browser, there\'s no upload step, no server queue, and no bandwidth bottleneck. A 50-page PDF splits in under two seconds. A 4K image converts instantly. Speed isn\'t a premium feature — it\'s the default.',
  },
  {
    Icon: Heart,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    accent: '#EF4444',
    title: 'Radically Free, Forever',
    body: 'No subscriptions. No paywalls. No "free tier" that quietly locks the features you actually need. Every tool on Toolyy is free to use for personal or commercial projects. We sustain the project through unobtrusive advertising, not by charging for access.',
  },
  {
    Icon: Globe,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    accent: '#10B981',
    title: 'Works Everywhere',
    body: 'Toolyy is a web app — which means it works on any device with a modern browser. iPhone, Android, Windows, Mac, Linux. No app to install, no OS version to worry about. Just open the page and start working.',
  },
]

const STATS = [
  { value: String(LIVE_TOOLS.length), label: 'live tools' },
  { value: '0',                        label: 'bytes uploaded' },
  { value: '100%',                     label: 'free to use' },
  { value: '∞',                        label: 'file size cap' },
]

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title="About Toolyy — Free, Private Browser Tools for Everyone"
        description="Toolyy was built because every online file tool required an upload. We built an alternative: powerful utilities that run entirely in your browser, for free, forever."
        appName="About Toolyy"
        appDescription="The story behind Toolyy — free, private, browser-based file utilities built for everyone."
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/15 mb-5">
          <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-brand">Our Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.1] mb-5">
          Powerful tools should be&nbsp;
          <span className="text-brand">free</span> and&nbsp;
          <span className="text-brand">private</span> — for everyone.
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed text-lg">
          We built Toolyy because we were tired of the same uncomfortable choice: use a capable
          online tool and hand over your files, or pay for software you\'ll use twice a year.
          There had to be a better way.
        </p>
      </motion.div>

      {/* ── The problem ──────────────────────────────────────── */}
      <motion.div {...fadeUp(0.08)} className="mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-glass">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-4">
                The Problem
              </p>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-4">
                Every tool wanted your files. We thought that was wrong.
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Think about the last time you needed to split a PDF, convert a photo, or remove a
                background. Chances are you searched online, landed on a site, and uploaded your file
                to a server you knew nothing about. Who runs it? Where is your data stored? Is it
                retained, analysed, or sold?
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Most of the time you had no idea — and you clicked "convert" anyway, because you
                needed to get the job done. We felt that too. And we decided to fix it.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: 'Your file leaves your device',   bad: true  },
                { label: 'Server logs your IP and file',   bad: true  },
                { label: 'Data retention policy: unknown', bad: true  },
                { label: 'Paywalled after 2 free uses',    bad: true  },
                { label: 'Toolyy: none of the above',   bad: false },
              ].map(({ label, bad }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                    bad
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    bad ? 'bg-red-200 text-red-600' : 'bg-emerald-200 text-emerald-600'
                  }`}>
                    {bad ? '✕' : '✓'}
                  </span>
                  {label}
                </div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>

      {/* ── The insight ──────────────────────────────────────── */}
      <motion.div {...fadeUp(0.12)} className="mb-10">
        <div className="bg-brand rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-4">
              The Insight
            </p>
            <h2 className="text-2xl font-black tracking-tight mb-4">
              Modern browsers are already powerful enough. We just had to use them.
            </h2>
            <p className="text-sm text-white/75 leading-relaxed mb-4">
              The JavaScript runtime inside your browser has access to the File API, Web Workers,
              WebAssembly, and the Canvas API. Combined, these can perform the same file operations
              that online tools have been using servers for — splitting PDFs, converting image
              formats, running neural network inference for background removal.
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              We built Toolyy to bring these capabilities together in one place, for free, with
              no server in the middle. Your file goes in, your result comes out, and nothing ever
              touches our infrastructure.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Values ───────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.16)} className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <BadgeCheck aria-hidden="true" className="w-5 h-5 text-brand" />
          <h2 className="text-xl font-black text-gray-900">What we stand for</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map(({ Icon, iconColor, iconBg, title, body }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass group hover:shadow-glass-lg hover:border-gray-200 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon aria-hidden="true" className={`w-5 h-5 ${iconColor}`} />
              </div>
              <h3 className="text-sm font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.22)} className="mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl px-8 py-6 shadow-glass">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {STATS.map(({ value, label }, i) => (
              <div key={i} className="text-center px-4 py-2">
                <p className="text-3xl font-black text-gray-900 tabular-nums">{value}</p>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── What's coming ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.26)} className="mb-10">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
          <p className="text-xs font-black uppercase tracking-widest text-gray-300 mb-4">
            What's Coming
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-3">
            We're just getting started.
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Our roadmap includes an MP4-to-MP3 audio extractor, a social media image resizer,
            a JSON formatter, and more. Every tool will follow the same principle: runs in your
            browser, free, no account required. If there's a utility you'd like to see,
            we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white font-extrabold text-sm rounded-2xl shadow-lg hover:bg-brand-light transition-colors"
            >
              Explore the tools
              <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
            <Link
              to="/feedback"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 font-extrabold text-sm rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              Suggest a tool
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── Privacy pledge ───────────────────────────────────── */}
      <motion.div {...fadeUp(0.3)}>
        <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
          <ShieldCheck aria-hidden="true" className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-emerald-800 mb-1">Our privacy commitment</p>
            <p className="text-sm text-emerald-700 leading-relaxed">
              We will never introduce server-side file processing without making it opt-in,
              clearly labelled, and accompanied by a prominent privacy notice. The default will
              always be client-side. That's a promise we're making publicly, not just in the fine print.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
