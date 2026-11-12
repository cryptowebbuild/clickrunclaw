# ClickRunClaw EU AI Agency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip all legacy OpenClaw SaaS/Supabase/Coolify/Whop code from `cryptowebbuild/clickrunclaw` and rebuild ClickRunClaw.com as a 100% English, EU-first Productized AI Automation & Custom Agent Agency with a live AI demo and SMTP lead delivery to `support@clickrunclaw.com`.

**Architecture:** Clean Next.js 15 App Router static-first frontend (`/` + `/privacy` + `/security`) backed by two lightweight Node.js/API routes: `POST /api/lead` (validates project briefs and dispatches structured lead + client auto-reply emails via `nodemailer` SMTP) and `POST /api/demo` (queries `@google/genai` with a deterministic scripted fallback when `GEMINI_API_KEY` is absent). All legacy SaaS routes, auth, database schemas, and local/BDT/WhatsApp references are removed on a dedicated feature branch.

**Tech Stack:** Next.js 15 (`^15.4.9`), React 19, TypeScript 5.9, Tailwind CSS v4, Framer Motion, Lucide React, `@google/genai`, `nodemailer`, Node.js built-in test runner (`node --test` via `tsx`).

**Spec:** `docs/superpowers/specs/2026-11-12-clickrunclaw-agency-design.md`

## Global Constraints

- **100% English, USD & Async-Only (Zero Calls/Meetings):** Zero Bengali copy, zero BDT pricing, zero `+880` WhatsApp numbers, and zero "Book a Call" / "Schedule a Video Meeting" CTAs anywhere in code, metadata, copy, or emails—highlight 100% async written delivery (`Brief -> Email Proposal -> Live Sandbox Preview -> Deployment`).
- **EU-First Honest Positioning:** Highlight dedicated EU infrastructure (Germany/Finland data centers), isolated containers, zero model training, and optional EU LLM routing—never make false blanket claims about third-party US LLM APIs.
- **Pricing Tiers (exact):** Starter (`$799` setup + `$149/mo`), Growth Funnel (`$1,799` setup + `$299/mo`), Full AI Partner (`$3,499+` setup + `$599/mo`).
- **Contact & Attribution:** Email `support@clickrunclaw.com`; footer attribution `"An AI Automation Venture by CryptoWebBuild"` linking to `https://cryptowebbuild.com/`.
- **GitHub Safety:** Never push directly to `main`; clone `cryptowebbuild/clickrunclaw` and commit on branch `feat/eu-ai-agency-pivot`.
- **Zero Secrets in Git:** SMTP credentials and `GEMINI_API_KEY` stay in `.env.local` / environment variables; document placeholders in `.env.example`.

## Review Focus

- **HTML/CRLF header injection in lead emails:** Malicious `name`, `company`, or `email` inputs containing `<script>`, newlines (`\r\n`), or `Bcc:` headers must be escaped in HTML emails and rejected/stripped from mail headers (`replyTo`, `subject`).
- **Honeypot & spam flood on `/api/lead`:** Bots filling hidden honeypot fields must receive a silent `200` (without sending SMTP mail), and repeated submissions from the same IP must hit rate-limiting (`429`).
- **Missing or invalid SMTP / Gemini env vars:** `/api/demo` must never crash when `GEMINI_API_KEY` is unset or times out (graceful scripted fallback); `/api/lead` must return a clean `503`/`500` JSON error without leaking env credentials when SMTP is unconfigured.
- **Oversized or malformed JSON / chat history on `/api/demo`:** Non-JSON bodies, empty messages, or injected huge/invalid `history` arrays must be clamped or rejected with `400`.
- **Dead links & leftover SaaS artifacts:** Zero references to `/dashboard`, `/auth`, `/onboarding`, `/blog`, `/docs`, `get.clickrunclaw.com`, `hook.clickrunclaw.com`, Crisp chat, Whop, Supabase, or `+880` remain in routes, `sitemap.ts`, `robots.ts`, or components.

---

### Task 1: Clone Repository, Create Feature Branch, and Purge Legacy SaaS Code

**Files:**
- Preserve: `docs/superpowers/specs/2026-11-12-clickrunclaw-agency-design.md`, `docs/superpowers/plans/2026-11-12-clickrunclaw-agency-plan.md`, `public/mascot.webp`, `public/favicon.webp`, `public/llms.txt`
- Delete: `app/dashboard/**`, `app/onboarding/**`, `app/auth/**`, `app/blog/**`, `app/docs/**`, `app/api/**`, `app/components/Header.tsx`, `components/dashboard/**`, `content/**`, `hooks/**`, `lib/coolify.ts`, `lib/blog.ts`, `utils/**`, `middleware.ts`, `supabase/**`, `supabase-setup.sql`, `supabase_profiles.sql`, `supabase_schema.sql`, `next.config.js`, `public/junk.txt`, `public/blog-*.svg`
- Modify: `package.json`, `.env.example`, `tsconfig.json`

**Interfaces:**
- Produces: Clean Next.js 15 repository on branch `feat/eu-ai-agency-pivot` with `nodemailer`, `@types/nodemailer`, and `tsx` installed and `@supabase/*` / `gray-matter` / `recharts` / `react-markdown` removed.

- [ ] **Step 1: Back up `docs/superpowers/` outside or to temp, clone `https://github.com/cryptowebbuild/clickrunclaw.git` into `d:\clickeunclaw new agensy`, restore `docs/superpowers/`, and create branch `feat/eu-ai-agency-pivot`**

Run:
```powershell
git clone https://github.com/cryptowebbuild/clickrunclaw.git _repo_tmp
# Move .git and repo contents into workspace root without overwriting docs/superpowers
```
Verify: `git status` shows branch `feat/eu-ai-agency-pivot` and `docs/superpowers/` intact.

- [ ] **Step 2: Delete all obsolete SaaS, auth, dashboard, blog, docs, Supabase, Coolify, Whop, and junk files**

Verify: `Get-ChildItem -Recurse` shows none of the deleted directories/files remain.

- [ ] **Step 3: Update `package.json` dependencies (`nodemailer`, `@types/nodemailer`, `tsx`, remove `@supabase/ssr`, `@supabase/supabase-js`, `gray-matter`, `react-markdown`, `recharts`) and add `"test": "tsx --test tests/**/*.test.ts"` script**

- [ ] **Step 4: Update `.env.example` with `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL`, `GEMINI_API_KEY`, and `NEXT_PUBLIC_SITE_URL`**

- [ ] **Step 5: Run `npm install` and commit cleanup baseline**

Run: `npm install`
Expected: Exit code 0, `node_modules` installed cleanly.
Commit: `chore: purge legacy SaaS code and prepare agency dependencies`

---

### Task 2: Lead Validation, Sanitization, Rate Limiting & Email Delivery (`/api/lead`)

**Files:**
- Create: `lib/lead.ts`
- Create: `app/api/lead/route.ts`
- Test: `tests/lead.test.ts`

**Interfaces:**
- Produces (`lib/lead.ts`):
  - `LeadInput`: `{ name: string; email: string; company?: string; packageTier: 'starter' | 'growth' | 'enterprise' | 'custom'; workflowGoal: string; euResidencyOnly?: boolean; websiteHoneypot?: string }`
  - `validateLeadInput(raw: unknown): { ok: true; data: LeadInput } | { ok: false; error: string }`
  - `isHoneypotTriggered(raw: unknown): boolean`
  - `escapeHtml(value: string): string`
  - `buildOwnerLeadEmail(data: LeadInput): { subject: string; text: string; html: string }`
  - `buildClientAckEmail(data: LeadInput): { subject: string; text: string; html: string }`
  - `checkRateLimit(key: string, now?: number): { allowed: boolean; retryAfterSec: number }`
- Produces (`app/api/lead/route.ts`):
  - `export const runtime = 'nodejs'`
  - `POST(req: Request): Promise<NextResponse>`

- [ ] **Step 1: Write failing tests in `tests/lead.test.ts`**

Test cases covering:
1. `validateLeadInput` accepts valid EU agency brief and normalizes trimmed fields.
2. `validateLeadInput` rejects missing name, invalid email, CRLF in email/name, invalid packageTier, or short `workflowGoal` (<10 chars).
3. `isHoneypotTriggered` returns `true` when `websiteHoneypot` is non-empty.
4. `escapeHtml` escapes `<script>` and quotes in `buildOwnerLeadEmail` HTML output.
5. `checkRateLimit` allows up to 5 requests per IP within 10 minutes and blocks the 6th with `allowed: false`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (`Cannot find module '../lib/lead'`)

- [ ] **Step 3: Implement `lib/lead.ts` and `app/api/lead/route.ts`**

Implement validation, CRLF header stripping, HTML escaping, in-memory IP rate limiter, and `nodemailer` SMTP dispatch (`support@clickrunclaw.com` + client confirmation email). Return `503` with safe message if SMTP env vars are missing.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all `lead.test.ts` assertions pass).

- [ ] **Step 5: Commit**

Commit: `feat: add validated SMTP lead intake library and /api/lead endpoint`

---

### Task 3: Live AI Agent Demo Backend (`/api/demo`) & Interactive Chat Widget

**Files:**
- Create: `lib/demo-agent.ts`
- Create: `app/api/demo/route.ts`
- Create: `components/LiveAgentDemo.tsx`
- Test: `tests/demo-agent.test.ts`

**Interfaces:**
- Consumes: `@google/genai` (`GoogleGenAI`), `GEMINI_API_KEY` env var.
- Produces (`lib/demo-agent.ts`):
  - `DemoMessage`: `{ role: 'user' | 'assistant'; content: string }`
  - `validateDemoRequest(raw: unknown): { ok: true; message: string; history: DemoMessage[] } | { ok: false; error: string }`
  - `buildFallbackDemoReply(message: string): string`
  - `generateDemoReply(input: { message: string; history: DemoMessage[]; apiKey?: string }): Promise<{ reply: string; mode: 'live' | 'sandbox' }>`
- Produces (`app/api/demo/route.ts`):
  - `POST(req: Request): Promise<NextResponse>`
- Produces (`components/LiveAgentDemo.tsx`):
  - Client component accepting `{ onSelectTier?: (tier: 'starter' | 'growth' | 'enterprise') => void }`

- [ ] **Step 1: Write failing tests in `tests/demo-agent.test.ts`**

Test cases covering:
1. `validateDemoRequest` rejects empty or >800-char messages and invalid payloads.
2. `validateDemoRequest` clamps `history` to last 6 valid turns and strips invalid roles/oversized items.
3. `generateDemoReply` returns `{ mode: 'sandbox', reply }` containing EU-hosted & USD package info when `apiKey` is absent.
4. `buildFallbackDemoReply` responds contextually to GDPR/Europe, pricing, and timeline prompts.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (`Cannot find module '../lib/demo-agent'`)

- [ ] **Step 3: Implement `lib/demo-agent.ts`, `app/api/demo/route.ts`, and `components/LiveAgentDemo.tsx`**

Use `@google/genai` (`gemini-2.5-flash` with strict system prompt matching our exact `$799/$1,799/$3,499+` pricing and honest EU-hosted infrastructure messaging) wrapped in try/catch + 8s timeout falling back to `buildFallbackDemoReply`. Build `components/LiveAgentDemo.tsx` with quick-prompt chips ("How do you keep data in the EU?", "What's included in Growth ($1,799)?", "How fast can you deploy?") and live chat UI.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all `demo-agent.test.ts` and `lead.test.ts` pass).

- [ ] **Step 5: Commit**

Commit: `feat: add interactive EU AI agent live demo API and chat component`

---

### Task 4: Layout, Navigation, Footer, Legal Pages & SEO

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/components/StaticHeader.tsx`
- Modify: `app/components/Footer.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/security/page.tsx`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: `/mascot.webp`, `/favicon.webp`.
- Produces: Clean header (`Services`, `EU Security`, `Live Demo`, `Pricing`, CTA `Request Custom Agent` -> `/#contact`), footer (`support@clickrunclaw.com`, `"An AI Automation Venture by CryptoWebBuild"`), GDPR-aligned `/privacy`, EU-first `/security`, and clean `robots.ts`/`sitemap.ts` (`/`, `/privacy`, `/security` only).

- [ ] **Step 1: Update `app/layout.tsx`**

Remove Crisp script; update `metadata` and JSON-LD (`ProfessionalService` / `Organization` schema for ClickRunClaw EU-First AI Automation Agency, pricing starting `$799`, `support@clickrunclaw.com`).

- [ ] **Step 2: Update `app/components/StaticHeader.tsx` and `app/components/Footer.tsx`**

Remove all `/auth`, `/dashboard`, `/blog` links; point links to `/#services`, `/#eu-security`, `/#demo`, `/#pricing`, `/#contact`, `/privacy`, `/security`, and `mailto:support@clickrunclaw.com`. Add `"An AI Automation Venture by CryptoWebBuild"` in Footer.

- [ ] **Step 3: Rewrite `app/privacy/page.tsx`, `app/security/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, and `public/llms.txt`**

Ensure `/privacy` accurately reflects lead inquiry processing (no SaaS user accounts or third-party billing portals), `/security` details EU Germany/Finland data centers + isolated containers + optional EU LLM routing, and `sitemap.ts` has zero references to deleted routes or `lib/blog`.

- [ ] **Step 4: Commit**

Commit: `refactor: update layout, navigation, footer, legal pages, and SEO for EU agency`

---

### Task 5: Agency Landing Page (`app/page.tsx`) & Project Brief Form (`components/ProjectBriefForm.tsx`)

**Files:**
- Create: `components/ProjectBriefForm.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `StaticHeader`, `Footer`, `LiveAgentDemo`, `ProjectBriefForm`, `POST /api/lead`.
- Produces: Complete conversion-focused English landing page (`#services`, `#eu-security`, `#demo`, `#pricing`, `#faq`, `#contact`) with tier pre-selection wiring.

- [ ] **Step 1: Implement `components/ProjectBriefForm.tsx`**

Accepts `selectedTier` prop (`'starter' | 'growth' | 'enterprise' | 'custom'`), includes hidden honeypot field, Name, Work Email, Company/Website, Tier selector, EU Data Residency preference checkbox, Workflow Goal textarea, loading/error/success confirmation states displaying `support@clickrunclaw.com`.

- [ ] **Step 2: Rewrite `app/page.tsx`**

Implement:
- Hero (`"EU-Hosted 24/7 AI Sales & Operations Agents — Built & Managed in 7 Days"`, Germany & Finland EU Data Residency pill, `Request Your Agent` + `Try Live AI Demo` CTAs, `/mascot.webp`).
- EU Data Residency & GDPR-Ready Trust Strip (3 key pillars: EU Data Centers, Isolated Client Containers, EU-Compliant LLM Routing Options).
- Core Service Offerings (3 cards: 24/7 AI Sales & Support Agents, Lead Capture & Server-Side Automation, Automated Ad & Content Funnel).
- Embedded `<LiveAgentDemo />` section (`#demo`).
- 3-Tier USD Pricing (`$799+$149/mo`, `$1,799+$299/mo`, `$3,499+$599/mo`) where clicking a tier sets `selectedTier` and scrolls smoothly to `#contact`.
- Interactive FAQ Accordion (`FAQItem` actually used!) covering EU hosting, 7-day delivery, API keys/LLM routing, and ownership.
- Embedded `<ProjectBriefForm selectedTier={selectedTier} />` (`#contact`).

- [ ] **Step 3: Commit**

Commit: `feat: build EU-first productized AI agency landing page and project brief form`

---

### Task 6: Final Verification, Leak Audit & Branch Check

**Files:**
- Verify all files in repository

- [ ] **Step 1: Run automated tests, ESLint, and production Next.js build**

Run:
```powershell
npm test
npm run lint
npm run build
```
Expected: All tests pass, lint exits 0, `next build` exits 0 with zero TypeScript errors.

- [ ] **Step 2: Run codebase hygiene grep to confirm zero forbidden strings or dead links**

Run `rg` across `app/`, `components/`, `lib/`, `public/`:
Check for `+880`, `01618`, `BDT`, `৳`, `/dashboard`, `/auth`, `/onboarding`, `/blog`, `/docs`, `coolify`, `supabase`, `whop`, `crisp`, `get.clickrunclaw`, `hook.clickrunclaw`.
Expected: Zero matches.

- [ ] **Step 3: Smoke-test `/api/demo` and `/api/lead` validation against running server**

Start `npm run start` temporarily, send valid/invalid requests to `/api/demo` and `/api/lead` (verifying `200` sandbox reply on `/api/demo` and `400` validation error on malformed `/api/lead`), then stop server cleanly.

- [ ] **Step 4: Confirm clean `git status` and commit any final adjustments on `feat/eu-ai-agency-pivot`**
