'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'

import StaticHeader from './components/StaticHeader'
import Footer from './components/Footer'
import LiveAgentDemo from '@/components/LiveAgentDemo'
import ProjectBriefForm, { PackageTier } from '@/components/ProjectBriefForm'

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
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-dots opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <StaticHeader />

      <main className="relative z-10">
        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section className="pt-16 pb-16 px-4 md:pt-28 md:pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Mascot with subtle glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 relative"
          >
            <div className="absolute inset-0 bg-[#FF5A5F] rounded-full blur-[60px] opacity-15" />
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-white/10 bg-[#0D1117] shadow-2xl flex items-center justify-center">
              <Image
                src="/mascot.webp"
                alt="ClickRunClaw Mascot"
                width={144}
                height={144}
                className="object-contain scale-105"
                priority
              />
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-300 font-semibold tracking-wide backdrop-blur-sm shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Germany &amp; Finland EU Data Centers &bull; Zero Meetings &bull; 100% Async Delivery</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight font-space text-white leading-[1.1] max-w-5xl mb-6"
          >
            EU-Hosted 24/7 AI Sales &amp; Operations Agents —{' '}
            <span className="text-[#FF5A5F]">Built &amp; Managed in 7 Days</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-xl text-zinc-400 mb-10 max-w-3xl font-normal leading-relaxed"
          >
            Deploy dedicated, custom AI workers on sovereign European infrastructure. We engineer custom sales, support, and lead workflows with zero meetings, zero phone calls, and zero training on your proprietary data.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto"
          >
            <Link
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-base transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request Your Agent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 transition-all hover:border-white/20"
            >
              <Bot className="w-4 h-4 text-[#FF5A5F]" />
              <span>Try Live AI Demo</span>
            </Link>
          </motion.div>

          {/* 3-Step Async Delivery Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-4xl bg-[#111318] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl"
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-4 text-center">
              The 100% Async Delivery Workflow &bull; Zero Meetings Required
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2 relative md:pr-4 md:border-r border-white/5">
                <div className="flex items-center gap-2 text-white font-space font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center text-xs">
                    1
                  </div>
                  <span>Written Brief</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Submit your workflow goals and integration targets in 3 minutes via structured written brief.
                </p>
              </div>

              <div className="space-y-2 relative md:pr-4 md:border-r border-white/5">
                <div className="flex items-center gap-2 text-white font-space font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center text-xs">
                    2
                  </div>
                  <span>Live Sandbox Preview</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Receive a written architecture and test a live, tailored browser sandbox prototype within 48 hours.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-space font-bold text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    3
                  </div>
                  <span>EU Production Deploy</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Go live in 7 days on dedicated Frankfurt/Helsinki containers with full monitoring and backups.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ============================================================ */}
        {/* 2. EU DATA RESIDENCY & GDPR TRUST SECTION (#eu-security)     */}
        {/* ============================================================ */}
        <section
          id="eu-security"
          className="py-24 px-4 border-t border-white/5 bg-[#090A0F]/80 relative"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sovereign Infrastructure</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Enterprise EU Data Residency &amp; GDPR-Ready Trust
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                We engineer AI pipelines specifically for European businesses and data-conscious global enterprises. Zero model training on your data, dedicated isolated containers, and transparent infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Card 1 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-4 hover:border-white/20 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                  <Server className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-space text-white">
                  Dedicated EU VPS &amp; Containers
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Every agent runs inside its own isolated Docker container on dedicated Hetzner servers located in Frankfurt (Germany) and Helsinki (Finland). Zero shared multi-tenant memory, zero noisy neighbors, and complete network separation.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Frankfurt &bull; Helsinki Data Centers</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-4 hover:border-white/20 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-space text-white">
                  Strict Isolation &amp; Zero Model Training
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Your customer conversations, proprietary documentation, and business workflows are never used to train foundational AI models. We enforce strict zero-retention policies across all integration endpoints.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Zero Data Retention &bull; Private DBs</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-4 hover:border-white/20 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-space text-white">
                  Optional Sovereign EU LLM Routing
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Need total data sovereignty? Route reasoning directly through European AI endpoints such as Mistral EU (Paris) or zero-retention European gateways. You maintain full cryptographic and legal governance over your company’s intelligence.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Mistral EU &bull; Sovereign Routing</span>
                </div>
              </div>
            </div>

            {/* Honest Engineering Callout */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#111318]/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1 max-w-3xl">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A5F]">
                  Honest Engineering Commitment
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  ClickRunClaw infrastructure and database pipelines are 100% hosted in Germany and Finland. When third-party LLM providers (e.g. Anthropic, OpenAI) are selected for advanced reasoning, we configure strict enterprise zero-data-retention agreements or route through sovereign EU endpoints like Mistral EU. We never make false blanket claims.
                </p>
              </div>
              <Link
                href="#contact"
                className="shrink-0 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
              >
                Discuss Residency Options
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. CORE SERVICE OFFERINGS (#services)                        */}
        {/* ============================================================ */}
        <section id="services" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What We Build</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Production AI Automation Engineered for Revenue
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                We design and ship robust, deterministic AI systems tailored to your existing tech stack — replacing repetitive manual labor with 24/7 intelligent execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    24/7 AI Sales &amp; Support Agents
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Custom conversational agents trained on your product documentation, PDFs, and knowledge base. They qualify inbound prospects, answer complex technical inquiries, and triage tickets around the clock.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      'Web chat & Telegram bot integration',
                      'Trained on live documentation & FAQs',
                      'Real-time CRM & Google Sheets sync',
                      'Smart human escalation triggers',
                      'Multi-language customer handling',
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
                  Configure Sales Agent Brief
                </button>
              </div>

              {/* Service 2 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between ring-1 ring-[#FF5A5F]/30 relative">
                <div className="absolute -top-3 right-8 bg-[#FF5A5F] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  High Impact
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    Lead Capture &amp; Server-Side Automation
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    High-converting landing pages combined with server-side tracking (Meta CAPI &amp; GA4) and deterministic n8n / Python workflows that instantly route and score incoming leads.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      'Fast, high-converting landing pages',
                      'Meta CAPI & GA4 server-side tracking',
                      'Automated CRM sync (HubSpot, Pipedrive)',
                      'n8n & Python workflow pipelines',
                      'Zero-latency email & Telegram alerts',
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
                  Configure Growth Funnel Brief
                </button>
              </div>

              {/* Service 3 */}
              <div className="bg-[#111318] border border-white/10 rounded-3xl p-8 space-y-6 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-space text-white">
                    Automated Ad &amp; Content Funnel
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Programmatic motion graphics and conversion-focused video creatives integrated directly into your automated lead capture and qualification funnels.
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {[
                      'Cinematic programmatic video assets',
                      'Dynamic variations for Meta & TikTok',
                      'Synced audio, captions & typography',
                      'Direct hook-to-brief conversion funnels',
                      'Scalable creative pipeline generation',
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
                  Configure Full Partner Brief
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. INTERACTIVE LIVE AI AGENT DEMO (#demo)                    */}
        {/* ============================================================ */}
        <section id="demo" className="py-24 px-4 border-t border-white/5 bg-[#090A0F]/90">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" />
                <span>Interactive Live Sandbox</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight font-space text-white">
                Test Our EU Automation Consultant
              </h2>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                Test drive our real live agent below. Inquire about EU hosting locations, pricing plans, custom workflow capabilities, or our 100% async delivery model.
              </p>
            </div>

            {/* Embedded LiveAgentDemo */}
            <div className="max-w-4xl mx-auto">
              <LiveAgentDemo onSelectTier={handleSelectTier} />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. 3-TIER USD PRICING (#pricing)                             */}
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
        {/* 6. FAQ ACCORDION SECTION (#faq)                              */}
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
        {/* 7. PROJECT BRIEF FORM SECTION (#contact)                     */}
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

  return (
    <div className="border border-white/10 bg-[#111318] rounded-2xl overflow-hidden hover:border-white/20 transition-colors shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
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
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 md:px-8 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
