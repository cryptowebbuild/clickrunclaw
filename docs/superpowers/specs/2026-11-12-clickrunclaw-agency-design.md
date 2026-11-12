# ClickRunClaw.com — International EU-First AI Automation Agency Design

**Date:** 2026-11-12  
**Repository:** `https://github.com/cryptowebbuild/clickrunclaw`  
**Target Domain:** `https://clickrunclaw.com`  
**Contact Email:** `support@clickrunclaw.com`  
**Venture Attribution:** An AI Automation Venture by CryptoWebBuild (`https://cryptowebbuild.com/`)

---

## 1. Intent & Why

ClickRunClaw.com currently exists as a half-wired self-serve SaaS for 1-click OpenClaw Docker container hosting (`$9.99/mo` and `$29.99/mo` via Whop + Coolify + Supabase). Running low-ticket self-serve SaaS hosting requires high user volume, 24/7 Docker/VPS maintenance, and suffers from unfinished/conflicting backend endpoints (plain-text API key storage in `app/api/deploy/route.ts`, unverified/conflicting Whop webhooks in `app/api/webhooks/whop/route.ts` vs `app/api/whop/route.ts`, unimplemented billing history, and placeholder `get.clickrunclaw.com` / `hook.clickrunclaw.com` URLs).

Pivoting ClickRunClaw.com into a **Productized AI Automation & Custom Agent Agency** targeting **Europe & International B2B clients** solves this:
- Eliminates self-serve SaaS backend complexity and low-margin support burden.
- Positions ClickRunClaw around high-margin setup + monthly retainer packages in USD.
- Uses **EU-Located Dedicated Infrastructure (Germany / Finland Data Centers) & GDPR-First Isolated Containers** as the primary trust and differentiation wedge for European buyers.
- Routes all client leads cleanly through **professional domain email (`support@clickrunclaw.com`)** rather than exposing a personal `+880` WhatsApp number.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- Completely remove all old self-serve SaaS routes, auth, Supabase schemas, Coolify provisioning, Whop checkout/webhooks, and leftover demo/junk files.
- Build a fast, dark-themed, high-converting **100% English** Productized Agency website on the existing Next.js 15 + Tailwind v4 stack, preserving core brand assets (`/mascot.webp`, `/favicon.webp`).
- Position around **EU-First Data Residency & GDPR-Ready Architecture** (dedicated EU VPS/container hosting in Germany/Finland, zero model training, optional EU LLM routing).
- Provide an **Interactive Live AI Agent Demo** directly on the landing page (powered by `@google/genai` when `GEMINI_API_KEY` is configured, with a deterministic scripted fallback when offline/unconfigured).
- Replace all "Sign Up / Login / Deploy" CTAs with a **Project Brief / Custom Agent Request** flow that sends structured lead emails to `support@clickrunclaw.com` and an instant confirmation email to the prospect.

### Non-Goals
- No user accounts, login, onboarding wizard, or self-serve dashboard.
- No database (no Supabase, Postgres, or user credential storage).
- No automated Coolify container provisioning from the website.
- No Whop/Stripe checkout integration in v1 (invoices/payment links are handled via email after brief review).
- No Bangladesh / BDT pricing, Bengali copy, or `+880` WhatsApp links anywhere on the site.
- No voice calls, phone calls, or live video/Zoom discovery meetings — the entire workflow (brief -> proposal -> live sandbox preview -> delivery) is 100% async and written via `support@clickrunclaw.com`.

### Anti-Goals (What Would Make This Fail)
- Exposing a `+880` phone number or non-European local references, which breaks EU enterprise trust.
- Making false compliance claims (e.g., claiming "100% EU-only processing" while routing unconfigured prompts to non-EU APIs without disclosure). The copy must accurately distinguish **EU-Hosted Dedicated Infrastructure** from **Optional EU LLM Routing / Zero-Data-Retention APIs**.
- Leaving dead links (`/dashboard`, `/auth`, `/blog`, `/docs`, `get.clickrunclaw.com`) or broken assets in navigation, footer, or sitemap.

---

## 3. Constraints

- **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide icons, Framer Motion (already in `package.json`), plus `nodemailer` for SMTP email delivery.
- **GitHub Workflow:** Clone `cryptowebbuild/clickrunclaw` into workspace `d:\clickeunclaw new agensy` and perform all changes on a new feature/refactor branch (never push directly to `main`).
- **Privacy & Security Honesty:** Keep `/privacy` and `/security` accurate to the new agency model (lead form data only used to reply; dedicated client deployments run on isolated EU servers with zero model training).
- **Zero Secrets in Git:** SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `LEAD_TO_EMAIL`), `GEMINI_API_KEY`, and optional private owner notification webhook remain in `.env.local` / hosting environment variables only, documented in `.env.example`.

---

## 4. Approaches Considered

1. **Approach A — Email-Only Lead Brief + Interactive Live AI Demo (Selected)**
   - **How it works:** Strip all SaaS/DB/Whop code; build a clean agency site with 3 core services, 3 USD tiers, an interactive AI sales agent widget, and a Project Brief modal/section posting to `/api/lead` -> SMTP email to `support@clickrunclaw.com` + auto-acknowledgment email to client.
   - **Trade-offs:** Zero database/webhook maintenance, no `+880` WhatsApp trust mismatch, fast launch; payment is sent manually via email/invoice link after reviewing the brief.
   - **Why selected:** Best fit for European B2B trust and zero-maintenance operation.

2. **Approach B — Whop Instant Checkout + Automated Server WhatsApp Webhook**
   - **Trade-offs:** Requires creating new Whop products/plans for `$799/$1,799/$3,499+` and wiring a third-party WhatsApp API provider, plus introduces unnecessary friction before European clients can verify scope. Rejected.

---

## 5. Architecture & Detailed Decisions

### 5.1 Repository Cleanup (Deletions)
Remove all obsolete SaaS & leftover files:
- `app/dashboard/` (all subroutes and components)
- `app/onboarding/`
- `app/auth/`
- `app/blog/` and `content/` and `lib/blog.ts`
- `app/docs/`
- `app/api/deploy/`, `app/api/agents/`, `app/api/whop/`, `app/api/webhooks/`, `app/api/sync-whop/`
- `components/dashboard/`
- `hooks/` (if only used for dashboard; verify before removing)
- `lib/coolify.ts`
- `utils/supabase/`, `middleware.ts`
- `supabase/`, `supabase-setup.sql`, `supabase_profiles.sql`, `supabase_schema.sql`
- `public/junk.txt`, `public/blog-*.svg`
- Duplicate `next.config.js` (keep a single clean `next.config.ts`)
- Remove Crisp live chat script from `app/layout.tsx` if replaced by our built-in Interactive AI Agent Demo widget (keep GA `G-DVW4J1GF1L` or env-guarded).

### 5.2 Pages & Routes
1. `/` (`app/page.tsx`):
   - **Header:** Logo (`ClickRunClaw` + `/mascot.webp`), links (`Services`, `EU Security`, `Live Demo`, `Pricing`), primary CTA (`Request Custom Agent`).
   - **Hero:** Clear EU-focused USP (*"EU-Hosted 24/7 AI Sales & Operations Agents — Built, Deployed & Managed in 7 Days"*), trust pill (`Germany & Finland EU Servers • GDPR-Ready Isolation • Zero Coding`), CTAs (`Request Your Agent` + `Try Live AI Demo`).
   - **EU Data Residency & Trust Strip:** Explains dedicated isolated containers in EU data centers (Hetzner/Contabo EU), zero model training, full client ownership, and EU-compliant LLM routing options.
   - **Core Service Offerings (3 Cards):**
     1. *24/7 AI Sales & Support Agents* (Web chat, Telegram, CRM/Sheets sync, lead qualification).
     2. *Lead Capture & Server-Side Automation* (Custom landing funnels, webhooks, Meta/GA server-side CAPI & CRM workflows).
     3. *Automated Ad & Content Funnel* (Motion graphics promo creatives integrated directly into AI lead-capture flows).
   - **Interactive Live AI Agent Demo Section:** Embedded interactive chat sandbox on the page where visitors can test ClickRunClaw's AI agent live (calls `/api/demo`, backed by `@google/genai` with rate-limiting/input validation and graceful scripted fallback if `GEMINI_API_KEY` is missing).
   - **3-Tier USD Pricing Table:**
     - **Starter — EU AI Responder:** `$799` setup + `$149/mo` (1 custom EU-hosted AI agent, knowledge base training, lead/CRM sync, isolated Germany/Finland container).
     - **Growth Funnel (Most Popular):** `$1,799` setup + `$299/mo` (Multi-channel AI agent, high-converting landing page, server-side tracking & CRM automation, EU dedicated container).
     - **Full AI Partner (Enterprise):** `$3,499+` setup + `$599/mo` (Custom web portal + multi-agent workflows, 2 promo motion video ads, priority SLA & custom EU LLM routing).
     - Clicking any tier's CTA opens/scrolls to the **Project Brief Form** with that tier pre-selected.
   - **FAQ Section:** Updated for international B2B agency buyers (EU data residency, turnaround time, BYOK vs managed AI keys, cancellation/ownership).
   - **Project Brief / Lead Form Section (`#contact`):** Fields for Full Name, Work Email, Company/Website, Selected Package (`Starter` / `Growth` / `Full AI Partner` / `Custom`), Primary Goal / Workflow Description, and optional EU Data Residency preference checkbox.
   - **Footer:** Brand info, `support@clickrunclaw.com`, updated navigation links, social links, and `"An AI Automation Venture by CryptoWebBuild"`.
2. `/privacy` (`app/privacy/page.tsx`): Updated GDPR-aligned privacy notice covering inquiry form handling, zero model training, and EU container isolation.
3. `/security` (`app/security/page.tsx`): Updated EU-First Fortress Architecture page detailing EU data center hosting, container isolation, TLS/AES key handling, and EU LLM routing options.
4. `app/robots.ts` & `app/sitemap.ts`: Updated to only index `/`, `/privacy`, `/security`.

### 5.3 Backend APIs
1. **`POST /api/lead`** (`app/api/lead/route.ts`):
   - Runs on Node.js runtime (not edge, for `nodemailer` SMTP support).
   - Validates payload (name, valid email, package, message; simple honeypot + basic in-memory rate limit against spam).
   - Sends structured HTML + plain-text lead notification email via SMTP (`nodemailer`, configured for Zoho Mail / custom SMTP in `.env`) to `support@clickrunclaw.com` with `replyTo` set to the client's email.
   - Sends a clean confirmation auto-reply email to the client from `support@clickrunclaw.com`.
   - Returns clear `200` JSON on success or safe `400`/`500` error messages (never leaking SMTP credentials).
2. **`POST /api/demo`** (`app/api/demo/route.ts`):
   - Accepts visitor message + short conversation history (capped length).
   - If `GEMINI_API_KEY` is present, queries Gemini (`@google/genai`) with a tight system prompt showcasing ClickRunClaw's EU-hosted AI automation packages and guiding visitors to submit a brief.
   - If `GEMINI_API_KEY` is absent or errors, returns a clean, realistic scripted fallback response so the demo never appears broken.

---

## 6. Left to the Builder

- Exact visual layout polish, Tailwind styling refinements, and responsive spacing while keeping the dark `#090A0F` + coral `#FF5A5F` brand palette (`Inter`, `Space Grotesk`, `JetBrains Mono`).
- Writing clean TypeScript unit/validation helpers for `/api/lead` and `/api/demo`, and verifying `npm run build` + `npm run lint` pass with zero broken links or TypeScript errors.
- Configuring `.env.example` with clear placeholders for `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `LEAD_TO_EMAIL`, and `GEMINI_API_KEY`.
