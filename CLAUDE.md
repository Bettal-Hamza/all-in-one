# Toolyy (toolyy.net) — Project Context for Claude

## What this is
Toolyy is a **client-side, privacy-first, $0-server-cost** free tools site. Every tool runs
100% in the browser (no uploads, no backend processing) — that's the whole business model:
ad-monetized free tools that cost ~nothing to run. Stack: **React 18 + Vite + Tailwind +
react-router**. Client libs: `@imgly/background-removal`, `@ffmpeg/ffmpeg`, `pdf-lib`,
`pdfjs-dist`, `qrcode.react`. Analytics: **Umami**. (Deeper architecture notes: `TECH.md`.)

## The strategy (READ THIS before suggesting work)
As of **2026-06-25** the site **just launched and has ~0 search traffic** (Search Console:
~368 impressions / 2 clicks in 3 months, avg position ~75). The existing tools (PDF splitter,
background remover, unit converters, etc.) target **ultra-competitive SEO keywords** dominated
by giants (iLovePDF, remove.bg, rapidtables) — a new site can't rank there for many months.

So the growth plan is **NOT "add more SEO tools"** — it's **viral, shareable tools** that bring
traffic from social/communities (TikTok, Reddit) instead of slow search. The first such tool is
the **Fake Chat Generator** (added 2026-06-25). The owner wants easy marketing like the
"post content in a community that links back to the site" playbook.

**AdSense is NOT live yet** (no AdSense script in `index.html`). Don't apply until there's real
content + steady traffic, or it gets rejected. Get traffic first.

## How to add a new tool (the pattern — all 5 places)
1. **Component:** `src/components/tools/<Name>.jsx` — self-contained. Include `<SEOManager>`,
   `<HowToSchema>`, `<FAQSchema>`, an `<h1>` hero, the tool UI, an SEO article (how-to + FAQ),
   and `<RelatedToolsNav currentToolId="...">`. Call `recordVisit('<id>')` in a `useEffect`.
   Use existing Tailwind tokens: `text-brand`, `bg-brand`, `bg-surface-card`,
   `border-surface-border`, `shadow-glass`. Keep everything client-side.
2. **`src/constants/tools.js`** — add a `TOOLS` entry (id, label, description, lucide `Icon`,
   category, `path: '/tools/<id>'`, accent hex, `live: true`, lazy `component`). This auto-wires
   the route (App.jsx), the sitemap, and RelatedToolsNav.
3. **`src/components/BentoGrid.jsx`** — add the tool to a homepage `SECTIONS` entry (hardcoded).
4. **`src/components/sections/ToolCatalog.jsx`** — add to the `CATALOG` array (hardcoded).
5. **`src/constants/seo-aliases.js`** — add 2-4 keyword-variant pages (programmatic SEO),
   `parentTool: '<id>'`. **AND** add a matching entry to the `TOOLS_SEO` array in
   `scripts/prerender-seo.js` so the base `/tools/<id>` page gets baked SEO HTML for crawlers.

Then `npm run build` regenerates the sitemap + prerendered HTML.

## What's already been built for the new strategy
- **Fake Chat Generator** — `/tools/fake-chat` (`src/components/tools/FakeChat.jsx`).
  Makes realistic **iMessage + WhatsApp** chat screenshots (light/dark, editable messages,
  contact name + time). Live DOM preview + a manual **canvas renderer** for crisp PNG download.
  **Optional "toolyy.net" watermark** — a faint bottom-corner mark, ON by default (free marketing
  on shared images) with a one-click toggle to remove it. Shown in both the live preview and the
  canvas export. (Reversed the original "no watermark" choice on 2026-06-26.) 100% client-side.
  SEO alias pages:
  `/tools/fake-imessage-generator`, `/tools/fake-text-message-generator`,
  `/tools/fake-whatsapp-chat-generator`.

## Marketing playbook (the actual priority right now)
The tool only makes money if it gets traffic. The default-on "toolyy.net" watermark gives some
self-advertising on every shared image, but most traffic still has to come from seeding + SEO:
1. **TikTok / Reels "text story" videos** — script a dramatic/funny fake convo, screen-record it
   message-by-message, caption "made with toolyy.net". This format goes viral without followers.
2. **Reddit / meme communities** — post funny fake convos; mention the tool where allowed.
3. **SEO** — the alias pages target "fake imessage generator", "fake text message generator",
   "fake whatsapp chat generator" (less competitive than PDF/bg-remover keywords).
4. Once traffic is steady → apply for AdSense.

## Dev commands
- `npm run dev` — local dev (client + tiny suggestions server)
- `npm run build` — sitemap + Vite build + SEO prerender (writes `dist/`)
- `npm start` — serve the production build

## Guardrails
- Keep every tool **100% client-side** (no server processing) — it's the cost model.
- Don't add heavy dependencies casually; prefer canvas/WASM/vanilla.
- Match the existing "Gen-Z clean" design (indigo `#4F46E5`, glass cards, Sora font).
