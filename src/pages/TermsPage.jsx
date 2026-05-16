import { motion } from 'framer-motion'
import {
  Scale, FileText, ShieldCheck, Ban,
  Copyright, AlertTriangle, Gavel, RefreshCw,
} from 'lucide-react'
import SEOManager from '../components/SEOManager.jsx'

const EFFECTIVE_DATE = 'May 14, 2026'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
})

const SECTIONS = [
  {
    Icon: FileText,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
    heading: 'Acceptance of Terms',
    paragraphs: [
      'By accessing or using Toolyy (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.',
      'These Terms apply to all visitors and users. Toolyy reserves the right to update these Terms at any time. Continued use of the Service after any change constitutes acceptance of the new Terms.',
    ],
  },
  {
    Icon: ShieldCheck,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    heading: 'Description of Service',
    paragraphs: [
      'Toolyy is a collection of free, browser-based utility tools (including but not limited to PDF splitters, image converters, and AI-powered image tools). The Service is provided at no charge to users.',
      'All file processing on Toolyy is performed client-side, meaning your files are processed entirely within your web browser. Toolyy\'s servers do not receive, store, or process the content of any files you work with. The Service requires a modern web browser and an active internet connection to load the application; file processing itself does not require an internet connection once the page has loaded.',
    ],
  },
  {
    Icon: Scale,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    heading: 'Permitted Use',
    paragraphs: [
      'You may use the Service for any lawful personal or commercial purpose. You may process your own files or files for which you hold the necessary rights or permissions.',
      'Toolyy grants you a limited, non-exclusive, non-transferable licence to access and use the Service for these permitted purposes, subject to these Terms.',
    ],
  },
  {
    Icon: Ban,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    heading: 'Prohibited Use',
    paragraphs: [
      'You may not use the Service to process files that contain illegal content, including but not limited to content that infringes third-party intellectual property rights, child sexual abuse material, or material that facilitates illegal activity.',
      'You may not attempt to reverse-engineer, scrape, or otherwise extract the Service\'s source code, except to the extent permitted by applicable law. You may not use automated scripts or bots to interact with the Service in ways that place unreasonable load on Toolyy\'s infrastructure or third-party content delivery networks.',
    ],
  },
  {
    Icon: Copyright,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    heading: 'Intellectual Property',
    paragraphs: [
      'Toolyy\'s name, logo, user interface design, and original code are the intellectual property of Toolyy and its developers. Nothing in these Terms grants you ownership of any Toolyy intellectual property.',
      'Toolyy integrates open-source libraries (including pdf-lib, @imgly/background-removal, Framer Motion, and Lucide Icons) under their respective open-source licences. Your use of the Service does not grant you any rights under those licences beyond what those licences themselves provide.',
      'You retain all rights to any files you process using the Service. Toolyy makes no claim over the output of any file processing operation.',
    ],
  },
  {
    Icon: AlertTriangle,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    heading: 'Disclaimer of Warranties',
    paragraphs: [
      'The Service is provided "AS IS" and "AS AVAILABLE" without any warranty of any kind, express or implied. Toolyy does not warrant that the Service will be uninterrupted, error-free, or that the output of any file processing operation will meet your specific requirements.',
      'You use the Service at your own risk. Toolyy strongly recommends keeping original copies of all files you process through the Service.',
    ],
  },
  {
    Icon: Gavel,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    heading: 'Limitation of Liability',
    paragraphs: [
      'To the fullest extent permitted by applicable law, Toolyy and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of data, loss of profits, or loss of goodwill — arising from your use of or inability to use the Service, even if Toolyy has been advised of the possibility of such damages.',
      'Toolyy\'s total aggregate liability to you for any claim arising from these Terms or your use of the Service shall not exceed the greater of (i) USD $10 or (ii) the amount you paid Toolyy in the twelve months preceding the claim (which, for a free service, will be zero).',
    ],
  },
  {
    Icon: RefreshCw,
    iconColor: 'text-sky-500',
    iconBg: 'bg-sky-50',
    heading: 'Governing Law & Changes',
    paragraphs: [
      'These Terms shall be governed by and construed in accordance with applicable law in the jurisdiction where Toolyy operates. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.',
      'Toolyy reserves the right to modify, suspend, or discontinue the Service (or any part thereof) at any time with or without notice. We also reserve the right to modify these Terms at any time. The effective date above reflects when these Terms were last updated.',
      'Questions about these Terms? Contact us at legal@toolyy.net',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SEOManager
        title="Terms of Service — Toolyy Free Browser Utilities"
        description="Read Toolyy's Terms of Service. Free browser-based file utilities, no server uploads, standard usage rights for personal and commercial use."
        appName="Toolyy Terms of Service"
        appDescription="Terms governing the use of Toolyy's free browser-based utility tools."
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
          <Scale aria-hidden="true" className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-indigo-600">Terms of Service</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-3">
          Fair rules for a free tool.
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
          Toolyy is free to use for personal and commercial purposes. These Terms set out your
          rights and ours — written to be readable, not just legally safe.
        </p>
        <p className="mt-4 text-xs text-gray-300 font-medium">
          Effective date: {EFFECTIVE_DATE}
        </p>
      </motion.div>

      {/* ── Key points callout ───────────────────────────────── */}
      <motion.div {...fadeUp(0.08)} className="mb-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">Key Points</p>
          <ul className="space-y-2">
            {[
              'Use Toolyy for any lawful personal or commercial purpose — free.',
              'Your files are processed in your browser. Toolyy never receives or stores your file content.',
              'You keep all rights to your files and their output.',
              'The service is provided as-is; keep backups of anything important.',
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-indigo-700">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── Terms sections ───────────────────────────────────── */}
      <motion.div {...fadeUp(0.14)} className="space-y-4">
        {SECTIONS.map(({ Icon, iconColor, iconBg, heading, paragraphs }, i) => (
          <section
            key={i}
            aria-labelledby={`terms-section-${i}`}
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon aria-hidden="true" className={`w-4 h-4 ${iconColor}`} />
              </div>
              <h2
                id={`terms-section-${i}`}
                className="text-base font-extrabold text-gray-900"
              >
                {heading}
              </h2>
            </div>
            <div className="pl-11 space-y-3">
              {paragraphs.map((p, j) => (
                <p key={j} className="text-sm text-gray-500 leading-relaxed">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </motion.div>

    </div>
  )
}
