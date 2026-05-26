/**
 * prerender-seo.js
 *
 * Generates static HTML files for each tool route so that AI crawlers
 * (OAI-SearchBot, GPTBot, ClaudeBot, etc.) and search engines see
 * real text content without needing to execute JavaScript.
 *
 * Run after `vite build`:  node scripts/prerender-seo.js
 * Hooked via "postbuild" in package.json.
 *
 * How it works:
 *   1. Reads dist/index.html (the Vite build output)
 *   2. For each tool route, creates dist/tools/<id>/index.html
 *   3. Each file contains the same JS/CSS refs (so React still boots)
 *      but also has the tool's critical SEO content baked into the HTML
 *   4. Express.static serves these before the SPA fallback
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { SEO_ALIASES } from '../src/constants/seo-aliases.js'
import { TOOLS } from '../src/constants/tools.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'dist')
const BASE_URL = (process.env.SITE_URL || 'https://toolyy.net').replace(/\/$/, '')

const template = readFileSync(resolve(DIST, 'index.html'), 'utf-8')

const toolLabelById = Object.fromEntries(TOOLS.map(t => [t.id, t.label]))

const TOOLS_SEO = [
  {
    path: 'tools/pdf-splitter',
    title: 'Free PDF Splitter Online | Extract Pages Instantly | Toolyy',
    description: 'Split files and extract specific pages from your PDF documents completely client-side. Fast, safe, and works entirely in your browser without uploading data.',
    h1: 'Free PDF Splitter Online',
    intro: "Toolyy's browser-based PDF splitter extracts every page of your document into a separate, download-ready PDF file — instantly, privately, and at no cost. No account required, no file size cap, no watermarks.",
    steps: [
      'Go to toolyy.net and select the PDF Splitter tool.',
      'Drag and drop your PDF file into the browser workspace.',
      'Select the page ranges you want to extract and click download.',
    ],
    faqs: [
      { q: 'How can I split a PDF file for free without an account?', a: 'You can split a PDF instantly by dropping your file into Toolyy.net. The tool runs completely inside your browser locally, meaning your data never uploads to a server.' },
      { q: 'Is it safe to use this Free PDF Splitter?', a: 'Absolutely. All processing happens locally in your browser using JavaScript. Your document never leaves your device.' },
      { q: 'What is the maximum file size?', a: "No server-side limit. The practical limit is your device's RAM. Most devices handle PDFs up to several hundred megabytes." },
      { q: 'Does this PDF tool work on mobile?', a: 'Yes — works on any modern browser including Safari on iPhone and Chrome on Android.' },
      { q: 'Can I merge selected pages into one PDF?', a: 'Yes. After splitting, select pages and choose "Merged PDF" to combine them into a single file.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Split PDF Pages Free Online',
      description: 'Split any PDF document into separate pages natively inside your browser using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the PDF Splitter tool.' },
        { '@type': 'HowToStep', text: 'Drag and drop your PDF file into the browser workspace.' },
        { '@type': 'HowToStep', text: 'Select the page ranges you want to extract and click download.' },
      ],
      totalTime: 'PT1M',
    },
    relatedTools: ['image-converter', 'background-remover', 'mp4-to-mp3'],
  },
  {
    path: 'tools/image-converter',
    title: 'Image to WebP Converter Online | Compress & Optimize | Toolyy',
    description: 'Convert JPG and PNG images to modern WebP format and reduce file sizes by up to 80%. Adjustable quality, and processed entirely in your browser.',
    h1: 'Image to WebP Converter',
    intro: 'Convert JPG and PNG images to WebP format for faster, leaner websites. Adjustable quality slider, zero uploads, and instant results — all inside your browser.',
    steps: [
      'Go to toolyy.net and select the Image to WebP converter.',
      'Drag and drop your JPG or PNG image into the browser workspace.',
      'Adjust the quality slider to balance size and fidelity, then download your WebP file.',
    ],
    faqs: [
      { q: 'Why should I convert images to WebP format?', a: 'WebP produces 25–34% smaller files than JPEG and up to 80% smaller than PNG at equivalent quality. Smaller images mean faster page loads and better Core Web Vitals.' },
      { q: 'Is there a file size limit for conversion?', a: "No server-side limit. All conversion happens inside your browser using the Canvas API. Most devices handle images up to 30–40 megapixels." },
      { q: 'Do all browsers support WebP?', a: 'Yes — WebP has 97%+ global browser support including Chrome, Firefox, Safari 14+, and Edge.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Convert Images to WebP Free Online',
      description: 'Convert JPG and PNG images to modern WebP format for faster websites using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the Image to WebP converter.' },
        { '@type': 'HowToStep', text: 'Drag and drop your JPG or PNG image into the browser workspace.' },
        { '@type': 'HowToStep', text: 'Adjust the quality slider to balance size and fidelity, then download your WebP file.' },
      ],
      totalTime: 'PT30S',
    },
    relatedTools: ['background-remover', 'social-resizer', 'pdf-splitter'],
  },
  {
    path: 'tools/qr-generator',
    title: 'QR Code Generator Online | Create & Download Instantly | Toolyy',
    description: 'Generate scannable QR codes from URLs, text, Wi-Fi credentials, or phone numbers. Customizable colors, high-res PNG download, and zero data collection.',
    h1: 'QR Code Generator',
    intro: 'Generate scannable QR codes from any URL, text, Wi-Fi credentials, or phone number. Customizable styles, instant PNG download, and completely private — your data never leaves your device.',
    steps: [
      'Go to toolyy.net and select the QR Code Generator.',
      'Paste your URL, text, or Wi-Fi credentials into the input field.',
      'Choose your style and download the QR code as a high-res PNG.',
    ],
    faqs: [
      { q: 'Are my QR codes stored on a server?', a: 'No. QR codes are generated entirely inside your browser. Your data never leaves your device.' },
      { q: 'Do QR codes generated here ever expire?', a: 'Never. The destination is encoded directly into the QR pattern with no middleman server.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Generate a QR Code Free Online',
      description: 'Create scannable QR codes from any URL, text, or Wi-Fi credentials instantly using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the QR Code Generator.' },
        { '@type': 'HowToStep', text: 'Paste your URL, text, or Wi-Fi credentials into the input field.' },
        { '@type': 'HowToStep', text: 'Choose your style and download the QR code as a high-res PNG.' },
      ],
      totalTime: 'PT15S',
    },
    relatedTools: ['background-remover', 'unit-converter', 'social-resizer'],
  },
  {
    path: 'tools/background-remover',
    title: 'AI Background Remover Online | Remove Backgrounds Instantly | Toolyy',
    description: 'Erase image backgrounds in seconds using on-device AI powered by WebAssembly. No uploads, no sign-up, and outputs clean transparent PNGs.',
    h1: 'AI Background Remover',
    intro: 'Remove backgrounds from photos instantly using on-device AI. The neural network runs entirely in your browser via WebAssembly — no uploads, no server, complete privacy. Outputs lossless transparent PNGs.',
    steps: [
      'Go to toolyy.net and select the Background Remover tool.',
      'Drag and drop your JPG, PNG, or WebP photo into the workspace.',
      'The AI processes your image locally, then download the transparent PNG result.',
    ],
    faqs: [
      { q: 'Is my photo uploaded to a server?', a: "No. The background remover runs 100% in your browser using WebAssembly and ONNX Runtime. Your image never leaves your device." },
      { q: 'Does the AI work on all types of photos?', a: 'Yes — the model handles people, products, animals, objects, and most complex scenes with clear subject-to-background contrast.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Remove Image Backgrounds Free Online',
      description: 'Remove backgrounds from photos instantly using on-device AI at Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the Background Remover tool.' },
        { '@type': 'HowToStep', text: 'Drag and drop your JPG, PNG, or WebP photo into the workspace.' },
        { '@type': 'HowToStep', text: 'The AI processes your image locally, then download the transparent PNG result.' },
      ],
      totalTime: 'PT30S',
    },
    relatedTools: ['image-converter', 'social-resizer', 'qr-generator'],
  },
  {
    path: 'tools/json-formatter',
    title: 'JSON Formatter & Validator Online | Beautify & Minify | Toolyy',
    description: 'Paste or type raw JSON and instantly beautify, validate, or minify it with syntax highlighting and line-level error reporting. Runs in your browser.',
    h1: 'JSON Formatter & Validator',
    intro: 'Beautify, validate, and minify JSON with syntax highlighting and clear error reporting. Paste sensitive API keys and tokens safely — everything runs in your browser with zero server contact.',
    steps: [
      'Go to toolyy.net and select the JSON Formatter tool.',
      'Paste your raw JSON or drag a .json file into the editor.',
      'Click Beautify to format, Validate to check syntax, or Minify to compress — then copy or download.',
    ],
    faqs: [
      { q: 'Is my JSON data safe when using this formatter?', a: "Yes — everything processes directly in your browser. Your data is never sent to any server." },
      { q: 'Can this tool fix broken JSON?', a: 'The Validate button identifies syntax errors and their exact location. You fix the error based on the feedback, then Beautify works normally.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Format and Validate JSON Free Online',
      description: 'Beautify, validate, and minify JSON payloads instantly in your browser using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the JSON Formatter tool.' },
        { '@type': 'HowToStep', text: 'Paste your raw JSON or drag a .json file into the editor.' },
        { '@type': 'HowToStep', text: 'Click Beautify to format, Validate to check syntax, or Minify to compress — then copy or download.' },
      ],
      totalTime: 'PT15S',
    },
    relatedTools: ['pdf-splitter', 'unit-converter', 'mp4-to-mp3'],
  },
  {
    path: 'tools/social-resizer',
    title: 'Social Media Image Resizer | Crop for Every Platform | Toolyy',
    description: 'Resize and crop images to pixel-perfect dimensions for Instagram, TikTok, YouTube, LinkedIn, and X. Client-side processing keeps your photos private.',
    h1: 'Social Media Image Resizer',
    intro: 'Resize and crop images to exact pixel dimensions for Instagram Post (1080x1080), TikTok/Story (1080x1920), YouTube Thumbnail (1280x720), or any custom size. All processing happens in your browser.',
    steps: [
      'Go to toolyy.net and select the Social Resizer tool.',
      'Upload your image and choose a platform preset or enter a custom size.',
      'Adjust the crop area by dragging, then download your perfectly sized image.',
    ],
    faqs: [
      { q: 'What are the exact image sizes for social media platforms?', a: 'Instagram Post: 1080x1080px. TikTok/Instagram Story: 1080x1920px. YouTube Thumbnail: 1280x720px.' },
      { q: 'Is my photo uploaded to a server?', a: 'No. All resizing happens locally in your browser using the Canvas API. Your images never leave your device.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Resize Images for Social Media Free Online',
      description: 'Crop and resize images to pixel-perfect dimensions for Instagram, TikTok, and YouTube using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the Social Resizer tool.' },
        { '@type': 'HowToStep', text: 'Upload your image and choose a platform preset or enter a custom size.' },
        { '@type': 'HowToStep', text: 'Adjust the crop area by dragging, then download your perfectly sized image.' },
      ],
      totalTime: 'PT30S',
    },
    relatedTools: ['image-converter', 'background-remover', 'mp4-to-mp3'],
  },
  {
    path: 'tools/mp4-to-mp3',
    title: 'Convert MP4 to MP3 Audio Online | High-Quality Extractor | Toolyy',
    description: 'Extract crystal clear MP3 audio from any MP4 video natively in your browser. Fast conversion with zero file-size limitations or data tracking.',
    h1: 'MP4 to MP3 Converter',
    intro: 'Extract high-quality MP3 audio from MP4, WebM, MOV, AVI, and MKV video files entirely in your browser. Choose bitrates from 128 to 320 kbps. No uploads, no file-size limits, no data tracking.',
    steps: [
      'Go to toolyy.net and select the MP4 to MP3 converter.',
      'Drag and drop your video file into the workspace.',
      'Choose your preferred audio quality and wait for conversion.',
      'Download your extracted MP3 audio file.',
    ],
    faqs: [
      { q: 'Is my video uploaded to a server?', a: 'No. Conversion happens entirely in your browser using FFmpeg compiled to WebAssembly. Your file never leaves your device.' },
      { q: 'What video formats are supported?', a: 'MP4, WebM, MOV, AVI, and MKV. Most common video codecs (H.264, H.265, VP8, VP9, AV1) are supported.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Convert MP4 to MP3 Free Online',
      description: 'Extract high-quality MP3 audio from any video file directly in your browser using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the MP4 to MP3 converter.' },
        { '@type': 'HowToStep', text: 'Drag and drop your video file into the workspace.' },
        { '@type': 'HowToStep', text: 'Choose your preferred audio quality and wait for conversion.' },
        { '@type': 'HowToStep', text: 'Download your extracted MP3 audio file.' },
      ],
      totalTime: 'PT2M',
    },
    relatedTools: ['pdf-splitter', 'image-converter', 'qr-generator'],
  },
  {
    path: 'tools/unit-converter',
    title: 'Unit Converter Online | Length, Weight, Temperature & More | Toolyy',
    description: 'Convert between metric and imperial units across 8 categories — length, weight, temperature, area, volume, speed, data, and time. Instant results, 100% private.',
    h1: 'Unit Converter',
    intro: 'Convert between hundreds of metric and imperial units across 8 categories — length, weight, temperature, area, volume, speed, data, and time. Real-time results as you type, 100% private, no sign-up required.',
    steps: [
      'Go to toolyy.net and select the Unit Converter tool.',
      'Choose a category (length, weight, temperature, etc.) and select your source and target units.',
      'Type a value and see the converted result instantly.',
    ],
    faqs: [
      { q: 'Does the unit converter work offline?', a: 'Yes. Once the page loads, all conversions happen locally in your browser with zero server communication.' },
      { q: 'What unit categories are supported?', a: 'Length, weight, temperature, area, volume, speed, data storage, and time.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Convert Units Free Online',
      description: 'Convert between metric and imperial units for length, weight, temperature, and more using Toolyy.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the Unit Converter tool.' },
        { '@type': 'HowToStep', text: 'Choose a category and select your source and target units.' },
        { '@type': 'HowToStep', text: 'Type a value and see the converted result instantly.' },
      ],
      totalTime: 'PT10S',
    },
    relatedTools: ['json-formatter', 'social-resizer', 'pdf-splitter'],
  },
]

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildBreadcrumbSchema(pageName, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: BASE_URL + '/tools' },
      { '@type': 'ListItem', position: 3, name: pageName, item: canonical },
    ],
  }
}

function buildRelatedToolsHtml(relatedToolIds) {
  if (!relatedToolIds || relatedToolIds.length === 0) return ''
  const links = relatedToolIds
    .map(id => {
      const label = toolLabelById[id]
      if (!label) return null
      return `<li><a href="${BASE_URL}/tools/${id}">${escapeHtml(label)}</a></li>`
    })
    .filter(Boolean)
  if (links.length === 0) return ''
  return `\n      <h2>Related Free Tools</h2>\n      <ul>\n        ${links.join('\n        ')}\n      </ul>`
}

function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function buildSeoHtml(tool) {
  const canonical = `${BASE_URL}/${tool.path}`
  const breadcrumb = buildBreadcrumbSchema(tool.h1, canonical)
  const faqSchema  = buildFaqSchema(tool.faqs)
  const relatedHtml = buildRelatedToolsHtml(tool.relatedTools)

  return `
    <main>
      <nav aria-label="Breadcrumb" style="max-width:48rem;margin:0 auto;padding:1rem 1rem 0;font-size:.875rem;color:#6b7280">
        <a href="${BASE_URL}/">Home</a> &rsaquo; <a href="${BASE_URL}/">Tools</a> &rsaquo; <span>${escapeHtml(tool.h1)}</span>
      </nav>
      <article style="max-width:48rem;margin:0 auto;padding:1.5rem 1rem 2rem">
        <h1>${escapeHtml(tool.h1)}</h1>
        <p>${escapeHtml(tool.intro)}</p>

        <section>
          <h2>How It Works</h2>
          <ol>
            ${tool.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('\n            ')}
          </ol>
        </section>

        <section>
          <h2>Why Use Toolyy?</h2>
          <ul>
            <li><strong>100% Private</strong> &mdash; your files never leave your device. All processing runs locally in your browser.</li>
            <li><strong>No Account Required</strong> &mdash; no sign-up, no email, no login. Just open and use.</li>
            <li><strong>No File Size Limits</strong> &mdash; no artificial server caps. The only limit is your device&rsquo;s memory.</li>
            <li><strong>Completely Free</strong> &mdash; no premium tiers, no watermarks, no per-file fees.</li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          ${tool.faqs.map(f => `<details><summary><strong>${escapeHtml(f.q)}</strong></summary>\n          <p>${escapeHtml(f.a)}</p></details>`).join('\n          ')}
        </section>
        ${relatedHtml}
      </article>
    </main>
    <script type="application/ld+json">${JSON.stringify(tool.schema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb, null, 2)}</script>`
}

function buildAliasSeoHtml(alias) {
  const canonical = `${BASE_URL}${alias.path}`
  const breadcrumb = buildBreadcrumbSchema(alias.h1, canonical)
  const relatedHtml = buildRelatedToolsHtml(alias.relatedTools)

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${alias.h1} Online`,
    description: alias.description,
    step: alias.steps.map(text => ({ '@type': 'HowToStep', text })),
    totalTime: 'PT1M',
  }

  const faqSchema = buildFaqSchema(alias.faqs)

  return `
    <main>
      <nav aria-label="Breadcrumb" style="max-width:48rem;margin:0 auto;padding:1rem 1rem 0;font-size:.875rem;color:#6b7280">
        <a href="${BASE_URL}/">Home</a> &rsaquo; <a href="${BASE_URL}/">Tools</a> &rsaquo; <span>${escapeHtml(alias.h1)}</span>
      </nav>
      <article style="max-width:48rem;margin:0 auto;padding:1.5rem 1rem 2rem">
        <h1>${escapeHtml(alias.h1)}</h1>
        <p>${escapeHtml(alias.intro)}</p>

        <section>
          <h2>How It Works</h2>
          <ol>
            ${alias.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('\n            ')}
          </ol>
        </section>

        <section>
          <h2>Why Use Toolyy?</h2>
          <ul>
            <li><strong>100% Private</strong> &mdash; your files never leave your device. All processing runs locally in your browser.</li>
            <li><strong>No Account Required</strong> &mdash; no sign-up, no email, no login. Just open and use.</li>
            <li><strong>No File Size Limits</strong> &mdash; no artificial server caps. The only limit is your device&rsquo;s memory.</li>
            <li><strong>Completely Free</strong> &mdash; no premium tiers, no watermarks, no per-file fees.</li>
          </ul>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>
          ${alias.faqs.map(f => `<details><summary><strong>${escapeHtml(f.q)}</strong></summary>\n          <p>${escapeHtml(f.a)}</p></details>`).join('\n          ')}
        </section>
        ${relatedHtml}
      </article>
    </main>
    <script type="application/ld+json">${JSON.stringify(howToSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb, null, 2)}</script>`
}

let generated = 0

function writePage(pagePath, pageTitle, pageDesc, seoContent) {
  const dir = resolve(DIST, pagePath.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${escapeHtml(pageDesc)}"`,
    )
    .replace(
      /(<div id="root">)[\s\S]*?(<\/div>\s*<\/body>)/,
      `$1${seoContent}\n    $2`,
    )

  const fullUrl = pagePath.startsWith('/') ? `${BASE_URL}${pagePath}` : `${BASE_URL}/${pagePath}`
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${fullUrl}" />`,
  )

  writeFileSync(resolve(dir, 'index.html'), html, 'utf-8')
  generated++
}

for (const tool of TOOLS_SEO) {
  writePage(tool.path, tool.title, tool.description, buildSeoHtml(tool))
}

for (const alias of SEO_ALIASES) {
  writePage(alias.path, alias.title, alias.description, buildAliasSeoHtml(alias))
}

console.log(`\n[prerender-seo] Generated ${generated} static HTML files in dist/`)
for (const tool of TOOLS_SEO) {
  console.log(`  /${tool.path}/index.html`)
}
for (const alias of SEO_ALIASES) {
  console.log(`  ${alias.path}/index.html`)
}
console.log()
