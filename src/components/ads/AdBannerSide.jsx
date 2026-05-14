export default function AdBannerSide() {
  return (
    <div
      className="w-[300px] h-[600px] bg-surface border border-dashed border-surface-border rounded-xl flex items-center justify-center sticky top-20"
      aria-label="Advertisement placeholder"
    >
      <span className="text-xs font-medium text-brand-muted tracking-wide uppercase">
        Advertisement
      </span>
    </div>
  )
}
