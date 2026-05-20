import { lazy, Suspense } from 'react'
import Hero        from '../components/Hero.jsx'
import TrustBar    from '../components/ui/TrustBar.jsx'
import BentoGrid   from '../components/BentoGrid.jsx'
import SEOManager  from '../components/SEOManager.jsx'

const UtilityPitch = lazy(() => import('../components/sections/UtilityPitch.jsx'))
const ToolCatalog  = lazy(() => import('../components/sections/ToolCatalog.jsx'))
const HowItWorks   = lazy(() => import('../components/sections/HowItWorks.jsx'))
const ExpertFAQ    = lazy(() => import('../components/sections/ExpertFAQ.jsx'))

function Divider() {
  return <div aria-hidden="true" className="border-t border-gray-100 mx-4 lg:mx-8" />
}

function SectionFallback() {
  return <div className="h-48" />
}

export default function HomePage() {
  return (
    <div>
      <SEOManager
        title="Minimalist Developer & Consumer Utility Hub"
        description="Access clean, fast, privacy-first web utilities. Convert formats, compress assets, and format data instantly in your browser with zero server uploads."
        canonicalPath="/"
      />
      {/* Above-the-fold — loads immediately, no framer-motion */}
      <Hero />
      <TrustBar />
      <BentoGrid />

      {/* Below-the-fold — lazy-loaded with framer-motion only when scrolled */}
      <Suspense fallback={<SectionFallback />}>
        <Divider />
        <UtilityPitch />
        <ToolCatalog />
        <Divider />
        <HowItWorks />
        <Divider />
        <ExpertFAQ />
      </Suspense>
    </div>
  )
}
