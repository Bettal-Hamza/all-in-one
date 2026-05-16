import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Lock, Server } from 'lucide-react'

const KEYWORD_CALLOUTS = [
  {
    Icon: ShieldCheck,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    keyword: 'Privacy-focused',
    detail: 'Architecture enforces privacy — no server can receive your files.',
  },
  {
    Icon: Zap,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    borderColor: 'border-indigo-100',
    keyword: 'No upload required',
    detail: 'Processing starts the instant you choose a file. Nothing is transmitted.',
  },
  {
    Icon: Lock,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-100',
    keyword: 'Secure file conversion',
    detail: 'Every transformation runs inside your browser tab, then disappears.',
  },
]

export default function UtilityPitch() {
  return (
    <section
      aria-labelledby="utility-heading"
      className="max-w-6xl mx-auto px-4 py-20 scroll-mt-16"
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-xs font-black uppercase tracking-widest text-brand mb-4"
      >
        The Toolyy Utility
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 items-start">

        {/* ── Left: heading + body copy (2 cols wide) ────────── */}
        <div className="lg:col-span-2">
          <motion.h2
            id="utility-heading"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.08] mb-8"
          >
            Browser-based tools are safer.<br />
            <span className="text-brand">Here's exactly why.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="space-y-5 text-[15px] text-gray-500 leading-[1.8]"
          >
            <p>
              When you upload a file to a cloud-based conversion service, you hand control of that
              document to a third party. The moment it leaves your browser, you have no way to verify
              where it is stored, who can access it, how long it is retained, or whether it will be
              used to train an AI model. For files containing financial records, medical data, legal
              correspondence, or proprietary business information, that is an unacceptable risk.
            </p>
            <p>
              Toolyy was designed from the ground up to be{' '}
              <strong className="text-gray-800 font-bold">privacy-focused</strong>. Every
              operation — whether you are splitting a 300-page contract, converting a confidential
              product photograph, or extracting audio from an internal company video — runs entirely
              inside your web browser using JavaScript, WebAssembly, and the Web Workers API.
              These are the same technologies that power video editors, 3D games, and code editors
              in the browser; they are fully capable of performing serious file processing without
              any server involvement.
            </p>
            <p>
              The practical consequence is simple:{' '}
              <strong className="text-gray-800 font-bold">no upload required</strong>. You select
              your file, the browser processes it, and you download the result. Nothing is
              transmitted across a network. Your internet connection is only needed once — to load
              Toolyy itself. After that, you could switch to aeroplane mode and every tool would
              continue to work.
            </p>
            <p>
              <strong className="text-gray-800 font-bold">Secure file conversion</strong> is not a
              feature toggle or a premium tier here — it is the only mode Toolyy operates in.
              There is no server-side fallback, no "faster cloud mode," and no opt-in upload option.
              The architecture makes data exfiltration structurally impossible, not just
              policy-prohibited.
            </p>
            <p>
              The result is a suite of powerful file utilities that rivals paid desktop software in
              capability while delivering something desktop software cannot: zero installation, zero
              accounts, and zero compromises on privacy. Whether you are an individual protecting
              personal documents or a business handling client data, Toolyy gives you the tools
              you need without the risks you shouldn't have to accept.
            </p>
          </motion.div>
        </div>

        {/* ── Right: keyword callout cards ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-col gap-4 lg:pt-[7.5rem]"
        >
          {KEYWORD_CALLOUTS.map(({ Icon, iconColor, iconBg, borderColor, keyword, detail }) => (
            <div
              key={keyword}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border bg-white ${borderColor} shadow-glass`}
            >
              <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon aria-hidden="true" className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div>
                <p className={`text-sm font-extrabold ${iconColor} mb-0.5`}>{keyword}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}

          {/* Zero-data stat */}
          <div className="mt-1 bg-gray-900 rounded-2xl p-5">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-5xl font-black text-white leading-none">0</span>
              <span className="text-2xl font-black text-brand leading-none mb-0.5">%</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-relaxed">
              of your data ever reaches<br />a Toolyy server
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
