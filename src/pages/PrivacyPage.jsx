import { motion } from 'framer-motion'
import {
  ShieldCheck, Server, Eye, Cookie,
  Lock, Globe, Mail,
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
    Icon: Server,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
    heading: 'No Server Processing — Ever',
    paragraphs: [
      'Toolyy is built on a strict client-side architecture. Every operation — splitting a PDF, converting an image, removing a background — is executed entirely inside your web browser using JavaScript, the File API, Web Workers, and WebAssembly. Your files are never transmitted to Toolyy\'s servers, or to any third-party server, at any point during or after processing.',
      'This is a deliberate architectural choice, not a promise that could be silently broken in a future update. The application has no server endpoint capable of receiving file data. What cannot be transmitted cannot be leaked, stored, or misused.',
    ],
  },
  {
    Icon: Eye,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    heading: 'Information We Collect',
    paragraphs: [
      'We do not collect, process, or retain the content of any file you work with on Toolyy.',
      'Toolyy may collect anonymous, aggregated usage statistics — such as which tool pages are visited and general browser/device type information — via analytics providers, solely to understand how to improve the service. These statistics are non-identifying, cannot be linked to you or your files, and are never sold to third parties.',
    ],
  },
  {
    Icon: Cookie,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    heading: 'Cookies & Local Storage',
    paragraphs: [
      'Toolyy uses your browser\'s localStorage to remember which tools you have used recently, so your "Recent Tools" list persists between visits. This data lives exclusively on your device and is never transmitted anywhere. You can clear it at any time by clearing your browser\'s site data.',
      'First-party cookies: Toolyy sets no first-party cookies of its own. Third-party services integrated into Toolyy — such as Google Fonts and advertising partners — may set their own cookies, governed by their respective privacy policies. You can control cookie preferences through your browser settings.',
    ],
  },
  {
    Icon: Globe,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    heading: 'Third-Party Services',
    paragraphs: [
      'Google Fonts: Toolyy loads the Sora typeface from Google Fonts. Google\'s servers may log your IP address and browser information when serving font files. See the Google Privacy Policy for details.',
      'Advertising: Display ads on Toolyy may be served by Google AdSense or similar ad networks, which may use cookies and device identifiers to serve interest-based ads. You can opt out of personalised advertising via the IAB\'s YourAdChoices platform or your browser\'s privacy controls.',
      'In no case is any file content or personally identifiable information shared with these or any other third parties by Toolyy.',
    ],
  },
  {
    Icon: Lock,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
    heading: 'Your Rights (GDPR & CCPA)',
    paragraphs: [
      'Because Toolyy does not collect or process personal data about you, most data-subject rights (access, rectification, erasure, portability) are moot in the traditional sense — there is simply no record of your data to act upon.',
      'If you are a resident of the European Economic Area, the United Kingdom, or California, and have specific concerns about data associated with third-party services operating on Toolyy, please contact us and we will help you exercise your rights with the relevant provider.',
    ],
  },
  {
    Icon: Mail,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    heading: 'Changes to This Policy & Contact',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our services or applicable law. The effective date at the top of this page will always reflect when the policy was last revised. Continued use of Toolyy after changes are posted constitutes your acceptance of the revised policy. We will not use your data in ways that are materially inconsistent with the policy in effect when the data was collected.',
      'Questions or concerns? Reach us at privacy@toolyy.net — we aim to respond within five business days.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SEOManager
        title="Privacy Policy | Zero Uploads, Zero Data Retention"
        description="Toolyy never uploads your files. All processing is 100% client-side in your browser. No cookies, no analytics fingerprinting, no personal data collected."
        appName="Toolyy Privacy Policy"
        appDescription="Toolyy processes every file locally in your browser. No server uploads, no data retention, no personal data collected."
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-5">
          <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-emerald-600">Privacy Policy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-3">
          Your privacy, by design.
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
          Toolyy processes every file inside your browser. Your documents never leave your
          device — not because we promise it, but because the architecture makes it impossible.
        </p>
        <p className="mt-4 text-xs text-gray-300 font-medium">
          Effective date: {EFFECTIVE_DATE}
        </p>
      </motion.div>

      {/* ── Client-side callout ──────────────────────────────── */}
      <motion.div {...fadeUp(0.08)} className="mb-8">
        <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
          <ShieldCheck aria-hidden="true" className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-emerald-800 mb-1">
              100% Client-Side Processing
            </p>
            <p className="text-sm text-emerald-700 leading-relaxed">
              All file operations on Toolyy — PDF splitting, image conversion, AI background
              removal — run entirely in your browser using JavaScript and WebAssembly. No file data
              is transmitted to any server at any time. This is enforced by the application's
              architecture, not just policy.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Policy sections ──────────────────────────────────── */}
      <motion.div {...fadeUp(0.14)} className="space-y-4">
        {SECTIONS.map(({ Icon, iconColor, iconBg, heading, paragraphs }, i) => (
          <section
            key={i}
            aria-labelledby={`privacy-section-${i}`}
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon aria-hidden="true" className={`w-4 h-4 ${iconColor}`} />
              </div>
              <h2
                id={`privacy-section-${i}`}
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
