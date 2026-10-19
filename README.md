# Toolyy

Free online tools that run **entirely in your browser**. Your files are never uploaded, so the tools are
private by design and cost nothing to host.

## Tools
- **PDF Splitter**: split or extract pages (pdf-lib, pdf.js)
- **Background Remover**: AI background removal on your device (@imgly/background-removal)
- **MP4 to MP3**: extract audio from video (ffmpeg.wasm)
- **Image to WebP**, **Social Media Resizer**: canvas-based image conversion
- **QR Code Generator**, **JSON Formatter**, **Unit Converter**
- **Fake Chat Generator**: realistic iMessage and WhatsApp chat screenshots, rendered to PNG on a canvas

## How it works
- React 18 + Vite + Tailwind CSS, with routing by react-router and lazy-loaded tools.
- Every file operation uses browser APIs (File, Blob, Canvas) and WebAssembly. Nothing touches the server.
- A small Express + SQLite server only stores user feedback and tool suggestions.
- SEO: keyword alias pages, prerendered HTML for crawlers, and a sitemap generated at build time.

More detail in [TECH.md](TECH.md).

## Run it
```bash
npm install
npm run dev     # Vite dev server + feedback API
npm run build   # sitemap + production build + SEO prerender (outputs dist/)
npm start       # serve the production build
```
