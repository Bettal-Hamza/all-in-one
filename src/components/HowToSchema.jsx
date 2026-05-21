import { useEffect } from 'react'

export default function HowToSchema({ name, description, steps, totalTime }) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name,
      description,
      step: steps.map((text) => ({
        '@type': 'HowToStep',
        text,
      })),
      ...(totalTime && { totalTime }),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-howto-schema', 'true')
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)

    return () => script.remove()
  }, [name, description, steps, totalTime])

  return null
}
