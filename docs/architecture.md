# Architecture notes

## Rendering strategy

Every marketing route is a server component that is pre-rendered at build time. Only the API handlers declare `runtime = 'edge'`; the pages no longer do, which is what allows Cloudflare Pages to serve them as static assets instead of invoking an isolate on every request.

Interactive pieces are isolated client components:

| Component | Why it is client |
| --- | --- |
| `app/components/StaticHeader.tsx` | Mobile menu state, active route |
| `app/components/Analytics.tsx` | Consent state and conditional script injection |
| `components/WorkflowSimulator.tsx` | Scenario state machine and timers |
| `components/LiveAgentDemo.tsx` | Chat state and streaming replies |
| `components/RoiCalculator.tsx` | Slider inputs |
| `components/ProjectBriefForm.tsx` | Form state and submission |

The simulator, live demo and ROI calculator are loaded with `next/dynamic`, so they stay out of the initial bundle. That change alone removed roughly 35 kB from first load.

## Content

`lib/blog.ts` holds four long-form articles as typed objects with a small markdown subset (`##`, `###`, lists, quotes, tables). `app/blog/[slug]/page.tsx` renders that subset itself rather than shipping a markdown parser to the browser.

`lib/site.ts` holds constants that appear on more than one page: the canonical URL, contact addresses, studio details and the analytics ID.

## Metadata

- `app/layout.tsx` sets the metadata base, the default title, Open Graph and Twitter cards, icons, and two JSON-LD graphs (`ProfessionalService` and `WebSite`).
- Each page exports its own `metadata` with a route-level canonical.
- `app/page.tsx` adds `FAQPage` and `Service` schema.
- `app/blog/[slug]/page.tsx` adds `BlogPosting`.
- `app/sitemap.ts` uses per-route dates rather than `new Date()`, so `lastmod` means something.
- `app/feed.xml/route.ts` is a static RSS 2.0 feed generated from the same article data.

## Lead intake

`lib/lead.ts` owns validation, sanitation, rate limiting and dispatch. It is deliberately free of framework imports so the test suite can exercise it directly.

Dispatch order is parallel, not sequential. A channel that is not configured is skipped without an error. If every channel fails, the function returns `ok: false`, and the route answers `502` with an email fallback instead of pretending the lead was delivered.

## Styling

Tailwind 4 with tokens declared in `app/globals.css`:

- `--color-ink`, `--color-panel`, `--color-hairline` for the shell.
- `.surface` for the shared card treatment.
- `.rise` keyframes and stagger classes for the hero.
- One global `:focus-visible` outline.
- A `prefers-reduced-motion` block that disables animation and smooth scrolling.

## Images

`next.config.ts` sets `images.unoptimized`, because `@cloudflare/next-on-pages` cannot run the Next image optimiser. Source images are therefore pre-sized: `mascot-288.webp` (9 kB) is used everywhere the mascot appears, and `mascot.webp` is kept only as the master asset.
