'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  ShieldCheck,
  Server,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Bot,
  Zap,
  Video,
  FileText,
  Send,
  BarChart3,
  Check,
  Clock,
  Activity,
  Layers,
  TrendingUp,
  Globe,
  BookOpen,
} from 'lucide-react'

import dynamic from 'next/dynamic'
import StaticHeader from '@/app/components/StaticHeader'
import Footer from '@/app/components/Footer'
import ProjectBriefForm, { PackageTier } from '@/components/ProjectBriefForm'

const WorkflowSimulator = dynamic(() => import('@/components/WorkflowSimulator'), {
  loading: () => <div className="h-[420px] w-full animate-pulse rounded-3xl border border-white/10 bg-[#111318]" aria-hidden="true" />,
})

const LiveAgentDemo = dynamic(() => import('@/components/LiveAgentDemo'), {
  loading: () => <div className="h-[520px] w-full animate-pulse rounded-3xl border border-white/10 bg-[#111318]" aria-hidden="true" />,
})

const RoiCalculator = dynamic(() => import('@/components/RoiCalculator'), {
  loading: () => <div className="h-[380px] w-full animate-pulse rounded-3xl border border-white/10 bg-[#111318]" aria-hidden="true" />,
})
import { BLOG_POSTS } from '@/lib/blog'

export default function LandingPage() {
  const [selectedTier, setSelectedTier] = useState<PackageTier>('growth')

  const handleSelectTier = (
    tier: 'starter' | 'growth' | 'enterprise' | 'custom'
  ) => {
    setSelectedTier(tier)
    const contactEl = document.getElementById('contact')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 overflow-x-hidden selection:bg-[#FF5A5F]/30 selection:text-white">
      {/* Subtle Background Grid Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-dots opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <StaticHeader />

      <main id="main" className="relative z-10">
        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section className="pt-8 pb-14 px-4 md:pt-16 md:pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Mascot with subtle glow */}
          <div
           
           
           
            className="mb-6 relative rise"
          >
            <div className="absolute inset-0 bg-[#FF5A5F] rounded-full blur-[60px] opacity-20" />
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-white/10 bg-[#0D1117] shadow-2xl flex items-center justify-center">
              <Image
                src="/mascot-288.webp"
                alt="ClickRunClaw Mascot"
                width={128}
                height={128}
                className="object-contain scale-105"
                priority
              />
            </div>
          </div>

          {/* Trust Badge */}
          <div
           
           
           
            className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] leading-snug text-zinc-300 font-semibold tracking-wide backdrop-blur-sm shadow-sm sm:px-4 sm:text-xs rise rise-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dedicated EU hardware &bull; Zero meetings</span>
            <span className="hidden sm:inline">&bull; 100% async delivery</span>
          </div>

          {/* Main Headline */}
          <h1
           
           
           
            className="text-[2rem] leading-[1.08] sm:text-5xl md:text-7xl font-black tracking-tight font-space text-white max-w-5xl mb-6 rise rise-2"
          >
            Sovereign AI Automation Fleets
            <span className="hidden sm:inline"> &mdash; </span>
            <span className="block text-[#FF5A5F] sm:inline">
              Shipped &amp; Managed in 7 Days
            </span>
          </h1>

          {/* Subtitle */}
          <p
           
           
           
            className="text-base md:text-xl text-zinc-400 mb-8 max-w-3xl font-normal leading-relaxed rise rise-3"
          >
            Custom sales triage, invoice reconciliation and CRM pipelines, running on
            dedicated European bare-metal. Zero meetings, zero calls, and no model training
            on your data.
          </p>

          {/* Primary CTAs */}
          <div
           
           
           
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-12 w-full sm:w-auto rise rise-4"
          >
            <Link
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-base transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Deploy Custom Agent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#simulator"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 transition-all hover:border-white/20"
            >
              <Activity className="w-4 h-4 text-[#FF5A5F]" />
              <span>View Live Simulator</span>
            </Link>
          </div>

          {/* Credibility Key Stats Banner */}
          <div
           
           
           
            className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 rise rise-5"
          >
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-4xl font-black font-space text-white">7 Days</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Turnaround to Live Prod</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-4xl font-black font-space text-emerald-400">84%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Average Time Reclaimed</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-4xl font-black font-space text-white">100%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Async Protocol (0 Calls)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 text-center backdrop-blur-md">
              <div className="text-3xl sm:text-4xl font-black font-space text-[#FF5A5F]">DE &amp; FI</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Sovereign EU Hardware</div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. INTERACTIVE WORKFLOW PIPELINE SIMULATOR (#simulator)       */}
        {/* ============================================================ */}
        <section id="simulator" className="py-20 px-4 border-t border-white/5 bg-[#090A0F]/90 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            <WorkflowSimulator />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. FEATURED CLIENT CASE STUDIES & ROI                         */}
        {/* ============================================================ */}
        <section className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Empirical Client Proof</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                  Real European Workflows. Verified ROI.
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Explore how enterprise teams in Frankfurt, Stockholm, and Amsterdam slashed operational bottlenecks with sovereign AI agents.
                </p>
              </div>

              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0 group"
              >
                <span>Read All Case Studies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teaser 1: FinTech Invoice (Frankfurt) */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🇩🇪</span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Frankfurt &bull; FinTech</span>
                  </div>
                  <h3 className="text-xl font-bold font-space text-white">
                    Automated 1,400+ Monthly Invoices with 99.4% Match Accuracy
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Replaced 28 weekly manual verification hours with an isolated LangGraph parser on Frankfurt bare-metal containers.
                  </p>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Net Operational Savings:</span>
                    <span className="text-emerald-400 font-bold font-space text-sm">€4,200/mo</span>
                  </div>
                </div>
                <Link
                  href="/case-studies#fintech-invoice-frankfurt"
                  className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-1 group"
                >
                  <span>View Technical Architecture</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Teaser 2: E-Commerce Triage (Stockholm) */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🇸🇪</span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Stockholm &bull; Retail</span>
                  </div>
                  <h3 className="text-xl font-bold font-space text-white">
                    1.4s First Response &amp; 72% Autonomous Resolution Rate
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    24/7 multilingual Zendesk &amp; Shopify agent providing automated order tracking and DHL return labels across 4 languages.
                  </p>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Customer CSAT Lift:</span>
                    <span className="text-emerald-400 font-bold font-space text-sm">4.9 / 5.0</span>
                  </div>
                </div>
                <Link
                  href="/case-studies#ecommerce-triage-stockholm"
                  className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-1 group"
                >
                  <span>View Technical Architecture</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Teaser 3: B2B SaaS (Amsterdam) */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">🇳🇱</span>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Amsterdam &bull; SaaS</span>
                  </div>
                  <h3 className="text-xl font-bold font-space text-white">
                    Cut Speed-to-Lead from 6.5 Hours to 90 Seconds ($180k+ Pipeline)
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Instant inbound domain enrichment and dynamic sandbox demo generation converting cold prospects around the clock.
                  </p>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Demo Conversion Lift:</span>
                    <span className="text-emerald-400 font-bold font-space text-sm">+38% Win Rate</span>
                  </div>
                </div>
                <Link
                  href="/case-studies#b2b-saas-amsterdam"
                  className="text-xs font-bold text-[#FF5A5F] hover:underline flex items-center gap-1 group"
                >
                  <span>View Technical Architecture</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. CORE SERVICES OVERVIEW                                    */}
        {/* ============================================================ */}
        <section id="services" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Core Engineering Pillars</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                  Deterministic AI Systems Built for Production
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed">
                  We replace fragile no-code toys with enterprise-grade LangGraph state machines, Fastify edge microservices, and dedicated EU containers.
                </p>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0 group"
              >
                <span>Explore Technical Stack</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    24/7 Sales &amp; Customer Triage
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Multi-lingual conversational agents integrated with HubSpot, Salesforce, Zendesk, and Shopify. Qualify leads and resolve tickets in 1.5 seconds.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      'Bidirectional CRM synchronization',
                      'Strict zero-hallucination guardrails',
                      'Native fluency in 6 EU languages',
                      'Human-in-the-loop escalation triggers',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTier('starter')}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer text-center"
                >
                  Configure Starter Agent ($799)
                </button>
              </div>

              {/* Service 2 */}
              <div className="bg-[#111318] border-2 border-[#FF5A5F] rounded-3xl p-8 space-y-6 shadow-[0_0_35px_rgba(255,90,95,0.15)] flex flex-col justify-between relative scale-100 lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5A5F] text-white text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                  Most Requested Architecture
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    B2B Enrichment &amp; Webhook Pipelines
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Automated domain firmographics (Apollo/Clearbit), webhook sanitization, and database sync with PostgreSQL Row-Level Security.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      'Sub-400ms webhook validation & execution',
                      'Real-time Slack / Discord executive alerts',
                      'Automated CRM deal pipeline creation',
                      'Meta CAPI & GA4 server-side tracking',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTier('growth')}
                  className="w-full py-3 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-xs font-bold text-white transition-colors cursor-pointer text-center shadow-md"
                >
                  Configure Growth Fleet ($1,799)
                </button>
              </div>

              {/* Service 3 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    Multi-Agent Fleets &amp; Document Extraction
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Coordinated agent swarms that parse complex PDF invoices, execute 2-way ERP reconciliation, and maintain audit ledgers.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      '99.4% precision table & invoice extraction',
                      'Isolated Hetzner bare-metal EU servers',
                      'ERP sync (SAP, NetSuite, Xero, QuickBooks)',
                      'Optional local sovereign LLM (Mistral EU)',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTier('enterprise')}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors cursor-pointer text-center"
                >
                  Configure Enterprise Brief ($3,499+)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. THE 100% ASYNC PROTOCOL HIGHLIGHT                         */}
        {/* ============================================================ */}
        <section className="py-24 px-4 border-t border-white/5 bg-[#090A0F]/90">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-[#FF5A5F]" />
                  <span>The Asynchronous Protocol</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                  Zero Meetings. Built in 7 Days.
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Traditional agencies waste weeks in discovery meetings. We operate on structured written specs, live sandboxes, and tracked PRs.
                </p>
              </div>

              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0 group"
              >
                <span>Read Full Protocol Spec</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="text-xs font-mono text-[#FF5A5F] font-bold">STEP 01 &bull; DAY 0</div>
                <h3 className="text-lg font-bold font-space text-white">8-Minute Written Brief</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Answer targeted questions regarding your workflow, APIs, and business rules. Zero Zoom calls.
                </p>
              </div>

              <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="text-xs font-mono text-[#FF5A5F] font-bold">STEP 02 &bull; 24 HOURS</div>
                <h3 className="text-lg font-bold font-space text-white">Technical Blueprint</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Receive an architectural specification, security review, and guaranteed fixed USD proposal.
                </p>
              </div>

              <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="text-xs font-mono text-[#FF5A5F] font-bold">STEP 03 &bull; DAY 4</div>
                <h3 className="text-lg font-bold font-space text-white">Live Staging Sandbox</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Test your agent in an isolated webview environment with mock data and submit refinements.
                </p>
              </div>

              <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="text-xs font-mono text-emerald-400 font-bold">STEP 04 &bull; DAY 7</div>
                <h3 className="text-lg font-bold font-space text-white">Turnkey EU Deployment</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Production cutover on dedicated German containers with monitoring, docs, and 100% IP ownership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. INTERACTIVE LIVE AGENT DEMO (#demo)                       */}
        {/* ============================================================ */}
        <section id="demo" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                <span>Interactive Live Sandbox</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Chat With Our EU Agent Consultant
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Test drive our real live agent below. Ask about EU hosting locations, USD pricing plans, custom workflow capabilities, or our 100% async delivery model.
              </p>
            </div>

            {/* Embedded LiveAgentDemo */}
            <div className="max-w-4xl mx-auto">
              <LiveAgentDemo onSelectTier={handleSelectTier} />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. INTERACTIVE ROI CALCULATOR PREVIEW                        */}
        {/* ============================================================ */}
        <section className="py-24 px-4 border-t border-white/5 bg-[#090A0F]/90">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Financial Yield Calculator</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                  Model Your Automation Yield
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Calculate the exact monthly hours and dollars recovered by automating manual triage and data entry workflows.
                </p>
              </div>

              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0 group"
              >
                <span>Full Pricing Comparison</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <RoiCalculator onSelectTier={handleSelectTier} showCtaLink={false} />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. 3-TIER USD PRICING GRID                                  */}
        {/* ============================================================ */}
        <section id="pricing" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Transparent Flat Rates</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Predictable USD Pricing. Zero Hidden Fees.
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Flat setup pricing plus a modest monthly hosting and maintenance retainer. No surprise hourly overages, no per-message gouging, and 100% async delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Tier 1: Starter */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-space text-white">
                        Starter Automation
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        1 targeted workflow or department agent
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-space text-white">
                        $799
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        setup
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#FF5A5F] font-bold mt-1">
                      + $149 / month retainer
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      '1 targeted n8n or Python automation workflow',
                      '1 communication channel (Web chat or Telegram)',
                      'Standard CRM or Google Sheets sync',
                      'Dedicated Frankfurt/Helsinki container',
                      '7-day delivery timeline',
                      '100% async email support & updates',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectTier('starter')}
                  className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all cursor-pointer text-center hover:scale-[1.01]"
                >
                  Select Starter Brief ($799)
                </button>
              </div>

              {/* Tier 2: Growth Funnel (Most Popular) */}
              <div className="bg-[#111318] border-2 border-[#FF5A5F] rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(255,90,95,0.15)] relative scale-100 lg:-translate-y-2">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5A5F] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-space text-white">
                        Growth Funnel
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Multi-step AI pipeline with CRM syncing &amp; landing page
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-space text-white">
                        $1,799
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        setup
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#FF5A5F] font-bold mt-1">
                      + $299 / month retainer
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Multi-step AI pipeline with CRM syncing & validation',
                      'Up to 3 communication channels & lead triage',
                      'High-converting landing page included',
                      'Meta CAPI server-side conversion tracking',
                      'Dedicated EU VPS + daily automated backups',
                      '7-day delivery timeline + priority async support',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectTier('growth')}
                  className="w-full py-3.5 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-sm font-bold text-white transition-all shadow-[0_4px_20px_rgba(255,90,95,0.4)] cursor-pointer text-center hover:scale-[1.01]"
                >
                  Select Growth Brief ($1,799)
                </button>
              </div>

              {/* Tier 3: Full AI Partner */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-space text-white">
                        Full AI Partner
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        Bespoke multi-agent systems &amp; continuous evolution
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-space text-white">
                        $3,499+
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        setup
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#FF5A5F] font-bold mt-1">
                      + $599 / month retainer
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Custom end-to-end multi-agent orchestration',
                      'Human-in-the-loop workflows & custom APIs',
                      'Optional Sovereign EU LLM routing (Mistral EU)',
                      'Dedicated container cluster with 99.9% uptime SLA',
                      'Continuous prompt tuning & weekly optimizations',
                      'Priority async SLA (<12 hr response window)',
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-300">
                        <Check className="w-4 h-4 text-[#FF5A5F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectTier('enterprise')}
                  className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all cursor-pointer text-center hover:scale-[1.01]"
                >
                  Select Partner Brief ($3,499+)
                </button>
              </div>
            </div>

            {/* Custom Architecture Note */}
            <div className="text-center text-xs text-zinc-400">
              Need custom enterprise architecture or on-premise deployment?{' '}
              <button
                type="button"
                onClick={() => handleSelectTier('custom')}
                className="text-[#FF5A5F] hover:underline font-bold cursor-pointer"
              >
                Select &ldquo;Custom Architecture&rdquo; in the project brief below &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. LATEST ENGINEERING INTEL & RESEARCH HUB                   */}
        {/* ============================================================ */}
        <section className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Engineering Intel &amp; Blueprints</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                  Sovereign AI Research &amp; Field Guides
                </h2>
                <p className="text-zinc-400 text-base leading-relaxed">
                  Technical deep-dives on GDPR Article 28 compliance, 100% async development velocity, and empirical FinTech automation case studies.
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white uppercase tracking-wider transition-colors shrink-0 group"
              >
                <span>Browse All Articles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <article
                  key={post.slug}
                  className="bg-[#111318] border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FF5A5F] font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-space text-white group-hover:text-[#FF5A5F] transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A5F] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10. FAQ ACCORDION SECTION (#faq)                             */}
        {/* ============================================================ */}
        <section id="faq" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]/80">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#FF5A5F]" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Clear Answers &bull; Complete Transparency
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Everything you need to know about our EU hosting, async workflow, and technical ownership.
              </p>
            </div>

            <div className="space-y-4">
              <FAQItem
                question="Where is customer and workflow data hosted?"
                answer="100% of ClickRunClaw server infrastructure is hosted on dedicated hardware in Frankfurt, Germany and Helsinki, Finland. Your business data is strictly isolated in dedicated Docker containers and is never used for training foundational AI models. Clients requiring full sovereign European AI can opt for Mistral EU endpoints."
              />

              <FAQItem
                question="Why 100% async delivery with zero phone or video meetings?"
                answer="Meetings waste hours of valuable executive time and slow down engineering velocity. Our structured written brief captures your exact workflow specifications, integrations, and logic rules. Within 24-48 hours, you receive a concrete written architecture and an interactive sandbox preview you can test directly in your browser. Fast, precise, and respectful of your schedule."
              />

              <FAQItem
                question="How does the 7-day launch timeline work?"
                answer="Day 1: We review your submitted brief and confirm the written architecture. Days 2-4: We build the custom agent, configure integrations (CRMs, webhooks, databases), and tune system prompts. Days 5-6: We deliver a live sandbox preview for your review and refine edge cases. Day 7: We deploy to production on dedicated EU infrastructure with monitoring enabled."
              />

              <FAQItem
                question="Who owns the code, workflows, and prompts?"
                answer="You do — 100%. All custom code, n8n workflows, prompt templates, and integration scripts belong entirely to your company. There is zero vendor lock-in. If you ever decide to self-host or manage the systems internally, we provide a complete export."
              />

              <FAQItem
                question="What does the monthly retainer cover?"
                answer="The monthly retainer covers dedicated EU VPS container hosting, automated backups, security patching, 24/7 uptime monitoring, third-party API connection maintenance, and ongoing prompt adjustments to ensure your agents perform reliably."
              />

              <FAQItem
                question="What third-party tools and databases can you integrate?"
                answer="We integrate with virtually any modern tool with an API or webhook interface: HubSpot, Pipedrive, Salesforce, PostgreSQL, Google Sheets, Airtable, Telegram, Slack, WhatsApp Business API, Resend, Zoho, and custom REST backends."
              />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 10. PROJECT BRIEF FORM SECTION (#contact)                    */}
        {/* ============================================================ */}
        <section id="contact" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                <Send className="w-3.5 h-3.5" />
                <span>Start Your Implementation</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Submit Your Project Brief
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                Zero meetings, zero sales calls. Share your automation goals below, and we will send a tailored written architecture and live sandbox preview within 24 hours.
              </p>
            </div>

            {/* Embedded ProjectBriefForm */}
            <ProjectBriefForm
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
            />

            {/* Direct Email Fallback */}
            <div className="text-center text-xs text-zinc-500">
              Prefer direct email instead of a web form? Send your requirements directly to{' '}
              <a
                href="mailto:support@clickrunclaw.com"
                className="text-[#FF5A5F] hover:underline font-semibold"
              >
                support@clickrunclaw.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = React.useId()
  const buttonId = `${panelId}-button`

  return (
    <div className="border border-white/10 bg-[#111318] rounded-2xl overflow-hidden hover:border-white/20 transition-colors shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
      >
        <span className="font-bold text-base md:text-lg font-space text-white group-hover:text-[#FF5A5F] transition-colors pr-4">
          {question}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 ${
            isOpen
              ? 'bg-[#FF5A5F] border-[#FF5A5F] rotate-180 text-white'
              : 'border-white/10 bg-white/5 text-zinc-400 group-hover:text-white'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="panel-in">
          <div className="px-6 md:px-8 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
            {answer}
          </div>
        </div>
      )}
    </div>
  )
}
