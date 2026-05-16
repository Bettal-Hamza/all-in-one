# Toolyy — Technical Documentation

A comprehensive breakdown of every technology, library, and architectural decision behind Toolyy (toolyy.net).

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Build & Dev Tooling](#build--dev-tooling)
5. [Tool-by-Tool Tech Breakdown](#tool-by-tool-tech-breakdown)
6. [SEO & Structured Data](#seo--structured-data)
7. [Security & Privacy Architecture](#security--privacy-architecture)
8. [Performance Optimisations](#performance-optimisations)
9. [Project Structure](#project-structure)

---

## High-Level Architecture

Toolyy is a hybrid application with two distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│                                                         │
│  React SPA  ─>  All file processing happens HERE        │
│  (PDF splitting, image conversion, background removal,  │
│   audio extraction, QR generation, JSON formatting,     │
│   unit conversion, social resizing)                     │
│                                                         │
│  Technologies: React 18, Vite, Tailwind CSS,            │
│  Framer Motion, pdf-lib, @imgly/background-removal,     │
│  @ffmpeg/ffmpeg (WASM), qrcode.react, Canvas API        │
└────────────────────────┬────────────────────────────────┘
                         │ Only network call:
                         │ POST /api/suggestions
                         │ (user feedback form)
┌────────────────────────▼────────────────────────────────┐
│                   Server (Node.js)                      │
│                                                         │
│  Express 5  ─>  Handles ONLY the suggestion/feedback    │
│                 form submissions                        │
│                                                         │
│  Technologies: Express 5, better-sqlite3, CORS          │
│  Database: SQLite (WAL mode) stored in /data/           │
└─────────────────────────────────────────────────────────┘
```

The key principle: **no user file ever touches the server**. Every file operation runs entirely in the browser. The server exists only to persist user feedback/suggestions into a SQLite database.

---

## Frontend Stack

### React 18 (`react` + `react-dom` v18.3.1)

The UI framework. Toolyy uses React 18 with:

- **Functional components only** — no class components anywhere in the codebase.
- **Hooks** — `useState`, `useEffect`, `useRef`, `useCallback`, and `useMemo` are the primary hooks used.
- **React.lazy() + Suspense** — every page except `HomePage` and every tool component is lazily loaded. This means the browser only downloads the code for a tool when the user navigates to it, drastically reducing the initial bundle size.

```jsx
// Example from App.jsx
const AboutPage = React.lazy(() => import('./pages/AboutPage.jsx'))
```

Each tool is also lazy-loaded via the `component` field in the tools registry (`src/constants/tools.js`):
```jsx
component: () => import('../components/tools/PdfSplitter.jsx')
```

### React Router DOM v6 (`react-router-dom` v6.23.1)

Client-side routing for the single-page application. Handles:

- Static pages: `/`, `/about`, `/privacy`, `/terms`, `/feedback`
- Dynamic tool pages: `/tools/pdf-splitter`, `/tools/image-converter`, etc.
- 404 fallback: `NotFoundPage` catches all unmatched routes via `<Route path="*">`.

The tool routes are auto-generated from the `TOOLS` array in `src/constants/tools.js` — when a new tool is added to that array with `live: true` and a `component` function, it automatically gets a route.

### Tailwind CSS v3.4.4

Utility-first CSS framework. Used for all styling across the app. Key details:

- **PostCSS pipeline**: Tailwind is processed via PostCSS (`postcss` v8.4.38) with `autoprefixer` (v10.4.19) for browser compatibility.
- **Custom design tokens**: The project uses custom colours defined in the Tailwind config (e.g., `brand`, `brand-light`, `surface-card`, `surface-border`).
- **Utility classes for everything**: No separate CSS files — every component is styled inline using Tailwind classes.
- **Custom utilities**: Classes like `shadow-glass`, `shadow-glass-lg` are custom for the glassmorphism card effects.

### Framer Motion v12.38.0

Animation library for React. Used extensively across the entire app for:

- **Page entrance animations**: Every section uses a `fadeUp()` helper that creates staggered opacity + translate-Y animations.
- **Micro-interactions**: Buttons use `whileHover` and `whileTap` for scale-based spring animations.
- **AnimatePresence**: Handles enter/exit transitions for conditional elements (success states, error banners, loading spinners).
- **Viewport-triggered animations**: The `whileInView` prop triggers animations when sections scroll into view (used on the homepage sections like UtilityPitch and HowItWorks).

```jsx
// Common pattern throughout the codebase
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
})
```

The easing curve `[0.22, 1, 0.36, 1]` is a custom cubic bezier that produces a smooth deceleration — fast start, gentle landing.

### Lucide React v1.14.0

Icon library. Every icon in the app comes from Lucide — an open-source icon set that provides tree-shakeable SVG components. Icons are imported individually to ensure dead code elimination:

```jsx
import { Lock, Zap, BadgeCheck } from 'lucide-react'
```

This means only the icons actually used end up in the bundle.

### Canvas Confetti v1.9.4

A lightweight library for the confetti particle effect. Triggered after successful tool operations (e.g., after downloading a split PDF or converted image) to provide delightful feedback.

---

## Backend Stack

### Express 5 (`express` v5.2.1)

The latest major version of Express, used for the minimal API server. Key configuration:

- **Trust proxy**: `app.set('trust proxy', 1)` — configured for deployment behind reverse proxies (Nginx, Cloudflare). Ensures `req.ip` reflects the real client IP, not the proxy's.
- **CORS**: Enabled in development only (`cors` v2.8.6), allowing the Vite dev server at `localhost:5173` to reach the API at `localhost:3001`.
- **Body parsing**: `express.json({ limit: '32kb' })` — hard cap on request body size to prevent oversized-body attacks.
- **SPA fallback**: In production, Express serves the Vite build output from `/dist` and returns `index.html` for any unmatched route, enabling React Router to handle client-side navigation.

### better-sqlite3 v12.10.0

A synchronous, native SQLite3 binding for Node.js. Used to persist user feedback submissions. Key details:

- **WAL mode** (Write-Ahead Logging): Enabled via `db.pragma('journal_mode = WAL')` for faster writes and concurrent read/write support.
- **Foreign keys** enabled via pragma.
- **Database location**: `data/suggestions.db` (auto-created).
- **Schema**: A single `suggestions` table with columns: `id`, `user_name`, `user_email`, `tool_category`, `message`, `ip_address`, `created_at`.
- **Rate limiting**: A prepared statement checks how many submissions an IP has made in the last hour (limit: 3 per hour).
- **Indexing**: A composite index on `(ip_address, created_at)` accelerates rate-limit lookups.

### API Endpoint: `POST /api/suggestions`

The only API endpoint. Receives feedback form submissions with:

1. **Honeypot spam protection** — a hidden `website_url` field. Bots that fill it get a fake success response; the submission is silently discarded.
2. **IP-based rate limiting** — max 3 submissions per IP per hour.
3. **Input sanitisation** — strips HTML tags, collapses HTML entities, trims, and truncates to field-specific max lengths.
4. **Validation** — name required, category must be from a whitelist, message minimum 10 characters, email format check (if provided).

---

## Build & Dev Tooling

### Vite v5.3.1

The build tool and dev server. Configuration in `vite.config.js`:

- **Plugin**: `@vitejs/plugin-react` (v4.3.1) — enables JSX transform, Fast Refresh in dev mode.
- **Dev proxy**: Requests to `/api` are proxied to `http://localhost:3001` (the Express server) during development, avoiding CORS issues.
- **Manual chunk splitting**: The `rollupOptions.output.manualChunks` configuration splits the production bundle into optimised chunks:

| Chunk name | Contents | Why isolated |
|---|---|---|
| `vendor-bg-removal` | `@imgly/background-removal` | Very large (~5 MB); only loaded on the Background Remover page |
| `vendor-ffmpeg` | `@ffmpeg/ffmpeg` + `@ffmpeg/util` | Large WASM-based library; only loaded on the MP4 to MP3 page |
| `vendor-pdf` | `pdf-lib` | Only loaded on the PDF Splitter page |
| `vendor-motion` | `framer-motion` | Shared across all pages but large; isolated for long-term caching |
| `vendor-react` | `react`, `react-dom`, `react-router-dom` | Rarely changes; maximises browser cache lifetime |

This strategy ensures that a user visiting only the QR Generator never downloads the 5 MB AI model library or the FFmpeg WASM binary.

### Concurrently v9.2.1

Runs the Vite dev server and the Express API server in parallel during development:

```bash
npm run dev  # runs: concurrently "node --watch server/index.js" "vite"
```

The `--watch` flag on Node.js uses the built-in file watcher (Node 18+) to auto-restart the server on changes.

### Sitemap Generator (`scripts/generate-sitemap.js`)

A custom Node.js script that:

1. Imports the `TOOLS` array from `src/constants/tools.js`.
2. Combines tool routes with static page routes.
3. Generates a standards-compliant `sitemap.xml` with `<lastmod>`, `<changefreq>`, and `<priority>` for each URL.
4. Runs automatically before every build via the `prebuild` npm script.
5. Base URL defaults to `https://toolyy.net` but can be overridden with the `SITE_URL` env var.

---

## Tool-by-Tool Tech Breakdown

### 1. PDF Splitter (`PdfSplitter.jsx`)

**Core library**: `pdf-lib` (v1.17.1)

- Reads the uploaded PDF entirely in the browser using `PDFDocument.load()`.
- Iterates through each page and creates a new single-page PDF document using `PDFDocument.create()` + `copyPages()`.
- Each page is serialised to a `Uint8Array` via `pdfDoc.save()` and turned into a downloadable blob.
- No server interaction — the File API reads the file, pdf-lib processes it, and the Blob API creates the download.

**Helper module**: `src/lib/pdfSplitter.js` — contains the core splitting logic separated from the React component.

### 2. Image to WebP Converter (`ImageOptimizer.jsx`)

**Core technology**: HTML5 Canvas API

- Loads the uploaded image into an `<img>` element via `URL.createObjectURL()`.
- Draws the image onto an off-screen `<canvas>` element.
- Uses `canvas.toBlob(callback, 'image/webp', quality)` to convert to WebP format.
- The quality slider adjusts the second parameter (0.0 to 1.0).
- Displays before/after file size comparison and compression ratio.

No external library needed — the browser's built-in Canvas API handles the conversion natively.

### 3. QR Code Generator (`QrGenerator.jsx`)

**Core library**: `qrcode.react` (v4.2.0)

- Renders a QR code as an SVG or Canvas element based on user input (URL, text, phone number, email).
- Supports two styles: classic black-and-white and a branded indigo variant.
- Download functionality converts the rendered QR code to a PNG via Canvas API.
- Entirely client-side — the encoded data is computed in JavaScript using Reed-Solomon error correction.

### 4. Background Remover (`BackgroundRemover.jsx`)

**Core library**: `@imgly/background-removal` (v1.7.0)

This is the most technically complex tool. It runs a neural network directly in the browser:

- Uses **ONNX Runtime** compiled to **WebAssembly** to run an AI segmentation model.
- The model (`u2net` or similar) performs pixel-level foreground/background classification.
- **Web Workers** are used to run inference off the main thread, keeping the UI responsive.
- The model weights (~5 MB) are downloaded on first use and cached by the browser.
- Processing pipeline: load image → resize to model input dimensions → run inference → generate alpha mask → composite with transparent background → output PNG.

This is why this chunk is isolated in the Vite build config — it's the largest dependency and only needed on one page.

### 5. MP4 to MP3 Converter (`Mp4ToMp3.jsx`)

**Core libraries**: `@ffmpeg/ffmpeg` (v0.12.15) + `@ffmpeg/util` (v0.12.2)

- Uses **FFmpeg compiled to WebAssembly** — the same FFmpeg that powers professional video editing, but running in the browser.
- `@ffmpeg/ffmpeg` provides the JavaScript wrapper; `@ffmpeg/util` provides helper functions for file I/O.
- Processing pipeline: load video file into FFmpeg's virtual filesystem → run the extraction command (`-vn -acodec libmp3lame`) → read the output MP3 from the virtual filesystem → create a downloadable blob.
- **SharedArrayBuffer** + **Cross-Origin Isolation**: FFmpeg WASM requires `SharedArrayBuffer`, which in turn requires the page to be served with `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers.

### 6. JSON Formatter (`JsonFormatter.jsx`)

**Core technology**: Native JavaScript (`JSON.parse` + `JSON.stringify`)

- Parses user input with `JSON.parse()` to validate correctness.
- Beautifies with `JSON.stringify(obj, null, 2)` for pretty-printing.
- Minifies with `JSON.stringify(obj)` (no spacing).
- Custom syntax highlighting renders the formatted output with colour-coded tokens (strings, numbers, booleans, null, keys) using regex-based tokenisation and Tailwind colour classes.
- Entirely native JavaScript — no external library required.

### 7. Social Media Image Resizer (`SocialResizer.jsx`)

**Core technology**: HTML5 Canvas API

- Provides preset dimensions for major social media platforms (Instagram post, Instagram story, TikTok, YouTube thumbnail, Facebook cover, LinkedIn banner, X/Twitter header, etc.).
- Loads the uploaded image onto a canvas, then resizes/crops it to the selected dimensions.
- Uses `canvas.toBlob()` to generate the output in the original format or a specified format.
- Crop positioning lets users adjust the visible area when the source aspect ratio differs from the target.

### 8. Unit Converter (`UnitConverter.jsx`)

**Core technology**: Pure JavaScript arithmetic

- Conversion factors sourced from NIST and SI standards.
- Supports categories: length, weight/mass, temperature, volume, speed, area, data/storage, time, and more.
- Uses IEEE 754 double-precision arithmetic (JavaScript's native `Number` type).
- Temperature conversions use formulas (not simple multiplication factors) for Celsius/Fahrenheit/Kelvin.
- Results displayed with up to 12 significant digits.

---

## SEO & Structured Data

### SEOManager Component (`src/components/SEOManager.jsx`)

A centralised React component that dynamically manages:

- **Document title**: Updated on every page navigation.
- **Meta description**: `<meta name="description">` updated per page.
- **Canonical URL**: `<link rel="canonical">` prevents duplicate content issues.
- **Open Graph tags**: `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`.
- **Twitter Card tags**: `twitter:card`, `twitter:title`, `twitter:description`.
- **JSON-LD structured data**: Every page injects a `SoftwareApplication` schema into the `<head>` as `<script type="application/ld+json">`. This tells search engines the app is free (`price: 0.00`), runs on all operating systems, and requires only a modern browser.

**Cleanup on unmount**: When navigating away from a page, all injected tags are removed and defaults are restored, preventing stale metadata.

### FAQSchema Component (`src/components/FAQSchema.jsx`)

Generates `FAQPage` structured data from FAQ arrays passed as props. Each tool page has its own FAQ section that gets injected as JSON-LD, making the FAQs eligible for Google's rich results (expandable FAQ snippets in search results).

### Sitemap & Robots

- `public/sitemap.xml` — auto-generated from the tools registry.
- `public/robots.txt` — allows all crawlers, points to the sitemap.
- `public/site.webmanifest` — PWA manifest with app name and theme.

---

## Security & Privacy Architecture

### Client-Side File Processing

The foundational security decision: **no user file is ever transmitted to any server**. This is enforced architecturally, not by policy:

- File reading uses the browser's `FileReader` API or `URL.createObjectURL()`.
- Processing uses JavaScript, Canvas API, WebAssembly, or Web Workers.
- Output is delivered via `Blob` URLs or `<a download>` links.
- There is no `fetch()` or `XMLHttpRequest` call for file data anywhere in the tool components.

### Server-Side Security

The Express API has multiple layers of protection:

1. **Body size limit** (32 KB) — prevents large-payload denial of service.
2. **Honeypot field** — invisible form field that catches automated spam bots.
3. **IP-based rate limiting** — 3 submissions per hour per IP, enforced at the database level.
4. **Input sanitisation** — HTML tags stripped, entities collapsed, length truncated.
5. **Category whitelist** — `tool_category` must match a predefined set, preventing injection of arbitrary values.
6. **Email validation** — regex check on optional email field.
7. **Trust proxy** — correctly configured for deployment behind reverse proxies.
8. **CORS** — restricted to the Vite dev server origin in development; disabled in production (same-origin by default).

### No User Accounts

There is no authentication system, no user database, no session management, and no cookies (beyond what the browser itself manages). This eliminates entire categories of vulnerabilities (session hijacking, credential stuffing, password leaks).

---

## Performance Optimisations

### Code Splitting

- **Route-level splitting**: Every page and tool is lazily loaded via `React.lazy()`.
- **Vendor chunk isolation**: Heavy libraries (FFmpeg WASM, background removal AI, pdf-lib) are split into separate chunks that only download when their respective tool is visited.
- **Result**: The initial page load downloads only React, React Router, Framer Motion, Tailwind, and the homepage components. A user who visits only the QR Generator never downloads the ~5 MB background removal model.

### Caching Strategy

The manual chunk configuration in Vite ensures:

- `vendor-react` changes rarely → long cache lifetime.
- `vendor-motion` changes rarely → long cache lifetime.
- Tool-specific chunks (`vendor-pdf`, `vendor-bg-removal`, `vendor-ffmpeg`) are cached independently and only invalidated when that specific library is updated.
- Application code is in its own chunk and updates frequently without busting vendor caches.

### Recent Tools (`src/lib/recentTools.js`)

Tracks which tools the user has recently used in `localStorage` (key: `toolyy_recent`). Used to personalise the tool grid ordering on the homepage — recently used tools appear first.

---

## Project Structure

```
toolyy/
├── index.html                          # Entry HTML — Vite injects the React app here
├── package.json                        # Dependencies & npm scripts
├── vite.config.js                      # Vite build config (plugins, proxy, chunks)
├── postcss.config.js                   # PostCSS: Tailwind + Autoprefixer
├── tailwind.config.js                  # Tailwind theme customisation
│
├── public/                             # Static assets (served as-is)
│   ├── sitemap.xml                     # Auto-generated sitemap
│   ├── robots.txt                      # Crawler rules
│   ├── site.webmanifest                # PWA manifest
│   └── (favicons, images)
│
├── scripts/
│   └── generate-sitemap.js             # Sitemap generator (runs on prebuild)
│
├── server/                             # Express API server
│   ├── index.js                        # Server entry: Express config, SPA fallback
│   ├── db.js                           # SQLite initialisation (better-sqlite3, WAL)
│   └── routes/
│       └── suggestions.js              # POST /api/suggestions (rate limit, honeypot, validation)
│
└── src/                                # React application source
    ├── App.jsx                         # Root: BrowserRouter, routes, layout, Suspense
    ├── constants/
    │   └── tools.js                    # Tool registry (id, label, path, component, live flag)
    ├── lib/
    │   ├── pdfSplitter.js              # PDF splitting logic (pdf-lib)
    │   └── recentTools.js              # localStorage-backed recent tools tracker
    ├── components/
    │   ├── Hero.jsx                    # Homepage hero section
    │   ├── BentoGrid.jsx               # Tool card grid layout
    │   ├── SEOManager.jsx              # Dynamic head tag management (title, meta, OG, JSON-LD)
    │   ├── FAQSchema.jsx               # FAQ structured data generator
    │   ├── SuggestionForm.jsx          # Feedback form (name, email, category, message)
    │   ├── layout/
    │   │   ├── Header.jsx              # Site header + navigation
    │   │   └── Footer.jsx              # Site footer + links
    │   ├── sections/
    │   │   ├── ExpertFAQ.jsx           # Homepage FAQ section
    │   │   ├── HowItWorks.jsx          # Three-step explainer section
    │   │   ├── ToolCatalog.jsx         # Full tool listing section
    │   │   └── UtilityPitch.jsx        # Privacy & utility long-form section
    │   ├── tools/
    │   │   ├── PdfSplitter.jsx         # PDF Splitter (pdf-lib)
    │   │   ├── ImageOptimizer.jsx      # Image to WebP (Canvas API)
    │   │   ├── QrGenerator.jsx         # QR Code Generator (qrcode.react)
    │   │   ├── BackgroundRemover.jsx   # Background Remover (ONNX/WASM AI)
    │   │   ├── Mp4ToMp3.jsx            # MP4 to MP3 (FFmpeg WASM)
    │   │   ├── JsonFormatter.jsx       # JSON Formatter (native JS)
    │   │   ├── SocialResizer.jsx       # Social Media Resizer (Canvas API)
    │   │   └── UnitConverter.jsx       # Unit Converter (pure JS math)
    │   └── ui/
    │       ├── DropZone.jsx            # File drop zone component
    │       ├── MagicDropzone.jsx       # Homepage smart dropzone (auto-detects file type)
    │       ├── DownloadButton.jsx      # Animated download button
    │       ├── ToolCard.jsx            # Individual tool card
    │       ├── MicroCard.jsx           # Compact tool card variant
    │       ├── ProgressBar.jsx         # Animated progress indicator
    │       └── TrustBar.jsx            # Trust signals strip (No Upload, Instant, Free)
    └── pages/
        ├── HomePage.jsx                # Landing page (Hero + sections)
        ├── AboutPage.jsx               # About page (values, stats, story)
        ├── FeedbackPage.jsx            # Feedback/suggestion page
        ├── PrivacyPage.jsx             # Privacy policy
        ├── TermsPage.jsx               # Terms of service
        └── NotFoundPage.jsx            # 404 page
```

---

## Dependency Summary

| Dependency | Version | Purpose | Where Used |
|---|---|---|---|
| react | 18.3.1 | UI framework | Everywhere |
| react-dom | 18.3.1 | React DOM renderer | Entry point |
| react-router-dom | 6.23.1 | Client-side routing | App.jsx, Link components |
| framer-motion | 12.38.0 | Animations & transitions | Every page and component |
| lucide-react | 1.14.0 | SVG icon library | Every page and component |
| tailwindcss | 3.4.4 | Utility-first CSS | All styling |
| pdf-lib | 1.17.1 | PDF reading/writing | PDF Splitter |
| qrcode.react | 4.2.0 | QR code rendering | QR Generator |
| @imgly/background-removal | 1.7.0 | AI background removal (ONNX/WASM) | Background Remover |
| @ffmpeg/ffmpeg | 0.12.15 | Video/audio processing (WASM) | MP4 to MP3 |
| @ffmpeg/util | 0.12.2 | FFmpeg helper utilities | MP4 to MP3 |
| canvas-confetti | 1.9.4 | Confetti particle effect | Post-download celebration |
| express | 5.2.1 | HTTP server framework | Server API |
| better-sqlite3 | 12.10.0 | SQLite database driver | Suggestions storage |
| cors | 2.8.6 | CORS middleware | Dev-mode API access |
| vite | 5.3.1 | Build tool & dev server | Build pipeline |
| @vitejs/plugin-react | 4.3.1 | React support for Vite | Build pipeline |
| postcss | 8.4.38 | CSS transformation pipeline | Tailwind processing |
| autoprefixer | 10.4.19 | Vendor prefix injection | CSS compatibility |
| concurrently | 9.2.1 | Parallel process runner | Dev script |
