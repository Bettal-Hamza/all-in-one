import { useEffect } from 'react'

/**
 * Injects a FAQPage JSON-LD block into <head> while the component is mounted,
 * then removes it on unmount. Google uses this schema to render rich FAQ
 * snippets directly in search results (accordion-style Q&A beneath the listing).
 *
 * Spec: https://schema.org/FAQPage
 * Google guidance: https://developers.google.com/search/docs/appearance/structured-data/faqpage
 *
 * Rules Google enforces:
 *  - Questions and answers must be visible on the page (our <details> tags satisfy this).
 *  - Text must match what the user sees — do not stuff keywords.
 *  - Limit: Google typically shows 2–3 rich results per page from FAQPage schema.
 */
export default function FAQSchema({ faqs }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: a,
        },
      })),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-faq-schema', 'true')
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)

    return () => script.remove()
  }, [faqs])

  return null
}
