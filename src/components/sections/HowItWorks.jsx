import { motion } from 'framer-motion'
import { UploadCloud, Cpu, Download, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon: UploadCloud,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
    accentColor: '#4F46E5',
    title: 'Choose Your File',
    body: 'Drag and drop any supported file onto the tool, or click to open your file picker. Toolyy accepts PDFs, images (JPG, PNG, WebP), and more — directly from your device or cloud storage.',
  },
  {
    number: '02',
    Icon: Cpu,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    accentColor: '#7C3AED',
    title: 'Processed In Your Browser',
    body: 'The moment you select a file, processing begins — entirely inside your browser tab using WebAssembly and the Web Workers API. No upload, no server queue, no waiting. A 50-page PDF typically splits in under two seconds.',
  },
  {
    number: '03',
    Icon: Download,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    accentColor: '#059669',
    title: 'Save Your Result',
    body: 'Click to download individual files or grab everything at once with "Download All." Your output files are standard, fully compatible formats — no watermarks, no account required, and no strings attached.',
  },
]

export default function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="max-w-6xl mx-auto px-4 py-20"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-black uppercase tracking-widest text-brand mb-3">
          How It Works
        </p>
        <h2
          id="how-heading"
          className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900"
        >
          Three steps. Done.
        </h2>
        <p className="mt-3 text-gray-400 font-medium max-w-md mx-auto">
          No accounts, no configuration, no upload wait. Just open, process, and download.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">

        {STEPS.map(({ number, Icon, iconColor, iconBg, accentColor, title, body }, i) => (
          <div key={number} className="flex flex-col lg:flex-row items-stretch flex-1">

            {/* Step card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="flex-1 bg-white border border-gray-100 rounded-3xl p-8 shadow-glass relative overflow-hidden group"
            >
              {/* Large background step number */}
              <span
                aria-hidden="true"
                className="absolute -top-2 -right-1 text-[7rem] font-black leading-none select-none pointer-events-none"
                style={{ color: accentColor, opacity: 0.04 }}
              >
                {number}
              </span>

              {/* Step number pill */}
              <span
                className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-5"
                style={{ backgroundColor: accentColor + '14', color: accentColor }}
              >
                Step {number}
              </span>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                <Icon aria-hidden="true" className={`w-7 h-7 ${iconColor}`} strokeWidth={1.75} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </motion.div>

            {/* Connector arrow (between steps, not after last) */}
            {i < STEPS.length - 1 && (
              <div className="hidden lg:flex items-center justify-center w-10 flex-shrink-0">
                <ArrowRight aria-hidden="true" className="w-5 h-5 text-gray-200" />
              </div>
            )}
          </div>
        ))}

      </div>
    </section>
  )
}
