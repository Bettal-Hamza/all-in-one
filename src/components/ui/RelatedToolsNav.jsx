import { Link } from 'react-router-dom'
import { LIVE_TOOLS } from '../../constants/tools.js'

export default function RelatedToolsNav({ currentToolId }) {
  const others = LIVE_TOOLS.filter(t => t.id !== currentToolId)

  return (
    <nav aria-label="Browse all tools" className="mt-20 pt-10 border-t border-gray-100">
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-300 mb-4">
        Explore More Free Tools
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {others.map(tool => (
          <Link
            key={tool.id}
            to={tool.path}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-gray-100 hover:border-brand/30 hover:shadow-glass transition-all group"
          >
            <tool.Icon aria-hidden="true" className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-brand transition-colors" />
            <span className="text-xs font-bold text-gray-600 group-hover:text-brand transition-colors">
              {tool.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
