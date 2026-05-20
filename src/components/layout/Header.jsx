import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <img
            src="/toolyy-logo.png"
            alt="Toolyy"
            width="55"
            height="32"
            className="group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-gray-900 tracking-tight">Toolyy</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/70 transition-all"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-3 py-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/70 transition-all"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
