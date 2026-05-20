import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { TOOLS } from './constants/tools.js'

const PrivacyPage  = React.lazy(() => import('./pages/PrivacyPage.jsx'))
const TermsPage    = React.lazy(() => import('./pages/TermsPage.jsx'))
const AboutPage    = React.lazy(() => import('./pages/AboutPage.jsx'))
const FeedbackPage = React.lazy(() => import('./pages/FeedbackPage.jsx'))

// Only register routes for tools that are live and have a component
const toolRoutes = TOOLS
  .filter(t => t.live && t.component)
  .map(tool => ({
    path: tool.path,
    Component: React.lazy(tool.component),
  }))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative">
        {/* Indigo gradient blobs — sit above the dot pattern in body */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 12% -8%, rgba(79,70,229,0.08) 0%, transparent 60%), ' +
              'radial-gradient(ellipse 55% 40% at 88% 108%, rgba(99,102,241,0.06) 0%, transparent 60%)',
          }}
        />

        <ScrollToTop />
        <Header />

        <main className="flex-1 relative z-10 flex flex-col">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64 text-gray-300 font-semibold text-sm tracking-wide">
                Loading…
              </div>
            }
          >
            <Routes>
              <Route path="/"        element={<HomePage />} />
              <Route path="/about"    element={<AboutPage />} />
              <Route path="/privacy"  element={<PrivacyPage />} />
              <Route path="/terms"    element={<TermsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              {toolRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
