import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, ArrowUpRight } from 'lucide-react'
import { LIVE_TOOLS } from '../../constants/tools.js'

const COMPANY_LINKS = [
  { to: '/about',    label: 'About Toolyy' },
  { to: '/feedback', label: 'Suggest a Tool'  },
]

const LEGAL_LINKS = [
  { to: '/privacy',     label: 'Privacy Policy' },
  { to: '/terms',       label: 'Terms of Service' },
  { href: '/sitemap.xml', label: 'Tools Sitemap', external: true },
]

const TRUST_BADGES = [
  { Icon: ShieldCheck, text: 'No uploads'    },
  { Icon: Zap,         text: 'Instant results' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">

      {/* ── Fat footer body ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Col 1: Brand ────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 group mb-4">
              <img
                src="/logo-icon-lg.png"
                alt="Toolyy"
                width="82"
                height="48"
                loading="lazy"
                className="group-hover:scale-105 transition-transform"
              />
              <span className="font-extrabold text-gray-900 tracking-tight text-lg">Toolyy</span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Free, private browser utilities for PDFs, images, and more. Your files are processed
              entirely on your device — no upload, no account, no cost.
            </p>

            <div className="flex flex-col gap-2">
              {TRUST_BADGES.map(({ Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400">
                  <Icon aria-hidden="true" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Col 2: Live Tools ────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-4">
              Live Tools
            </p>
            <nav aria-label="Live tools navigation">
              <ul className="space-y-2.5">
                {LIVE_TOOLS.map(tool => (
                  <li key={tool.id}>
                    <Link
                      to={tool.path}
                      className="text-sm font-medium text-gray-500 hover:text-brand transition-colors duration-150"
                    >
                      {tool.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Col 3: Company ───────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-4">
              Company
            </p>
            <nav aria-label="Company navigation">
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm font-medium text-gray-500 hover:text-brand transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Col 4: Legal ─────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-4">
              Legal
            </p>
            <nav aria-label="Legal navigation">
              <ul className="space-y-2.5">
                {LEGAL_LINKS.map(({ to, href, label, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand transition-colors duration-150"
                      >
                        {label}
                        <ArrowUpRight aria-hidden="true" className="w-3 h-3 text-gray-300" />
                      </a>
                    ) : (
                      <Link
                        to={to}
                        className="text-sm font-medium text-gray-500 hover:text-brand transition-colors duration-150"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────── */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-300 font-medium">
            © {new Date().getFullYear()} Toolyy. All rights reserved.
          </p>
          <p className="text-xs text-gray-300 font-medium flex items-center gap-1.5">
            <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-400" />
            Zero bytes of your data ever reach our servers.
          </p>
        </div>
      </div>

    </footer>
  )
}
