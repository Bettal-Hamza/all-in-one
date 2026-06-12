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
    title: 'Image to WebP Converter Free Online | Toolyy',
    description: 'Convert JPG, PNG, and GIF images to WebP format free online. Reduce file sizes by up to 80% with adjustable quality. Browser-based — no upload, no sign-up, works offline.',
    h1: 'Image to WebP Converter Online',
    intro: 'Convert JPG and PNG images to Google\'s modern WebP format and reduce file sizes by up to 80% with virtually no visible quality loss. Adjustable quality slider, zero uploads, and instant results — all inside your browser. Perfect for web developers, bloggers, and anyone optimizing page load speed and Core Web Vitals scores.',
    steps: [
      'Go to toolyy.net and select the Image to WebP converter.',
      'Drag and drop your JPG or PNG image into the browser workspace.',
      'Adjust the quality slider to balance size and fidelity, then download your WebP file.',
    ],
    faqs: [
      { q: 'What is WebP and why should I use it?', a: 'WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images. WebP files are 25–34% smaller than equivalent JPEG images and up to 80% smaller than PNG — resulting in faster page loads, lower bandwidth costs, and better Core Web Vitals scores.' },
      { q: 'How do I convert JPG to WebP online?', a: 'Open Toolyy\'s Image to WebP converter, drag your JPG file into the workspace, adjust the quality slider if needed, and download the converted WebP file. The entire process happens in your browser — no upload to any server.' },
      { q: 'Does converting to WebP reduce image quality?', a: 'At quality settings above 80%, WebP produces images that are visually indistinguishable from the originals while being significantly smaller. You can use the quality slider to find the perfect balance between file size and visual fidelity.' },
      { q: 'Do all browsers support WebP in 2026?', a: 'Yes — WebP has over 97% global browser support including Chrome, Firefox, Edge, Safari 14+, and all modern mobile browsers. It is safe to use WebP as the primary image format for any website.' },
      { q: 'Is there a file size limit for conversion?', a: 'No server-side limit. All conversion happens inside your browser using the Canvas API. Most devices handle images up to 30–40 megapixels without issues.' },
      { q: 'Will my transparent PNG backgrounds be preserved in WebP?', a: 'Yes. WebP fully supports alpha channel transparency, so transparent PNGs convert to transparent WebP files with no loss of quality or transparency data.' },
      { q: 'How does WebP compare to AVIF?', a: 'AVIF offers slightly better compression than WebP but has lower browser support (~92% vs 97%) and slower encoding speeds. WebP remains the best all-around choice for web images in 2026 due to its universal browser support and fast encoding.' },
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
    title: 'Free Online QR Code Generator | Create & Download Instantly | Toolyy',
    description: 'Free online QR generator — create scannable QR codes from URLs, text, Wi-Fi passwords, or phone numbers. Custom colors, high-res PNG download. No uploads, no tracking.',
    h1: 'Free Online QR Code Generator',
    intro: 'Free online QR generator — create scannable QR codes from any URL, text, Wi-Fi credentials, or phone number. Customizable styles, instant PNG download, and completely private — your data is encoded directly into the QR pattern with no redirect server. Your data never leaves your device.',
    steps: [
      'Go to toolyy.net and select the QR Code Generator.',
      'Paste your URL, text, or Wi-Fi credentials into the input field.',
      'Choose your style and download the QR code as a high-res PNG.',
    ],
    faqs: [
      { q: 'Are my QR codes stored on a server?', a: 'No. QR codes are generated entirely inside your browser using JavaScript. Your data never leaves your device and nothing is stored anywhere.' },
      { q: 'Do QR codes generated here ever expire?', a: 'Never. The destination URL or text is encoded directly into the QR pattern. There is no middleman server or redirect service that could go offline. These are static QR codes that work permanently.' },
      { q: 'What is a QR code and how does it work?', a: 'A QR (Quick Response) code is a two-dimensional barcode that stores data in a matrix of black and white squares. When scanned with a phone camera, it instantly decodes the stored information — typically a URL, text, Wi-Fi credentials, or contact details. QR codes can store up to 4,296 alphanumeric characters.' },
      { q: 'What is the difference between static and dynamic QR codes?', a: 'Static QR codes encode the destination directly into the pattern — they never change and never expire. Dynamic QR codes use a redirect URL that can be changed later but depend on a third-party server. Toolyy generates static QR codes for maximum reliability and privacy.' },
      { q: 'What are common uses for QR codes?', a: 'Business cards and resumes, restaurant menus, event tickets, product packaging, Wi-Fi network sharing, marketing flyers and posters, app download links, payment links, and website URLs. QR codes bridge the physical and digital worlds.' },
      { q: 'What size should I print a QR code?', a: 'Minimum 2 × 2 cm (0.8 × 0.8 inches) for close-range scanning like business cards. For posters or signs, scale proportionally — the scanning distance is roughly 10× the QR code width. Toolyy outputs high-resolution PNG that scales cleanly for print.' },
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
    title: 'AI Background Remover & Transparent Background Maker Online | Toolyy',
    description: 'Free transparent background maker online — remove backgrounds from any image using AI in your browser. No uploads, no sign-up. Outputs clean transparent PNGs for logos, products, and portraits.',
    h1: 'AI Background Remover — Free Transparent Background Maker Online',
    intro: 'Free transparent background maker online — remove backgrounds from photos instantly using on-device AI. The neural network runs entirely in your browser via WebAssembly — no uploads, no server, complete privacy. Outputs lossless transparent PNGs perfect for logos, product photos, e-commerce listings, and graphic design.',
    steps: [
      'Go to toolyy.net and select the Background Remover tool.',
      'Drag and drop your JPG, PNG, or WebP photo into the workspace.',
      'The AI processes your image locally, then download the transparent PNG result.',
    ],
    faqs: [
      { q: 'Is my photo uploaded to a server?', a: 'No. The background remover runs 100% in your browser using WebAssembly and ONNX Runtime. Your image never leaves your device — not even temporarily.' },
      { q: 'Does the AI work on all types of photos?', a: 'Yes — the model handles people, products, animals, objects, and most complex scenes with clear subject-to-background contrast. It works best with well-lit photos where the subject stands out from the background.' },
      { q: 'What image formats support transparent backgrounds?', a: 'PNG and WebP support alpha channel transparency. JPEG does not support transparency at all. Toolyy outputs PNG files with full alpha transparency, which is compatible with all design tools, e-commerce platforms, and presentation software.' },
      { q: 'Can I remove backgrounds from product photos for e-commerce?', a: 'Yes. The AI handles product photography well — clothing, electronics, food items, jewelry, and more. Clean transparent cutouts are perfect for Amazon, Shopify, Etsy, and eBay product listings where a white or transparent background is required.' },
      { q: 'How does AI background removal work?', a: 'The tool uses a deep neural network (U²-Net architecture) that has been trained on millions of images to identify foreground subjects. It runs via ONNX Runtime compiled to WebAssembly, executing entirely in your browser with no server involvement.' },
      { q: 'How does this compare to remove.bg?', a: 'Similar AI quality, but Toolyy processes everything locally on your device. No uploads, no watermarks, no account required, no per-image fees, and no usage limits. Your images remain completely private.' },
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
    title: 'JSON Formatter & Validator Online Free | Toolyy',
    description: 'Free online JSON formatter, validator, and minifier with syntax highlighting and line-level error reporting. Paste any JSON to beautify, validate, or compress. 100% browser-based — safe for API keys and tokens.',
    h1: 'JSON Formatter & Validator Online',
    intro: 'Beautify, validate, and minify JSON with syntax highlighting and clear error reporting. Paste sensitive API keys and tokens safely — everything runs in your browser with zero server contact. Toolyy\'s JSON formatter handles any payload size with instant results and no data tracking.',
    steps: [
      'Go to toolyy.net and select the JSON Formatter tool.',
      'Paste your raw JSON or drag a .json file into the editor.',
      'Click Beautify to format, Validate to check syntax, or Minify to compress — then copy or download.',
    ],
    faqs: [
      { q: 'Is my JSON data safe when using this formatter?', a: 'Yes — everything processes directly in your browser using JavaScript. Your data is never sent to any server, making it safe for API keys, authentication tokens, and sensitive configuration data.' },
      { q: 'Can this tool fix broken JSON?', a: 'The Validate button identifies syntax errors with exact line numbers and descriptions. Common errors detected include missing commas, trailing commas, unquoted keys, mismatched brackets, and invalid escape sequences.' },
      { q: 'What is JSON and what is it used for?', a: 'JSON (JavaScript Object Notation) is a lightweight, human-readable data interchange format. It is the standard for REST APIs, configuration files, NoSQL databases, and web application data exchange. Its simplicity and language independence make it the most widely used data format on the web.' },
      { q: 'What is the difference between beautify and minify?', a: 'Beautify adds indentation and line breaks to make JSON human-readable. Minify removes all whitespace to create the smallest possible payload — ideal for production APIs, reducing bandwidth, and improving load times. Both operations preserve the data structure exactly.' },
      { q: 'Can I format large JSON files?', a: 'Yes. Since all processing happens client-side in your browser, there is no upload or server limit. Files up to several megabytes parse and format instantly on modern devices.' },
      { q: 'What is valid JSON format?', a: 'Valid JSON requires double-quoted strings for keys and values, no trailing commas, no comments, and properly nested objects and arrays. The root element must be an object {} or array []. Toolyy validates against the strict JSON specification (RFC 8259).' },
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
    relatedTools: ['pdf-splitter', 'unit-converter', 'image-converter'],
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
      { q: 'What are the exact image sizes for social media platforms in 2026?', a: 'Instagram Post: 1080×1080 px. Instagram Story / TikTok: 1080×1920 px. YouTube Thumbnail: 1280×720 px. LinkedIn Post: 1200×627 px. X (Twitter) Post: 1600×900 px. Facebook Post: 1200×630 px. Pinterest Pin: 1000×1500 px. These are the recommended pixel dimensions for maximum clarity on each platform.' },
      { q: 'Is my photo uploaded to a server?', a: 'No. All resizing and cropping happens locally in your browser using the HTML5 Canvas API. Your images never leave your device — not even temporarily. This makes it safe to resize confidential or personal photos.' },
      { q: 'What aspect ratio should I use for Instagram Reels and TikTok?', a: 'Instagram Reels and TikTok both use a 9:16 vertical aspect ratio at 1080×1920 pixels. This is the same ratio as a smartphone screen held in portrait orientation. Toolyy\'s preset handles this automatically.' },
      { q: 'Can I resize images without losing quality?', a: 'Upscaling a small image will reduce quality because new pixels must be interpolated. Downscaling from a larger original preserves quality. For best results, start with the highest resolution source image you have. Toolyy uses the browser\'s high-quality bicubic interpolation algorithm.' },
      { q: 'What is the best image format for social media?', a: 'JPEG is best for photographs — small file size with good quality. PNG is best for graphics, logos, and images with text or transparency. Most platforms accept both formats. Toolyy outputs JPEG by default for photos and PNG when transparency is detected.' },
      { q: 'Does this work for YouTube channel banners?', a: 'Yes. YouTube recommends 2560×1440 px for channel banners (TV display) with a safe area of 1546×423 px for mobile. Enter these custom dimensions in Toolyy to create a perfectly sized banner.' },
      { q: 'Can I crop and resize multiple images at once?', a: 'Currently, Toolyy processes one image at a time to give you precise control over the crop area. This ensures each image is framed exactly the way you want it for each platform.' },
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
    title: 'MP4 to MP3 Converter Free Online | Toolyy',
    description: 'Convert MP4 to MP3 free online. Extract high-quality audio from any video file (MP4, MOV, WebM, AVI, MKV) directly in your browser. Choose 128–320 kbps bitrate. No upload, no file size limit.',
    h1: 'MP4 to MP3 Converter Online',
    intro: 'Extract high-quality MP3 audio from MP4, WebM, MOV, AVI, and MKV video files entirely in your browser. Powered by FFmpeg compiled to WebAssembly, the conversion runs locally on your device with zero server uploads. Choose bitrates from 128 to 320 kbps for the perfect balance between file size and audio quality.',
    steps: [
      'Go to toolyy.net and select the MP4 to MP3 converter.',
      'Drag and drop your video file into the workspace.',
      'Choose your preferred audio quality (128–320 kbps) and wait for conversion.',
      'Download your extracted MP3 audio file.',
    ],
    faqs: [
      { q: 'Is my video uploaded to a server?', a: 'No. Conversion happens entirely in your browser using FFmpeg compiled to WebAssembly. Your file never leaves your device — even with multi-gigabyte videos.' },
      { q: 'What video formats can I convert to MP3?', a: 'MP4, WebM, MOV, AVI, and MKV with H.264, H.265, VP8, VP9, and AV1 codecs are all supported. If your browser can play the video, Toolyy can extract the audio.' },
      { q: 'What is MP4?', a: 'MP4 (MPEG-4 Part 14) is a digital multimedia container format that stores video, audio, subtitles, and still images. It is the most common video format used on the internet, supported by virtually every device and platform.' },
      { q: 'What is MP3?', a: 'MP3 (MPEG-1 Audio Layer III) is the most widely supported audio format. It uses lossy compression to reduce file sizes by 75–95% compared to uncompressed audio while maintaining acceptable listening quality. Supported by every music player, phone, and browser.' },
      { q: 'What bitrate should I choose for MP3?', a: '128 kbps is acceptable for spoken word and podcasts. 192 kbps is good for general music listening. 256 kbps is high quality. 320 kbps is the maximum MP3 bitrate and is nearly indistinguishable from the original audio for most listeners.' },
      { q: 'How long does MP4 to MP3 conversion take?', a: 'Depends on file size and your device. A 5-minute video typically converts in 10–30 seconds on modern hardware. Larger files (1+ hours) may take a few minutes. All processing uses your device CPU.' },
      { q: 'Is there a file size limit?', a: 'No server-side limit since nothing is uploaded. The practical limit is your device RAM. Most modern computers handle video files up to several gigabytes.' },
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
    relatedTools: ['image-converter', 'pdf-splitter', 'qr-generator'],
  },
  {
    path: 'tools/unit-converter',
    title: 'Length Unit Converter Online | Free Metric & Imperial Calculator | Toolyy',
    description: 'Free online length unit converter — convert meters, feet, kilometers, miles, inches, centimeters and more. Also supports weight, temperature, area, volume, speed, data, and time. 100% private.',
    h1: 'Length Unit Converter Online',
    intro: 'Free online length unit converter — convert between meters, kilometers, miles, feet, inches, centimeters, yards, and millimeters instantly. Also supports weight, temperature, area, volume, speed, data storage, and time conversions. All calculations happen in your browser with zero data sent to any server.',
    steps: [
      'Go to toolyy.net and select the Unit Converter tool.',
      'Choose a category (Length, Weight, Temperature, etc.) and select your source and target units.',
      'Type a value and see the converted result instantly — no button click needed.',
    ],
    faqs: [
      { q: 'How do I convert meters to feet online?', a: 'Select Meter as the source and Foot as the target, then type your value. The formula is: feet = meters × 3.28084. For example, 10 meters = 32.81 feet.' },
      { q: 'Does the unit converter work offline?', a: 'Yes. Once the page loads, all conversions happen locally in your browser with zero server communication.' },
      { q: 'What unit categories are supported?', a: 'Length, weight, temperature, area, volume, speed, data storage, and time — with full metric and imperial support.' },
      { q: 'How many centimeters are in an inch?', a: 'One inch equals exactly 2.54 centimeters. This is an exact definition, not an approximation.' },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Convert Length Units Free Online',
      description: 'Convert between metric and imperial length units — meters, feet, kilometers, miles, inches, centimeters — using Toolyy\'s free online calculator.',
      step: [
        { '@type': 'HowToStep', text: 'Go to toolyy.net and select the Unit Converter tool.' },
        { '@type': 'HowToStep', text: 'Choose the Length category and select your source and target units (e.g., Kilometers to Miles).' },
        { '@type': 'HowToStep', text: 'Type a value and see the converted result instantly.' },
      ],
      totalTime: 'PT10S',
    },
    relatedTools: ['json-formatter', 'social-resizer', 'pdf-splitter'],
  },
]

const TOOLS_SEO_EXTRA_HTML = {
  'tools/json-formatter': `
        <section>
          <h2>What Is JSON?</h2>
          <p>JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format derived from JavaScript. Despite its name, JSON is language-independent and supported by virtually every modern programming language including Python, Java, C#, Go, Ruby, PHP, and Rust.</p>
          <p>JSON uses two core structures: <strong>objects</strong> (key-value pairs wrapped in curly braces) and <strong>arrays</strong> (ordered lists wrapped in square brackets). Values can be strings, numbers, booleans, null, objects, or arrays — making JSON flexible enough for API responses, configuration files, database records, and inter-service communication.</p>
          <h2>Common JSON Errors and How to Fix Them</h2>
          <p><strong>Trailing commas:</strong> JSON does not allow a comma after the last item in an object or array. Remove the final comma.</p>
          <p><strong>Single quotes:</strong> JSON requires double quotes for strings. Replace all single quotes with double quotes.</p>
          <p><strong>Unquoted keys:</strong> Unlike JavaScript objects, JSON keys must always be wrapped in double quotes.</p>
          <p><strong>Comments:</strong> Standard JSON (RFC 8259) does not support comments. Remove any // or /* */ comments before validating.</p>
          <p><strong>Missing commas:</strong> Every key-value pair must be separated by a comma. The validator pinpoints the exact line where a comma is expected.</p>
          <h2>JSON vs XML vs YAML</h2>
          <p><strong>JSON</strong> is the web standard — compact, fast to parse, and natively supported in browsers. Best for APIs and web applications.</p>
          <p><strong>XML</strong> is more verbose but supports attributes, namespaces, and mixed content. Used in enterprise systems, SOAP APIs, and document markup.</p>
          <p><strong>YAML</strong> uses indentation instead of brackets, making it human-friendly for configuration files (Docker, Kubernetes, CI/CD). However, YAML is sensitive to whitespace errors and slower to parse than JSON.</p>
        </section>`,
  'tools/image-converter': `
        <section>
          <h2>What Is WebP?</h2>
          <p>WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images. Released in 2010 and now supported by over 97% of browsers worldwide, WebP delivers the same visual quality as JPEG and PNG at significantly smaller file sizes.</p>
          <p>WebP supports alpha channel transparency (like PNG), animation (like GIF), and both lossy and lossless compression modes — making it a versatile replacement for older image formats on the web.</p>
          <h2>WebP vs PNG vs JPEG — When to Use Each</h2>
          <table>
            <thead><tr><th>Format</th><th>Best For</th><th>Transparency</th><th>Typical Size</th></tr></thead>
            <tbody>
              <tr><td>WebP</td><td>All web images</td><td>Yes</td><td>25–80% smaller</td></tr>
              <tr><td>JPEG</td><td>Photos (legacy)</td><td>No</td><td>Baseline</td></tr>
              <tr><td>PNG</td><td>Logos, icons (legacy)</td><td>Yes</td><td>2–5× larger than WebP</td></tr>
            </tbody>
          </table>
          <h2>Why Convert to WebP for Your Website?</h2>
          <p><strong>Faster page loads:</strong> Smaller images mean faster load times, especially on mobile networks. Google PageSpeed Insights specifically recommends WebP for image optimization.</p>
          <p><strong>Better Core Web Vitals:</strong> Largest Contentful Paint (LCP) improves significantly with WebP images, directly impacting your Google search rankings.</p>
          <p><strong>Lower bandwidth costs:</strong> For sites serving millions of images, the 25–80% size reduction translates to significant CDN and hosting savings.</p>
          <p><strong>Universal support:</strong> With 97%+ browser coverage in 2026, there is no practical reason to avoid WebP. Safari, Chrome, Firefox, Edge, and all modern mobile browsers render WebP natively.</p>
        </section>`,
  'tools/mp4-to-mp3': `
        <section>
          <h2>What Is MP4?</h2>
          <p>MP4 (MPEG-4 Part 14) is a digital multimedia container format that can store video, audio, subtitles, and still images. It is the most widely used video format on the internet — used by YouTube, social media platforms, streaming services, and smartphone cameras. MP4 files typically use H.264 or H.265 video codecs paired with AAC audio.</p>
          <h2>What Is MP3?</h2>
          <p>MP3 (MPEG-1 Audio Layer III) is the most universally supported audio format. Developed in the early 1990s, MP3 uses lossy compression to reduce audio file sizes by 75–95% compared to uncompressed WAV while maintaining acceptable listening quality. It remains the standard for music files, podcasts, and audio downloads due to its universal device and player support.</p>
          <h2>Audio Bitrate Guide: Which Quality Should You Choose?</h2>
          <table>
            <thead><tr><th>Bitrate</th><th>Quality</th><th>Best For</th><th>File Size (per minute)</th></tr></thead>
            <tbody>
              <tr><td>128 kbps</td><td>Acceptable</td><td>Podcasts, spoken word, previews</td><td>~960 KB</td></tr>
              <tr><td>192 kbps</td><td>Good</td><td>General music listening</td><td>~1.4 MB</td></tr>
              <tr><td>256 kbps</td><td>High</td><td>Music archiving, DJing</td><td>~1.9 MB</td></tr>
              <tr><td>320 kbps</td><td>Maximum</td><td>Audiophile quality, studio use</td><td>~2.4 MB</td></tr>
            </tbody>
          </table>
          <p>Higher bitrates preserve more audio detail but produce larger files. For most people, 192 kbps offers the best balance between quality and file size.</p>
        </section>`,
  'tools/qr-generator': `
        <section>
          <h2>What Is a QR Code?</h2>
          <p>A QR (Quick Response) code is a two-dimensional matrix barcode invented in 1994 by Denso Wave for the Japanese automotive industry. Unlike traditional barcodes that store data in one direction, QR codes encode information in both horizontal and vertical directions — enabling them to store up to 4,296 alphanumeric characters in a small square pattern.</p>
          <p>Modern smartphones can scan QR codes natively using their built-in camera apps (iPhone iOS 11+ and Android 10+), making QR codes the fastest bridge between the physical and digital worlds.</p>
          <h2>Static vs Dynamic QR Codes</h2>
          <p><strong>Static QR codes</strong> encode the destination directly into the pattern. They never expire, require no ongoing service, and work even if the generator goes offline. Toolyy generates static QR codes — the most reliable and private option.</p>
          <p><strong>Dynamic QR codes</strong> encode a short redirect URL instead of the final destination. This allows the destination to be changed after printing, but depends on a third-party server staying online. Most "free" QR generators that offer dynamic codes eventually charge monthly fees.</p>
          <h2>Popular QR Code Use Cases</h2>
          <ul>
            <li><strong>Business cards &amp; resumes:</strong> Link to your LinkedIn, portfolio, or vCard for instant contact sharing</li>
            <li><strong>Restaurant menus:</strong> Replace paper menus with a scannable code linking to your digital menu</li>
            <li><strong>Wi-Fi sharing:</strong> Let guests connect to your network by scanning — no typing passwords</li>
            <li><strong>Product packaging:</strong> Link to manuals, warranty registration, or product pages</li>
            <li><strong>Event tickets:</strong> Encode ticket IDs for fast check-in at events and venues</li>
            <li><strong>Marketing materials:</strong> Add QR codes to flyers, posters, and brochures to drive traffic to landing pages</li>
          </ul>
          <h2>QR Code Printing Size Guide</h2>
          <p>The minimum recommended print size is <strong>2 × 2 cm (0.8 × 0.8 in)</strong> for close-range scanning like business cards. For posters, the scanning distance is approximately 10× the QR code width — so a 10 cm QR code can be scanned from about 1 meter away. Always test your printed QR code with multiple phones before distributing.</p>
        </section>`,
  'tools/social-resizer': `
        <section>
          <h2>Social Media Image Size Reference Guide (2026)</h2>
          <p>Each social media platform has specific image dimension requirements. Using the wrong size causes cropping, blurriness, or letterboxing. This table lists the recommended pixel dimensions for every major platform.</p>
          <table>
            <thead><tr><th>Platform</th><th>Content Type</th><th>Dimensions (px)</th><th>Aspect Ratio</th></tr></thead>
            <tbody>
              <tr><td>Instagram</td><td>Square Post</td><td>1080 × 1080</td><td>1:1</td></tr>
              <tr><td>Instagram</td><td>Portrait Post</td><td>1080 × 1350</td><td>4:5</td></tr>
              <tr><td>Instagram</td><td>Story / Reel</td><td>1080 × 1920</td><td>9:16</td></tr>
              <tr><td>TikTok</td><td>Video / Photo</td><td>1080 × 1920</td><td>9:16</td></tr>
              <tr><td>YouTube</td><td>Thumbnail</td><td>1280 × 720</td><td>16:9</td></tr>
              <tr><td>YouTube</td><td>Channel Banner</td><td>2560 × 1440</td><td>16:9</td></tr>
              <tr><td>Facebook</td><td>Post Image</td><td>1200 × 630</td><td>1.91:1</td></tr>
              <tr><td>Facebook</td><td>Cover Photo</td><td>820 × 312</td><td>2.63:1</td></tr>
              <tr><td>X (Twitter)</td><td>Post Image</td><td>1600 × 900</td><td>16:9</td></tr>
              <tr><td>X (Twitter)</td><td>Header Photo</td><td>1500 × 500</td><td>3:1</td></tr>
              <tr><td>LinkedIn</td><td>Post Image</td><td>1200 × 627</td><td>1.91:1</td></tr>
              <tr><td>LinkedIn</td><td>Cover Photo</td><td>1128 × 191</td><td>5.91:1</td></tr>
              <tr><td>Pinterest</td><td>Standard Pin</td><td>1000 × 1500</td><td>2:3</td></tr>
            </tbody>
          </table>
          <h2>Why Image Dimensions Matter for Social Media</h2>
          <p><strong>Avoid auto-cropping:</strong> Platforms automatically crop images that don't match their expected aspect ratios. A landscape photo uploaded as an Instagram Story gets zoomed in and loses important content at the edges.</p>
          <p><strong>Maximum sharpness:</strong> Using the exact recommended pixel dimensions ensures your image displays at full resolution without scaling artifacts. Uploading undersized images causes visible blurriness on high-DPI screens.</p>
          <p><strong>Algorithm advantage:</strong> Social media algorithms favor content that looks professional. Correctly sized images receive higher engagement rates because they display as intended in feeds, stories, and search results.</p>
          <h2>Quick Tips for Better Social Media Images</h2>
          <ul>
            <li><strong>Start with high resolution:</strong> Always begin with the largest source image available. Downscaling preserves quality; upscaling creates blur.</li>
            <li><strong>Use the rule of thirds:</strong> Place key subjects at intersection points when cropping to maintain visual balance.</li>
            <li><strong>Keep text within safe zones:</strong> Platform UI elements (profile icons, like buttons, captions) overlay edges of images. Keep important text centered.</li>
            <li><strong>Test on mobile:</strong> Over 80% of social media browsing happens on phones. Preview your cropped images at phone screen size before posting.</li>
          </ul>
        </section>`,
  'tools/background-remover': `
        <section>
          <h2>Use Cases for Transparent Backgrounds</h2>
          <h3>E-Commerce Product Photos</h3>
          <p>Amazon, Shopify, Etsy, and eBay require or strongly recommend product images on white or transparent backgrounds. Use Toolyy to create clean cutouts that meet marketplace standards without paying per-image fees to services like remove.bg.</p>
          <h3>Logo &amp; Branding</h3>
          <p>Transparent logo files (PNG) are essential for placing your brand mark on any colored background — websites, presentations, social media, and print materials. Remove the background from a logo photo or scan to create a versatile transparent PNG.</p>
          <h3>Social Media Graphics</h3>
          <p>Create layered compositions by removing backgrounds from portrait photos, product shots, or objects. Combine transparent cutouts with custom backgrounds for Instagram posts, YouTube thumbnails, and TikTok content.</p>
          <h3>Presentations &amp; Documents</h3>
          <p>Transparent images integrate seamlessly into PowerPoint, Google Slides, and Keynote presentations. No more awkward white rectangles around images on colored slide backgrounds.</p>
          <h2>PNG vs JPEG: Why Transparency Requires PNG</h2>
          <p>JPEG does not support transparency — it always fills transparent areas with a solid color (usually white). PNG supports full alpha channel transparency, preserving clean edges and partial transparency. Toolyy outputs PNG files to ensure your transparent backgrounds work correctly in all applications.</p>
        </section>`,
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildBreadcrumbSchema(pageName, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: pageName, item: canonical },
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

function buildAllToolsNav(currentPath) {
  const liveTools = TOOLS.filter(t => t.live && t.path)
  const links = liveTools
    .filter(t => `tools/${t.id}` !== currentPath && t.path !== `/${currentPath}`)
    .map(t => `<li><a href="${BASE_URL}${t.path}">${escapeHtml(t.label)}</a></li>`)
  return `
      <nav aria-label="Browse all tools" style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid #e5e7eb">
        <h2>Explore More Free Online Tools</h2>
        <ul>${links.join('\n          ')}</ul>
      </nav>`
}

function buildAliasVariantsHtml(toolPath) {
  const toolId = toolPath.replace(/^tools\//, '')
  const variants = SEO_ALIASES.filter(a => a.parentTool === toolId)
  if (variants.length === 0) return ''
  const links = variants.map(a => `<li><a href="${BASE_URL}${a.path}">${escapeHtml(a.h1)}</a></li>`)
  return `
        <section>
          <h2>Popular Variations of This Tool</h2>
          <ul>
            ${links.join('\n            ')}
          </ul>
        </section>`
}

function buildSoftwareAppSchema(tool, canonical) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.h1,
    url: canonical,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: tool.description || tool.intro,
  }
}

function buildSeoHtml(tool) {
  const canonical = `${BASE_URL}/${tool.path}`
  const breadcrumb = buildBreadcrumbSchema(tool.h1, canonical)
  const faqSchema  = buildFaqSchema(tool.faqs)
  const appSchema  = buildSoftwareAppSchema(tool, canonical)
  const relatedHtml = buildRelatedToolsHtml(tool.relatedTools)
  const allToolsNav = buildAllToolsNav(tool.path)
  const extraHtml = TOOLS_SEO_EXTRA_HTML[tool.path] || ''
  const variantsHtml = buildAliasVariantsHtml(tool.path)

  return `
    <main>
      <nav aria-label="Breadcrumb" style="max-width:48rem;margin:0 auto;padding:1rem 1rem 0;font-size:.875rem;color:#6b7280">
        <a href="${BASE_URL}/">Home</a> &rsaquo; <span>${escapeHtml(tool.h1)}</span>
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
        ${extraHtml}
        ${variantsHtml}
        ${relatedHtml}
        ${allToolsNav}
      </article>
    </main>
    <script type="application/ld+json">${JSON.stringify(tool.schema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(appSchema, null, 2)}</script>`
}

const ALIAS_EXTRA_HTML = {
  'kg-to-lbs': `
        <section>
          <h2>How to Convert Kilograms to Pounds (KG to LBS) for Gym &amp; Fitness</h2>
          <p>The exact conversion factor is <strong>1 kg = 2.20462 lbs</strong>. Multiply any kilogram value by 2.20462 to get the equivalent in pounds. For a quick mental estimate at the gym, multiply by 2.2 — close enough for loading plates.</p>
          <p>This matters for lifters because most US gyms label plates and machines in pounds, while Olympic weightlifting and international competitions use kilograms. Whether you follow a European training program, watch powerlifting meets, or track macros using a metric food scale, fast kg-to-lbs conversion is essential. Toolyy calculates it in real time as you type — no rounding errors, no conversion charts needed.</p>

          <h3>Quick Weight Conversion Table for Weightlifting &amp; Bodybuilding</h3>
          <table>
            <thead><tr><th>Kilograms (kg)</th><th>Pounds (lbs)</th><th>Common Use</th></tr></thead>
            <tbody>
              <tr><td>10 kg</td><td>22.05 lbs</td><td>Small bumper plate</td></tr>
              <tr><td>15 kg</td><td>33.07 lbs</td><td>Training plate</td></tr>
              <tr><td>20 kg</td><td>44.09 lbs</td><td>Standard Olympic barbell</td></tr>
              <tr><td>25 kg</td><td>55.12 lbs</td><td>Large bumper plate</td></tr>
              <tr><td>40 kg</td><td>88.18 lbs</td><td>Loaded EZ-curl bar</td></tr>
              <tr><td>50 kg</td><td>110.23 lbs</td><td>Heavy dumbbell</td></tr>
              <tr><td>60 kg</td><td>132.28 lbs</td><td>Intermediate bench press</td></tr>
              <tr><td>80 kg</td><td>176.37 lbs</td><td>Advanced squat</td></tr>
              <tr><td>100 kg</td><td>220.46 lbs</td><td>Two-plate bench milestone</td></tr>
              <tr><td>140 kg</td><td>308.65 lbs</td><td>Advanced deadlift</td></tr>
            </tbody>
          </table>

          <h3>Healthy Meal Prep: Converting KG to LBS for Food Tracking</h3>
          <p>Nutrition labels in the US list serving sizes in ounces and pounds, while kitchen scales globally default to grams and kilograms. When meal-prepping chicken breast, rice, or vegetables in bulk, converting between kg and lbs ensures accurate macro tracking. For example, a 2.5 kg pack of chicken breast equals 5.51 lbs — about 22 four-ounce servings.</p>
          <p>Quick reference: 0.5 kg = 1.1 lbs, 1 kg = 2.2 lbs, 2 kg = 4.4 lbs, 5 kg = 11 lbs.</p>
          <p>Need the opposite direction? Use the <a href="${BASE_URL}/tools/lbs-to-kg">LBS to KG converter</a> to convert pounds to kilograms.</p>
        </section>`,
  'lbs-to-kg': `
        <section>
          <h2>How to Convert Pounds to Kilograms (LBS to KG)</h2>
          <p>The exact conversion factor is <strong>1 lb = 0.453592 kg</strong>. Multiply any pound value by 0.453592 to get kilograms. For quick mental math, divide the pounds by 2.2 — for example, 150 lbs &divide; 2.2 &asymp; 68 kg.</p>
          <p>The "lbs" abbreviation comes from <em>libra</em>, the ancient Roman unit of weight — which is also why the pound is called <em>libra</em> in Spanish and <em>livre</em> in French. The kilogram is the standard SI unit of mass used by nearly every country outside the United States.</p>

          <h3>Body Weight Conversion Chart: Pounds to Kilograms</h3>
          <p>Converting your body weight for a medical form, fitness app, or travel abroad? This chart covers the most common body weights:</p>
          <table>
            <thead><tr><th>Pounds (lbs)</th><th>Kilograms (kg)</th></tr></thead>
            <tbody>
              <tr><td>100 lbs</td><td>45.36 kg</td></tr>
              <tr><td>110 lbs</td><td>49.90 kg</td></tr>
              <tr><td>120 lbs</td><td>54.43 kg</td></tr>
              <tr><td>130 lbs</td><td>58.97 kg</td></tr>
              <tr><td>140 lbs</td><td>63.50 kg</td></tr>
              <tr><td>150 lbs</td><td>68.04 kg</td></tr>
              <tr><td>160 lbs</td><td>72.57 kg</td></tr>
              <tr><td>170 lbs</td><td>77.11 kg</td></tr>
              <tr><td>180 lbs</td><td>81.65 kg</td></tr>
              <tr><td>190 lbs</td><td>86.18 kg</td></tr>
              <tr><td>200 lbs</td><td>90.72 kg</td></tr>
              <tr><td>220 lbs</td><td>99.79 kg</td></tr>
              <tr><td>250 lbs</td><td>113.40 kg</td></tr>
              <tr><td>300 lbs</td><td>136.08 kg</td></tr>
            </tbody>
          </table>

          <h3>Luggage, Shipping &amp; Towing Weight Conversions</h3>
          <p>Airline baggage allowances, freight quotes, and towing capacities frequently mix pounds and kilograms. Common reference points:</p>
          <table>
            <thead><tr><th>Pounds (lbs)</th><th>Kilograms (kg)</th><th>Common Use</th></tr></thead>
            <tbody>
              <tr><td>40 lbs</td><td>18.14 kg</td><td>Budget airline checked bag limit</td></tr>
              <tr><td>50 lbs</td><td>22.68 kg</td><td>Standard US checked baggage limit</td></tr>
              <tr><td>70 lbs</td><td>31.75 kg</td><td>Heavy/oversize bag limit</td></tr>
              <tr><td>1,000 lbs</td><td>453.59 kg</td><td>Half-ton truck payload class</td></tr>
              <tr><td>5,000 lbs</td><td>2,268 kg</td><td>Typical SUV towing capacity</td></tr>
              <tr><td>13,500 lbs</td><td>6,123 kg</td><td>Heavy-duty truck towing capacity</td></tr>
              <tr><td>30,000 lbs</td><td>13,608 kg</td><td>Commercial freight load</td></tr>
              <tr><td>40,000 lbs</td><td>18,144 kg</td><td>Max US semi-trailer cargo weight</td></tr>
            </tbody>
          </table>

          <h3>Cooking &amp; Grocery Quick Reference</h3>
          <p>Converting recipe and grocery weights: &frac14; lb = 113 g, &frac12; lb = 227 g, 1 lb = 454 g, 2 lbs = 907 g, 4 lbs = 1.81 kg, 5 lbs = 2.27 kg, 10 lbs = 4.54 kg. A US "stick" context tip: one pound of butter is four sticks, or 454 grams.</p>
          <p>Need the opposite direction? Use the <a href="${BASE_URL}/tools/kg-to-lbs">KG to LBS converter</a> to convert kilograms to pounds.</p>
        </section>`,
  'jpg-to-webp': `
        <section>
          <h2>JPG vs WebP: Side-by-Side Comparison</h2>
          <table>
            <thead><tr><th>Feature</th><th>JPG / JPEG</th><th>WebP</th></tr></thead>
            <tbody>
              <tr><td>Typical file size</td><td>Baseline</td><td>25&ndash;34% smaller</td></tr>
              <tr><td>Transparency support</td><td>No</td><td>Yes (alpha channel)</td></tr>
              <tr><td>Animation support</td><td>No</td><td>Yes</td></tr>
              <tr><td>Browser support (2026)</td><td>100%</td><td>97%+</td></tr>
              <tr><td>Best for</td><td>Legacy compatibility</td><td>All modern web images</td></tr>
            </tbody>
          </table>
          <h2>JPG or JPEG — What's the Difference?</h2>
          <p>Nothing — JPG and JPEG are exactly the same image format. The shorter "JPG" extension is a relic of early Windows systems that limited file extensions to three characters. Whether your photo ends in .jpg or .jpeg, this converter processes it identically and outputs the same optimized WebP file.</p>
          <h2>Why Convert JPG to WebP?</h2>
          <p><strong>Faster page loads:</strong> A typical 500 KB JPEG photo becomes a ~330 KB WebP at the same visual quality. Multiply that across every image on a page and load times drop noticeably, especially on mobile connections.</p>
          <p><strong>Better Google rankings:</strong> Page speed is a ranking factor, and Google PageSpeed Insights explicitly flags JPEG images with the recommendation "serve images in next-gen formats" — WebP is that next-gen format.</p>
          <p><strong>Lower bandwidth costs:</strong> If you pay for CDN or hosting bandwidth, a one-third reduction in image weight directly cuts your bill.</p>
          <h2>Recommended Quality Settings</h2>
          <p>For photographs, <strong>80&ndash;90% quality</strong> is the sweet spot — visually identical to the original at a fraction of the size. Use 90%+ for hero images and photography portfolios. Drop to 70&ndash;80% for thumbnails and decorative backgrounds where small artifacts are invisible.</p>
          <p>Also converting PNG graphics? Use the <a href="${BASE_URL}/tools/png-to-webp">PNG to WebP converter</a>, or the <a href="${BASE_URL}/tools/compress-images-online">image compressor</a> to shrink any image file.</p>
        </section>`,
  'png-to-webp': `
        <section>
          <h2>PNG vs WebP: Side-by-Side Comparison</h2>
          <table>
            <thead><tr><th>Feature</th><th>PNG</th><th>WebP</th></tr></thead>
            <tbody>
              <tr><td>Typical file size</td><td>Baseline</td><td>26&ndash;80% smaller</td></tr>
              <tr><td>Transparency support</td><td>Yes</td><td>Yes (alpha channel)</td></tr>
              <tr><td>Compression modes</td><td>Lossless only</td><td>Lossless and lossy</td></tr>
              <tr><td>Browser support (2026)</td><td>100%</td><td>97%+</td></tr>
              <tr><td>Best for</td><td>Print, legacy software</td><td>All modern web images</td></tr>
            </tbody>
          </table>
          <h2>What Converts Best from PNG to WebP?</h2>
          <p><strong>Screenshots:</strong> UI screenshots with text and flat areas compress 60&ndash;80% smaller in WebP while keeping text perfectly crisp — one of the best use cases for conversion.</p>
          <p><strong>Logos and icons:</strong> Flat-color graphics with transparency convert with 70%+ size reduction and full alpha-channel preservation. Your transparent backgrounds survive intact.</p>
          <p><strong>Graphics with gradients:</strong> Banners, illustrations, and charts often shrink dramatically because WebP's prediction-based compression handles smooth color transitions far better than PNG's.</p>
          <h2>When to Keep PNG</h2>
          <p>Keep the original PNG when your destination demands it: print workflows, some document editors, older email clients, and app stores that require PNG assets. For anything displayed in a web browser, WebP is strictly better — smaller files, same quality, same transparency.</p>
          <p>Working with photos instead? Use the <a href="${BASE_URL}/tools/jpg-to-webp">JPG to WebP converter</a>, or the <a href="${BASE_URL}/tools/compress-images-online">image compressor</a> to reduce any image's file size.</p>
        </section>`,
  'compress-images-online': `
        <section>
          <h2>How to Reduce an Image File Size from MB to KB</h2>
          <p>Upload your image, lower the quality slider, and watch the live file-size preview update. A typical 4&ndash;5 MB smartphone photo compresses to <strong>300&ndash;800 KB at 80% quality</strong> — a 5&ndash;10&times; reduction with no visible quality loss. The compression converts your image to the efficient WebP format entirely inside your browser.</p>
          <h3>Typical Compression Results</h3>
          <table>
            <thead><tr><th>Original</th><th>Compressed (80% quality)</th><th>Reduction</th></tr></thead>
            <tbody>
              <tr><td>12 MP phone photo (4.5 MB)</td><td>~600 KB</td><td>87%</td></tr>
              <tr><td>Full-HD screenshot (1.2 MB PNG)</td><td>~250 KB</td><td>79%</td></tr>
              <tr><td>DSLR photo (8 MB JPEG)</td><td>~1.1 MB</td><td>86%</td></tr>
              <tr><td>Logo with transparency (400 KB PNG)</td><td>~90 KB</td><td>77%</td></tr>
            </tbody>
          </table>
          <h3>Target File Sizes for Common Uses</h3>
          <ul>
            <li><strong>Website content images:</strong> under 200 KB — keeps pages fast and Core Web Vitals green</li>
            <li><strong>Full-width hero images:</strong> under 500 KB</li>
            <li><strong>Email attachments:</strong> keep total under 20&ndash;25 MB (Gmail/Outlook limits)</li>
            <li><strong>Job applications &amp; government portals:</strong> often capped at 1&ndash;2 MB per file</li>
            <li><strong>Forum avatars &amp; profile photos:</strong> typically under 500 KB</li>
          </ul>
          <h3>Quality Slider Guide</h3>
          <p><strong>90%+:</strong> archival quality, modest savings. <strong>80&ndash;90%:</strong> the sweet spot — visually identical, large savings. <strong>70&ndash;80%:</strong> fine for thumbnails and previews. <strong>Below 70%:</strong> visible artifacts begin appearing in photos; use only when hitting strict upload limits.</p>
          <p>Need a specific output format instead? Try the <a href="${BASE_URL}/tools/jpg-to-webp">JPG to WebP</a> or <a href="${BASE_URL}/tools/png-to-webp">PNG to WebP</a> converters.</p>
        </section>`,
}

function buildAliasSeoHtml(alias) {
  const canonical = `${BASE_URL}${alias.path}`
  const breadcrumb = buildBreadcrumbSchema(alias.h1, canonical)
  const relatedHtml = buildRelatedToolsHtml(alias.relatedTools)
  const allToolsNav = buildAllToolsNav(alias.path.replace(/^\//, ''))
  const extraHtml = ALIAS_EXTRA_HTML[alias.id] || ''

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${alias.h1} Online`,
    description: alias.description,
    step: alias.steps.map(text => ({ '@type': 'HowToStep', text })),
    totalTime: 'PT1M',
  }

  const faqSchema = buildFaqSchema(alias.faqs)
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: alias.h1,
    url: canonical,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: alias.description,
  }

  return `
    <main>
      <nav aria-label="Breadcrumb" style="max-width:48rem;margin:0 auto;padding:1rem 1rem 0;font-size:.875rem;color:#6b7280">
        <a href="${BASE_URL}/">Home</a> &rsaquo; <span>${escapeHtml(alias.h1)}</span>
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
        ${extraHtml}
        ${relatedHtml}
        ${allToolsNav}
      </article>
    </main>
    <script type="application/ld+json">${JSON.stringify(howToSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(appSchema, null, 2)}</script>`
}

const ABOUT_PAGE = {
  path: 'about',
  title: 'About Toolyy | Free Privacy-First Browser Tools',
  description: 'Toolyy exists because every file tool demanded an upload. We built privacy-first browser utilities that process everything locally — free, fast, and forever open.',
}

function buildAboutSeoHtml() {
  const canonical = `${BASE_URL}/about`
  const liveToolCount = TOOLS.filter(t => t.live).length
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: 'About', item: canonical },
    ],
  }
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolyy',
    url: BASE_URL,
    logo: `${BASE_URL}/toolyy-og.png`,
    description: 'Free privacy-first browser tools for developers and consumers. All processing runs locally — your files never leave your device.',
    foundingDate: '2025',
  }

  const allToolsLinks = TOOLS.filter(t => t.live && t.path)
    .map(t => `<li><a href="${BASE_URL}${t.path}">${escapeHtml(t.label)}</a></li>`)

  return `
    <main>
      <article style="max-width:48rem;margin:0 auto;padding:2rem 1rem 3rem">
        <h1>About Toolyy — Free, Private Browser Tools for Everyone</h1>
        <p>Toolyy is a collection of free browser-based utilities for PDFs, images, audio, QR codes, and more. Every tool runs entirely inside your browser using JavaScript, WebAssembly, and the Canvas API — your files never leave your device. No uploads, no accounts, no paywalls.</p>

        <section>
          <h2>Why We Built Toolyy</h2>
          <p>We built Toolyy because we were tired of the same uncomfortable choice: use a capable online tool and hand over your files to an unknown server, or pay for desktop software you will use twice a year. There had to be a better way.</p>
          <p>Think about the last time you needed to split a PDF, convert a photo, or remove a background. Chances are you searched online, landed on a site, and uploaded your file to a server you knew nothing about. Who runs it? Where is your data stored? Is it retained, analysed, or sold? Most of the time you had no idea — and you clicked "convert" anyway, because you needed to get the job done.</p>
          <p>Modern browsers are already powerful enough to handle these operations locally. The JavaScript runtime has access to the File API, Web Workers, WebAssembly, and the Canvas API. Combined, these can perform the same file operations that online tools have been using servers for — splitting PDFs, converting image formats, running neural network inference for background removal. We just had to use them.</p>
        </section>

        <section>
          <h2>What We Stand For</h2>
          <h3>Privacy by Architecture</h3>
          <p>We do not ask you to trust our privacy policy — we make trust unnecessary. Every tool on Toolyy runs entirely inside your browser. There is no server that could receive your files even if we wanted it to. Your documents, photos, and data belong to you alone.</p>
          <h3>No Upload Wait, No Queue</h3>
          <p>Because processing happens in your browser, there is no upload step, no server queue, and no bandwidth bottleneck. A 50-page PDF splits in under two seconds. A 4K image converts instantly. Speed is not a premium feature — it is the default.</p>
          <h3>Radically Free, Forever</h3>
          <p>No subscriptions. No paywalls. No "free tier" that quietly locks the features you actually need. Every tool on Toolyy is free to use for personal or commercial projects.</p>
          <h3>Works Everywhere</h3>
          <p>Toolyy is a web app — which means it works on any device with a modern browser. iPhone, Android, Windows, Mac, Linux. No app to install, no OS version to worry about. Just open the page and start working.</p>
        </section>

        <section>
          <h2>Toolyy by the Numbers</h2>
          <ul>
            <li><strong>${liveToolCount} live tools</strong> — and more on the way</li>
            <li><strong>0 bytes uploaded</strong> — your files never touch our servers</li>
            <li><strong>100% free</strong> — no premium tiers, no per-file fees</li>
            <li><strong>No file size limits</strong> — the only limit is your device memory</li>
          </ul>
        </section>

        <section>
          <h2>Our Privacy Commitment</h2>
          <p>We will never introduce server-side file processing without making it opt-in, clearly labelled, and accompanied by a prominent privacy notice. The default will always be client-side. That is a promise we are making publicly, not just in the fine print.</p>
        </section>

        <section>
          <h2>Available Tools</h2>
          <p>Explore all free browser-based tools available on Toolyy:</p>
          <ul>${allToolsLinks.join('\n            ')}</ul>
        </section>
      </article>
    </main>
    <script type="application/ld+json">${JSON.stringify(breadcrumb, null, 2)}</script>
    <script type="application/ld+json">${JSON.stringify(orgSchema, null, 2)}</script>`
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
    // Strip the homepage's og/twitter/robots tags — per-page versions are
    // injected below alongside the canonical tag.
    .replace(/^\s*<meta (?:name="robots"|property="og:(?:type|site_name|title|description|url)"|name="twitter:(?:title|description)") [^>]*\/>\r?\n/gm, '')
    .replace(
      /(<div id="root">)[\s\S]*?(<\/div>\s*<\/body>)/,
      `$1${seoContent}\n    $2`,
    )

  const fullUrl = pagePath.startsWith('/') ? `${BASE_URL}${pagePath}` : `${BASE_URL}/${pagePath}`
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${fullUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Toolyy" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`,
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

writePage(ABOUT_PAGE.path, ABOUT_PAGE.title, ABOUT_PAGE.description, buildAboutSeoHtml())

console.log(`\n[prerender-seo] Generated ${generated} static HTML files in dist/`)
for (const tool of TOOLS_SEO) {
  console.log(`  /${tool.path}/index.html`)
}
for (const alias of SEO_ALIASES) {
  console.log(`  ${alias.path}/index.html`)
}
console.log(`  /about/index.html`)
console.log()
