import { motion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import FAQSchema from '../FAQSchema.jsx'

/*
 * Uses native <details>/<summary> elements so the answer text lives in the DOM
 * even when collapsed — Google crawls it and indexes it in full.
 * No JavaScript accordion logic needed; the browser handles open/close natively.
 * The `group` + `group-open:` Tailwind modifiers target the [open] attribute
 * that <details> sets automatically when expanded.
 */

const FAQS = [
  {
    q: 'Are my files saved anywhere?',
    a: 'No. Toolyy operates on a strict client-side architecture — your files are never transmitted to any server. All processing happens locally in your browser using the File API, WebAssembly, and Web Workers. The moment you close the tab, any processed data is cleared from memory. There is no backend database, no file storage layer, and no log of your activity.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'There is no server-imposed file size limit, because your files never reach a server. The practical ceiling is your device\'s available RAM. Most modern computers and smartphones comfortably handle files up to several hundred megabytes. Very large files (500 MB or more) may take slightly longer on older hardware, but they will process successfully. A 300-page PDF or a 50 MB image is well within normal operating range.',
  },
  {
    q: 'What browsers are supported?',
    a: 'Toolyy works in any modern browser that supports the Web APIs it relies on — specifically WebAssembly, the File API, and Web Workers. This includes Google Chrome 90+, Mozilla Firefox 88+, Apple Safari 15+, and Microsoft Edge 90+. All major mobile browsers (Safari on iOS and Chrome on Android) are fully supported. Internet Explorer is not supported.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Toolyy requires no account, no email address, and no sign-in of any kind. Open the page, use the tool, and close the tab. We collect no personally identifiable information and have no user database. Your usage is entirely anonymous.',
  },
  {
    q: 'Can I use Toolyy for commercial projects?',
    a: 'Yes — Toolyy is free for both personal and commercial use. There are no licensing fees, no attribution requirements, and no usage caps. You own all rights to any output produced by the tools. See our Terms of Service for the complete details.',
  },
  {
    q: 'How does AI background removal work without uploading my photo?',
    a: 'The background-removal tool downloads a compact neural network model (served once from a CDN, then cached in your browser) and runs inference locally using WebAssembly. Your photo is fed into the model inside your browser tab — pixel data is processed in memory and never transmitted. The resulting transparent PNG is generated locally and offered as a download, with nothing ever reaching a remote server.',
  },
]

export default function ExpertFAQ() {
  return (
    <>
    <FAQSchema faqs={FAQS} />
    <section
      aria-labelledby="faq-heading"
      className="max-w-6xl mx-auto px-4 py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

        {/* ── Left: label + heading ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="lg:sticky lg:top-24"
        >
          <p className="text-xs font-black uppercase tracking-widest text-brand mb-3">
            Expert FAQ
          </p>
          <h2
            id="faq-heading"
            className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-4"
          >
            Questions,<br />answered.
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Everything you need to know about how Toolyy works, what it processes, and what it
            never does with your data.
          </p>

          <div className="mt-6 flex items-center gap-2.5 px-4 py-3 bg-brand/5 rounded-2xl border border-brand/10">
            <HelpCircle aria-hidden="true" className="w-4 h-4 text-brand flex-shrink-0" />
            <p className="text-xs font-semibold text-brand/80">
              Still have a question?{' '}
              <a href="mailto:hello@toolyy.net" className="underline underline-offset-2 hover:text-brand transition-colors">
                Email us
              </a>
            </p>
          </div>
        </motion.div>

        {/* ── Right: accordion ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-glass divide-y divide-gray-100 overflow-hidden"
        >
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group px-6">
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors duration-150">
                  {q}
                </span>
                <ChevronDown
                  className="w-4 h-4 flex-shrink-0 text-gray-300 transition-transform duration-300 group-open:rotate-180 group-hover:text-brand"
                  aria-hidden="true"
                />
              </summary>
              {/* Answer lives in the DOM even when collapsed — Google indexes it */}
              <p className="text-sm text-gray-500 leading-relaxed pb-5 pr-6">
                {a}
              </p>
            </details>
          ))}
        </motion.div>

      </div>
    </section>
    </>
  )
}
