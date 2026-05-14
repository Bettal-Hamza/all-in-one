import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <h1 className="text-2xl font-semibold text-brand-text">Page Not Found</h1>
      <Link to="/" className="text-brand text-sm hover:underline">
        Go back home
      </Link>
    </div>
  )
}
