export const SEO_ALIASES = [
  // ── PDF Splitter variants ─────────────────────────────────────────
  {
    id: 'split-pdf-online',
    parentTool: 'pdf-splitter',
    path: '/tools/split-pdf-online',
    title: 'Split PDF Online Free — No Upload, No Signup',
    description: 'Split any PDF into individual pages instantly in your browser. No uploads to servers, no account needed. 100% private and free.',
    h1: 'Split PDF Online Free',
    intro: 'Split any PDF document into separate downloadable pages without uploading to external servers. Toolyy processes everything locally in your browser — ideal for splitting contracts, presentations, reports, and scanned documents privately.',
    steps: [
      'Open Toolyy and navigate to the PDF splitter.',
      'Drop your PDF file into the browser workspace.',
      'Select pages to extract, then download each page individually or as a merged file.',
    ],
    faqs: [
      { q: 'Can I split a password-protected PDF?', a: 'If your browser can open the PDF (i.e. you have the password), Toolyy can split it. The decryption happens locally.' },
      { q: 'Does splitting reduce PDF quality?', a: 'No. Pages are extracted at their original resolution with no re-compression or quality loss.' },
    ],
    relatedTools: ['image-converter', 'json-formatter', 'background-remover'],
  },
  {
    id: 'extract-pdf-pages',
    parentTool: 'pdf-splitter',
    path: '/tools/extract-pdf-pages',
    title: 'Extract Pages from PDF Free — Select & Download',
    description: 'Extract specific pages from any PDF document. Select individual pages or ranges, download them separately. Works offline in your browser.',
    h1: 'Extract Pages from PDF',
    intro: 'Need just a few pages from a large PDF? Toolyy lets you select exactly which pages to extract and download them as individual PDFs or merge them into one file. Everything happens in your browser — your documents stay private.',
    steps: [
      'Open the PDF Page Extractor tool on Toolyy.',
      'Upload your PDF by dragging it into the workspace.',
      'Check the pages you need, then click download to save them.',
    ],
    faqs: [
      { q: 'Can I extract a range of pages like 5-15?', a: 'Yes. Enter page ranges like "5-15" or individual pages like "1, 3, 7" to extract exactly what you need.' },
      { q: 'Is there a page limit?', a: 'No artificial limit. Your device RAM is the only constraint — most devices handle PDFs with hundreds of pages.' },
    ],
    relatedTools: ['image-converter', 'mp4-to-mp3', 'qr-generator'],
  },
  {
    id: 'pdf-page-separator',
    parentTool: 'pdf-splitter',
    path: '/tools/pdf-page-separator',
    title: 'PDF Page Separator — Break PDF Into Single Pages',
    description: 'Separate any multi-page PDF into individual single-page PDF files. Browser-based, instant, and completely private. No software installation needed.',
    h1: 'PDF Page Separator',
    intro: 'Break any multi-page PDF into individual single-page files instantly. No software to install, no account required, no file size limits. Toolyy runs entirely in your browser so your documents remain completely private.',
    steps: [
      'Visit Toolyy and choose the PDF Page Separator.',
      'Drag your multi-page PDF into the upload area.',
      'Click to split all pages or select specific ones to separate, then download.',
    ],
    faqs: [
      { q: 'What happens to my PDF after processing?', a: 'Nothing — your file never leaves your device. All processing happens locally in JavaScript. When you close the tab, everything is gone.' },
      { q: 'Can I separate a scanned PDF?', a: 'Yes. Scanned PDFs (image-based) split exactly like text-based PDFs since the tool operates on the PDF structure, not the content.' },
    ],
    relatedTools: ['background-remover', 'social-resizer', 'unit-converter'],
  },

  // ── Image Converter variants ──────────────────────────────────────
  {
    id: 'png-to-webp',
    parentTool: 'image-converter',
    path: '/tools/png-to-webp',
    title: 'Convert PNG to WebP Free — Reduce File Size 80%',
    description: 'Convert PNG images to WebP format and reduce file sizes by up to 80% without visible quality loss. Browser-based, instant, no upload needed.',
    h1: 'PNG to WebP Converter',
    intro: "Convert your PNG images to Google's WebP format for dramatically smaller file sizes — up to 80% reduction with nearly identical visual quality. Perfect for web developers, bloggers, and anyone optimizing page load speed.",
    steps: [
      'Open the PNG to WebP converter on Toolyy.',
      'Drag and drop your PNG file into the workspace.',
      'Adjust quality if needed, then download your optimized WebP image.',
    ],
    faqs: [
      { q: 'How much smaller is WebP compared to PNG?', a: 'WebP lossless is typically 26% smaller than PNG. With lossy compression at high quality settings, reductions of 60-80% are common with minimal visible difference.' },
      { q: 'Will my transparent backgrounds be preserved?', a: 'Yes. WebP fully supports alpha channel transparency, so your transparent PNGs convert perfectly.' },
    ],
    relatedTools: ['background-remover', 'social-resizer', 'pdf-splitter'],
  },
  {
    id: 'jpg-to-webp',
    parentTool: 'image-converter',
    path: '/tools/jpg-to-webp',
    title: 'Convert JPG to WebP Online Free — Instant Compression',
    description: 'Convert JPG/JPEG images to modern WebP format for 25-34% smaller files at the same visual quality. No upload, runs in your browser.',
    h1: 'JPG to WebP Converter',
    intro: "Transform your JPG and JPEG photos into the modern WebP format for leaner, faster-loading images. Google's WebP format delivers 25-34% better compression than JPEG at equivalent visual quality — and Toolyy converts them instantly in your browser.",
    steps: [
      'Open the JPG to WebP converter on Toolyy.',
      'Drop your JPG or JPEG image into the converter.',
      'Use the quality slider to fine-tune compression, then download your WebP file.',
    ],
    faqs: [
      { q: 'Is WebP better than JPG for websites?', a: 'Yes. WebP files are 25-34% smaller than equivalent JPEG images. Google recommends WebP for faster page loads and better Core Web Vitals scores.' },
      { q: 'Do all browsers support WebP now?', a: 'Yes — WebP has over 97% global browser support including Chrome, Firefox, Edge, Safari 14+, and all modern mobile browsers.' },
    ],
    relatedTools: ['social-resizer', 'background-remover', 'qr-generator'],
  },
  {
    id: 'compress-images-online',
    parentTool: 'image-converter',
    path: '/tools/compress-images-online',
    title: 'Compress Images Online Free — No Quality Loss',
    description: 'Compress JPG and PNG images to WebP for up to 80% smaller file sizes with adjustable quality. No uploads, fully private, works on any device.',
    h1: 'Compress Images Online',
    intro: 'Shrink your images without sacrificing visual quality by converting to optimized WebP format. Adjust the compression slider to find the perfect balance between file size and image fidelity. All processing happens in your browser — your images never leave your device.',
    steps: [
      'Open the Image Compressor on Toolyy.',
      'Upload your JPG or PNG images by dragging them in.',
      'Set your desired quality level and download the compressed WebP output.',
    ],
    faqs: [
      { q: 'Can I compress images without losing quality?', a: 'Yes. At quality settings above 85%, WebP compression produces virtually indistinguishable results from the original while reducing file size by 30-50%.' },
      { q: 'Is this better than TinyPNG or Squoosh?', a: 'Toolyy never uploads your files to any server, making it the most private option. Quality and compression ratios are comparable to other tools.' },
    ],
    relatedTools: ['pdf-splitter', 'social-resizer', 'background-remover'],
  },

  // ── Background Remover variants ───────────────────────────────────
  {
    id: 'remove-background',
    parentTool: 'background-remover',
    path: '/tools/remove-background',
    title: 'Remove Background from Image Free — AI-Powered',
    description: 'Remove backgrounds from any photo using AI that runs entirely in your browser. No uploads, no account, instant transparent PNG output.',
    h1: 'Remove Background from Image',
    intro: "Erase backgrounds from photos instantly using state-of-the-art AI that runs entirely on your device. Unlike remove.bg or Canva, Toolyy never uploads your images to any server — the neural network runs via WebAssembly right in your browser.",
    steps: [
      'Open the Background Remover on Toolyy.',
      'Drop your photo (JPG, PNG, or WebP) into the workspace.',
      'Wait a few seconds for the AI to process, then download your transparent PNG.',
    ],
    faqs: [
      { q: 'How does this compare to remove.bg?', a: 'Similar AI quality, but Toolyy processes everything locally on your device. No uploads, no watermarks, no account required, and no per-image fees.' },
      { q: 'Can I remove backgrounds from product photos?', a: "Yes. The AI handles products, people, animals, and objects. It works best when there's clear contrast between the subject and background." },
    ],
    relatedTools: ['social-resizer', 'image-converter', 'qr-generator'],
  },
  {
    id: 'transparent-background-maker',
    parentTool: 'background-remover',
    path: '/tools/transparent-background-maker',
    title: 'Make Image Background Transparent — Free AI Tool',
    description: 'Make any image background transparent with on-device AI. Get clean cutouts for logos, product photos, and portraits. No watermarks, no sign-up.',
    h1: 'Make Image Background Transparent',
    intro: 'Create transparent backgrounds for logos, product photos, portraits, and design assets using on-device AI. The output is a lossless PNG with clean, precise edges — ready for use in presentations, e-commerce listings, or graphic design projects.',
    steps: [
      'Open the Transparent Background Maker on Toolyy.',
      'Upload your image by dropping it into the tool.',
      'The AI automatically detects and removes the background. Download your transparent PNG.',
    ],
    faqs: [
      { q: 'What format is the output?', a: 'PNG with full alpha transparency. This preserves clean edges and is compatible with all design tools and platforms.' },
      { q: 'Does it work with complex backgrounds?', a: 'The AI handles most scenarios well — solid colors, gradients, outdoor scenes, and indoor settings. Very complex or low-contrast backgrounds may need minor touch-up.' },
    ],
    relatedTools: ['image-converter', 'pdf-splitter', 'social-resizer'],
  },
  {
    id: 'remove-bg-alternative',
    parentTool: 'background-remover',
    path: '/tools/remove-bg-alternative',
    title: 'Remove.bg Alternative — Free, No Upload, No Limits',
    description: 'Free alternative to remove.bg that processes images 100% locally. No watermarks, no per-image fees, no file uploads. AI runs in your browser.',
    h1: 'Free Remove.bg Alternative',
    intro: "Looking for a remove.bg alternative without watermarks, upload limits, or monthly fees? Toolyy's background remover uses the same class of AI models but runs everything locally in your browser. Your images are never sent to any server, and there are zero usage limits.",
    steps: [
      "Visit Toolyy's free background remover.",
      'Drag and drop any image into the processing area.',
      'Download your transparent PNG instantly — no account or payment needed.',
    ],
    faqs: [
      { q: 'Why is this free when remove.bg charges per image?', a: 'Because Toolyy processes everything on your device using WebAssembly, there are no server costs per image. This lets us offer unlimited free usage.' },
      { q: 'Is the quality as good as remove.bg?', a: 'For most images, yes. The on-device AI model produces comparable results. Very complex hair details or semi-transparent objects may differ slightly.' },
    ],
    relatedTools: ['image-converter', 'social-resizer', 'mp4-to-mp3'],
  },

  // ── QR Generator variants ─────────────────────────────────────────
  {
    id: 'qr-code-generator',
    parentTool: 'qr-generator',
    path: '/tools/qr-code-generator',
    title: 'QR Code Generator Free — Create & Download Instantly',
    description: 'Generate QR codes from any URL, text, Wi-Fi credentials, or phone number. Customize colors, download as high-res PNG. No tracking, no data collection.',
    h1: 'Free QR Code Generator',
    intro: 'Create professional QR codes in seconds from URLs, plain text, Wi-Fi network credentials, or phone numbers. Customize foreground and background colors to match your brand. Download as high-resolution PNG — your data never touches a server.',
    steps: [
      'Open the QR Code Generator on Toolyy.',
      'Enter your URL, text, Wi-Fi details, or phone number.',
      'Customize colors if desired, then download your QR code as PNG.',
    ],
    faqs: [
      { q: 'Do these QR codes expire?', a: 'Never. The data is encoded directly into the QR pattern — no middleman server or redirect service that could go offline.' },
      { q: 'Can I create QR codes for Wi-Fi passwords?', a: 'Yes. Enter your network name (SSID), password, and encryption type. Scanning the QR code auto-connects devices to your network.' },
    ],
    relatedTools: ['background-remover', 'social-resizer', 'unit-converter'],
  },
  {
    id: 'wifi-qr-code',
    parentTool: 'qr-generator',
    path: '/tools/wifi-qr-code',
    title: 'WiFi QR Code Generator — Share Network Instantly',
    description: 'Create a QR code for your WiFi network. Guests scan to connect automatically — no typing passwords. Generated locally, no data stored.',
    h1: 'WiFi QR Code Generator',
    intro: "Create a scannable QR code for your WiFi network so guests, customers, or visitors can connect instantly by scanning — no need to type long passwords. Perfect for cafes, offices, Airbnbs, and home networks. The QR code is generated locally and never stored anywhere.",
    steps: [
      "Open the WiFi QR Code Generator on Toolyy.",
      'Enter your WiFi network name (SSID), password, and security type (WPA/WPA2).',
      'Download or print the QR code for guests to scan.',
    ],
    faqs: [
      { q: 'Which devices can scan WiFi QR codes?', a: 'All modern smartphones — iPhone (iOS 11+) and Android (10+) can scan WiFi QR codes natively from the camera app.' },
      { q: "Is sharing my WiFi password via QR code secure?", a: "The password is encoded in the QR pattern. It's as secure as sharing the password verbally — just more convenient. The QR code is generated locally and never uploaded." },
    ],
    relatedTools: ['background-remover', 'social-resizer', 'image-converter'],
  },

  // ── MP4 to MP3 variants ───────────────────────────────────────────
  {
    id: 'video-to-audio',
    parentTool: 'mp4-to-mp3',
    path: '/tools/video-to-audio',
    title: 'Convert Video to Audio Online Free — Extract Sound',
    description: 'Extract audio from any video file (MP4, WebM, MOV, AVI, MKV) directly in your browser. Choose MP3 quality from 128-320kbps. No upload needed.',
    h1: 'Video to Audio Converter',
    intro: 'Extract the audio track from any video file — MP4, WebM, MOV, AVI, or MKV — and save it as high-quality MP3. Powered by FFmpeg compiled to WebAssembly, everything runs in your browser. No file uploads, no size limits, no data tracking.',
    steps: [
      'Open the Video to Audio converter on Toolyy.',
      'Drop your video file into the workspace.',
      'Select your preferred MP3 bitrate (128–320 kbps) and download the extracted audio.',
    ],
    faqs: [
      { q: 'What video formats can I extract audio from?', a: 'MP4, WebM, MOV, AVI, and MKV with H.264, H.265, VP8, VP9, and AV1 codecs are all supported.' },
      { q: 'Can I extract audio from large video files?', a: "Yes. Since processing happens locally, there are no upload size limits. Your device's RAM is the only constraint." },
    ],
    relatedTools: ['pdf-splitter', 'image-converter', 'unit-converter'],
  },
  {
    id: 'extract-audio-from-video',
    parentTool: 'mp4-to-mp3',
    path: '/tools/extract-audio-from-video',
    title: 'Extract Audio from Video Free — Browser-Based',
    description: "Pull the audio track from any video and save as MP3. Runs entirely in your browser with FFmpeg WebAssembly. No server upload, no account.",
    h1: 'Extract Audio from Video',
    intro: "Need the audio from a video file? Toolyy extracts audio tracks from MP4, MOV, WebM, and more — converting them to MP3 at your chosen quality. The entire conversion runs locally via FFmpeg WebAssembly, so even sensitive content stays completely private.",
    steps: [
      'Open the Audio Extractor on Toolyy.',
      'Upload your video by dragging it into the browser tool.',
      'Choose audio quality and click convert. Download your MP3 when ready.',
    ],
    faqs: [
      { q: 'How long does conversion take?', a: 'Depends on file size and your device. A 5-minute video typically converts in 10-30 seconds on modern hardware.' },
      { q: 'Does this work on phone?', a: 'Yes, but large videos (over 500MB) may be slow on mobile devices due to limited RAM and processing power.' },
    ],
    relatedTools: ['social-resizer', 'qr-generator', 'json-formatter'],
  },

  // ── JSON Formatter variants ───────────────────────────────────────
  {
    id: 'json-beautifier',
    parentTool: 'json-formatter',
    path: '/tools/json-beautifier',
    title: 'JSON Beautifier Online — Format & Pretty Print',
    description: 'Beautify and pretty-print messy JSON with syntax highlighting. Paste raw JSON and get clean, indented, readable output. Runs in your browser.',
    h1: 'JSON Beautifier',
    intro: 'Turn minified or messy JSON into clean, indented, syntax-highlighted code in one click. Paste API responses, config files, or any raw JSON and get perfectly formatted output. Everything processes locally — safe for API keys and sensitive data.',
    steps: [
      'Open the JSON Beautifier on Toolyy.',
      'Paste your raw or minified JSON into the editor.',
      'Click Beautify to format it. Copy the result or download as a file.',
    ],
    faqs: [
      { q: 'Can I beautify JSON with syntax errors?', a: 'The tool will highlight the exact location of syntax errors so you can fix them before beautifying.' },
      { q: 'Is it safe to paste API keys in this tool?', a: 'Yes. Everything runs locally in your browser — no data is ever sent to any server.' },
    ],
    relatedTools: ['pdf-splitter', 'unit-converter', 'qr-generator'],
  },
  {
    id: 'json-validator',
    parentTool: 'json-formatter',
    path: '/tools/json-validator',
    title: 'JSON Validator Online — Check Syntax Instantly',
    description: "Validate JSON syntax and find errors with precise line-by-line reporting. Paste any JSON to check if it's valid. Browser-based, private.",
    h1: 'JSON Validator',
    intro: 'Check whether your JSON is valid with instant, precise error reporting. Paste API responses, configuration files, or any JSON data to validate syntax and identify problems. Line-level error messages help you fix issues fast.',
    steps: [
      'Open the JSON Validator on Toolyy.',
      'Paste your JSON into the editor.',
      'Click Validate to check syntax. Errors are highlighted with line numbers and descriptions.',
    ],
    faqs: [
      { q: 'What types of JSON errors does it detect?', a: 'Missing commas, extra commas, unquoted keys, mismatched brackets, invalid escape sequences, trailing commas, and all other syntax violations.' },
      { q: 'Can I validate large JSON files?', a: "Yes. Since parsing happens in your browser, there's no server-side limit. Files up to several megabytes parse instantly." },
    ],
    relatedTools: ['image-converter', 'pdf-splitter', 'mp4-to-mp3'],
  },

  // ── Social Resizer variants ───────────────────────────────────────
  {
    id: 'instagram-image-resizer',
    parentTool: 'social-resizer',
    path: '/tools/instagram-image-resizer',
    title: 'Instagram Image Resizer — Perfect Post & Story Sizes',
    description: 'Resize and crop images to exact Instagram dimensions: 1080x1080 for posts, 1080x1920 for stories. Visual crop editor, instant download.',
    h1: 'Instagram Image Resizer',
    intro: 'Get pixel-perfect Instagram images every time. Resize and crop photos to exact Instagram dimensions — 1080x1080 for square posts, 1080x1350 for portrait, or 1080x1920 for stories. Visual crop editor lets you frame the perfect composition before downloading.',
    steps: [
      'Open the Instagram Image Resizer on Toolyy.',
      'Upload your photo and select the Instagram format (Post, Story, or Portrait).',
      'Position the crop frame and download your perfectly sized image.',
    ],
    faqs: [
      { q: 'What is the best image size for Instagram posts?', a: 'Square posts: 1080x1080px. Portrait posts: 1080x1350px. Stories and Reels: 1080x1920px. All at 72 DPI.' },
      { q: 'Will resizing reduce my image quality?', a: 'No. Toolyy uses high-quality Canvas resampling. Images are exported at maximum JPEG quality to preserve detail.' },
    ],
    relatedTools: ['background-remover', 'image-converter', 'qr-generator'],
  },
  {
    id: 'youtube-thumbnail-maker',
    parentTool: 'social-resizer',
    path: '/tools/youtube-thumbnail-maker',
    title: 'YouTube Thumbnail Size Resizer — 1280x720 Perfect Crop',
    description: "Resize any image to YouTube's recommended 1280x720 thumbnail dimensions. Visual crop editor with instant download. Free, no account.",
    h1: 'YouTube Thumbnail Resizer',
    intro: "Resize and crop images to YouTube's recommended thumbnail size of 1280x720 pixels. Upload any image, position the crop to frame the best shot, and download a perfectly sized thumbnail ready for upload.",
    steps: [
      'Open the YouTube Thumbnail Resizer on Toolyy.',
      'Upload your image and select the YouTube Thumbnail preset.',
      'Adjust the crop area to frame your thumbnail, then download.',
    ],
    faqs: [
      { q: 'What is the ideal YouTube thumbnail size?', a: '1280x720 pixels (16:9 aspect ratio) with a minimum width of 640 pixels. Maximum file size is 2MB. Use JPG, GIF, or PNG format.' },
      { q: 'Do I need Photoshop to make thumbnails?', a: "No. Toolyy's browser-based resizer handles cropping and resizing instantly. For text overlays and effects, you'd need a design tool, but for sizing, this is all you need." },
    ],
    relatedTools: ['background-remover', 'image-converter', 'mp4-to-mp3'],
  },
  {
    id: 'tiktok-image-resizer',
    parentTool: 'social-resizer',
    path: '/tools/tiktok-image-resizer',
    title: 'TikTok Image Resizer — 1080x1920 Perfect Size',
    description: 'Resize images to TikTok’s 1080x1920 portrait dimensions. Crop visually, download instantly. Free, browser-based, no signup.',
    h1: 'TikTok Image Resizer',
    intro: "Resize your images to TikTok's ideal 1080x1920 pixel portrait format. Whether you're creating cover images, slideshow content, or promotional graphics, get the exact dimensions TikTok requires — all processed locally in your browser.",
    steps: [
      'Open the TikTok Image Resizer on Toolyy.',
      'Upload your image and select the TikTok/Story preset (1080x1920).',
      'Drag to position the crop and download your perfectly sized image.',
    ],
    faqs: [
      { q: 'What size should TikTok images be?', a: '1080x1920 pixels (9:16 aspect ratio) for full-screen portrait content. This is the same as Instagram Stories and Reels.' },
      { q: 'Can I resize landscape photos for TikTok?', a: 'Yes. The visual crop editor lets you select which portion of a landscape image to use in the vertical TikTok frame.' },
    ],
    relatedTools: ['background-remover', 'image-converter', 'qr-generator'],
  },

  // ── Unit Converter variants ───────────────────────────────────────
  {
    id: 'kg-to-lbs',
    parentTool: 'unit-converter',
    path: '/tools/kg-to-lbs',
    title: 'KG to LBS Converter — Kilograms to Pounds Calculator',
    description: 'Convert kilograms to pounds instantly. Type a value and see the result in real-time. Supports decimal precision. Free, works offline.',
    h1: 'Kilograms to Pounds Converter',
    intro: "Convert kilograms to pounds (and back) instantly with real-time results as you type. Whether you're tracking fitness goals, shipping packages, or converting recipes, get precise kg-to-lbs conversions without searching through conversion tables.",
    steps: [
      'Open the Unit Converter on Toolyy.',
      'Select the Weight category and choose Kilograms → Pounds.',
      'Type your value to see the converted result instantly.',
    ],
    faqs: [
      { q: 'How many pounds is 1 kilogram?', a: '1 kilogram equals approximately 2.20462 pounds. The converter provides full decimal precision.' },
      { q: 'Does this work offline?', a: 'Yes. Once the page loads, all conversions happen locally with zero server communication.' },
    ],
    relatedTools: ['pdf-splitter', 'json-formatter', 'qr-generator'],
  },
  {
    id: 'celsius-to-fahrenheit',
    parentTool: 'unit-converter',
    path: '/tools/celsius-to-fahrenheit',
    title: 'Celsius to Fahrenheit Converter — Temperature Calculator',
    description: 'Convert Celsius to Fahrenheit instantly. Real-time conversion as you type. Works offline after loading. Free, no ads.',
    h1: 'Celsius to Fahrenheit Converter',
    intro: 'Convert temperatures between Celsius and Fahrenheit instantly. Type any temperature value and see the conversion update in real-time. Useful for cooking, travel, weather, science, and everyday life.',
    steps: [
      'Open the Unit Converter on Toolyy.',
      'Select the Temperature category and choose Celsius → Fahrenheit.',
      'Enter your temperature to see the instant conversion.',
    ],
    faqs: [
      { q: 'What is the formula for Celsius to Fahrenheit?', a: '°F = (°C × 9/5) + 32. For example, 100°C = 212°F (boiling point of water) and 0°C = 32°F (freezing point).' },
      { q: 'What is normal body temperature in both scales?', a: 'Normal body temperature is approximately 37°C or 98.6°F.' },
    ],
    relatedTools: ['qr-generator', 'json-formatter', 'image-converter'],
  },
  {
    id: 'cm-to-inches',
    parentTool: 'unit-converter',
    path: '/tools/cm-to-inches',
    title: 'CM to Inches Converter — Centimeters to Inches Calculator',
    description: 'Convert centimeters to inches with instant real-time results. Precise decimal conversion for measurements, sewing, DIY, and more.',
    h1: 'Centimeters to Inches Converter',
    intro: 'Convert centimeters to inches (and inches to centimeters) with real-time results as you type. Essential for international shopping, DIY projects, sewing patterns, and any situation where metric and imperial measurements meet.',
    steps: [
      'Open the Unit Converter on Toolyy.',
      'Select the Length category and choose Centimeters → Inches.',
      'Type your measurement to see the conversion instantly.',
    ],
    faqs: [
      { q: 'How many inches is 1 centimeter?', a: '1 centimeter equals approximately 0.393701 inches. Conversely, 1 inch equals 2.54 centimeters exactly.' },
      { q: 'Is this precise enough for engineering?', a: 'Yes. The converter uses IEEE 754 double-precision floating point, providing 15-17 significant digits of precision.' },
    ],
    relatedTools: ['pdf-splitter', 'social-resizer', 'mp4-to-mp3'],
  },
]

export const ALIAS_MAP = Object.fromEntries(
  SEO_ALIASES.map(a => [a.path, a])
)
