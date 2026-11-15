import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Server,
  Sparkles,
  BarChart3,
  Quote,
  Building2,
  Globe2,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Client Proof & ROI Case Studies | ClickRunClaw',
  description:
    'Verified case studies and ROI metrics from European enterprises using ClickRunClaw custom AI agents for invoice parsing, customer triage, and lead enrichment.',
  openGraph: {
    title: 'Client Proof & ROI Case Studies | ClickRunClaw',
    description:
      'Explore empirical results from Frankfurt, Stockholm, and Amsterdam enterprise deployments: 84% time saved, 1.4s response times, and $180k+ pipeline generated.',
    url: 'https://clickrunclaw.com/case-studies',
  },
};

const CASE_STUDIES = [
  {
    id: 'fintech-invoice-frankfurt',
    region: 'Frankfurt, Germany',
    flag: '🇩🇪',
    industry: 'B2B FinTech & Payments',
    title: 'Automated 1,400+ Monthly Vendor Invoices with 99.4% Extraction Precision',
    challenge:
      'A growing European FinTech platform received over 1,400 vendor receipts, utility bills, and cross-border invoices every month across 6 currencies. The finance operations team spent 28 hours per week manually matching PDF line items against bank disbursements and flagging VAT errors.',
    solution:
      'ClickRunClaw architected and deployed a sovereign LangGraph multi-agent parsing pipeline hosted in an isolated Hetzner Frankfurt container. The pipeline ingests inbound accounting emails, strips sensitive PII, extracts multi-currency line items via deterministic OCR, validates VAT compliance against the German Bundeszentralamt für Steuern database, and submits verified reconciliation vouchers to the ERP ledger.',
    metrics: [
      { label: 'Manual Verification Cut', value: '84%', icon: Clock, note: 'From 28 hrs/wk to under 4.5 hrs/wk' },
      { label: 'Average Processing Speed', value: '3.2s', icon: TrendingUp, note: 'Per multi-page PDF invoice' },
      { label: 'Net Monthly Savings', value: '€4,200', icon: DollarSign, note: 'Direct operations budget reclaimed' },
      { label: 'Extraction Precision', value: '99.4%', icon: ShieldCheck, note: 'Zero accounting ledger discrepancies' },
    ],
    architecture: [
      'Inbound Secure Webhook / IMAP Listener',
      'PII Redaction & SHA-256 Checksum Validation',
      'Local OCR & Multi-Currency Table Extractor',
      'ERP Two-Way Matching Engine & Slack Approval Gate',
    ],
    quote: {
      text: 'ClickRunClaw delivered our entire invoice pipeline in 8 days without a single phone call. The Frankfurt container isolation satisfies BaFin and GDPR requirements completely.',
      author: 'Maximilian V.',
      role: 'Head of Financial Operations, Frankfurt',
    },
    recommendedTier: 'growth',
  },
  {
    id: 'ecommerce-triage-stockholm',
    region: 'Stockholm, Sweden',
    flag: '🇸🇪',
    industry: 'Direct-to-Consumer E-Commerce',
    title: '1.4s First Response Time and 72% Autonomous Resolution for Nordic Retailer',
    challenge:
      'A direct-to-consumer apparel brand operating across Sweden, Norway, Denmark, and the UK faced an 8-hour support queue during promotional campaigns. Support agents were swamped with repetitive tracking inquiries, return label requests, and size exchanges.',
    solution:
      'We engineered a 24/7 multilingual customer triage agent integrated directly with Shopify Admin, Zendesk, and Nordic postal carriers (PostNord, DHL Express). The agent identifies incoming language, validates order credentials, autonomously issues statutory 14-day return shipping labels, and resolves common tracking queries instantly. Complex claims are routed to human agents with full summarized context.',
    metrics: [
      { label: 'First Response Time', value: '1.4s', icon: Clock, note: '24/7/365 across 4 languages' },
      { label: 'Autonomous Resolution', value: '72%', icon: TrendingUp, note: 'Zero human agent intervention needed' },
      { label: 'CSAT Score Lift', value: '4.9/5.0', icon: Sparkles, note: 'Up from 4.1 during peak season' },
      { label: 'Peak Volume Handled', value: '10,000+', icon: BarChart3, note: 'Black Friday week without downtime' },
    ],
    architecture: [
      'Zendesk Webhook & Native Language Detector (sv/da/no/en)',
      'Shopify Customer & Order Verification API',
      'DHL Express / PostNord Return Label Generator',
      'Human Escalation Triage with Summarized Context',
    ],
    quote: {
      text: 'Our Black Friday support tickets were handled in seconds while our team slept. The ROI on our Growth tier agent was proven within the first 72 hours of going live.',
      author: 'Elin S.',
      role: 'Director of Customer Experience, Stockholm',
    },
    recommendedTier: 'growth',
  },
  {
    id: 'b2b-saas-amsterdam',
    region: 'Amsterdam, Netherlands',
    flag: '🇳🇱',
    industry: 'B2B Enterprise SaaS',
    title: 'Cut Speed-to-Lead from 6.5 Hours to 90 Seconds & Generated $180,000+ Pipeline',
    challenge:
      'A European enterprise software scale-up experienced high drop-off from inbound demo requests originating outside Central European working hours. Prospects from the US and APAC waited an average of 6.5 hours for an initial outreach, resulting in lost deals to localized competitors.',
    solution:
      'ClickRunClaw implemented an automated Speed-to-Lead pipeline. Inbound form submissions trigger instant domain firmographic enrichment (employee count, tech stack, funding, ARR). The agent generates a personalized, bespoke video sandbox preview matching the prospect’s industry and immediately dispatches a calendar-free interactive briefing link within 90 seconds.',
    metrics: [
      { label: 'Speed-to-Lead', value: '90s', icon: Clock, note: '4.8x acceleration vs 6.5 hr baseline' },
      { label: 'Demo Conversion Rate', value: '+38%', icon: TrendingUp, note: 'From inbound lead to completed evaluation' },
      { label: 'Attributed Pipeline', value: '$180k+', icon: DollarSign, note: 'Closed pipeline in first 90 days' },
      { label: 'SDR Time Saved', value: '18 hrs/wk', icon: ShieldCheck, note: 'Manual research completely eliminated' },
    ],
    architecture: [
      'Next.js High-Speed Webhook Ingest',
      'Apollo & Clearbit Firmographic Enricher',
      'Custom LLM Industry Personalizer & Sandbox Builder',
      'HubSpot Deal Automation & Instant Slack Rep Notification',
    ],
    quote: {
      text: 'Being the first company to reply to a prospect with tailored technical value within 90 seconds completely flipped our conversion rates. The 100% async setup was seamless.',
      author: 'Willem K.',
      role: 'VP of Growth & Revenue, Amsterdam',
    },
    recommendedTier: 'starter',
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
      </div>

      <StaticHeader />

      <main className="relative z-10 pt-16 pb-24">
        {/* ============================================================ */}
        {/* HERO SECTION                                                */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-semibold uppercase tracking-wider mb-6">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Empirical Enterprise Proof</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-space text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Real Workflows. Real ROI. <br className="hidden sm:block" />
            <span className="text-[#FF5A5F]">Verified European Case Studies.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            See how forward-thinking European companies eliminated hundreds of hours of manual toil, cut response times to under two seconds, and scaled revenue without hiring overhead.
          </p>

          {/* Quick Aggregate Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl font-black font-space text-white">7 Days</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Turnaround to Live Prod</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl font-black font-space text-emerald-400">84%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Average Time Saved</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl font-black font-space text-white">&lt; 3 Wks</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">Average Payback Period</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-3xl font-black font-space text-[#FF5A5F]">100%</div>
              <div className="text-xs text-zinc-400 mt-1 font-medium">GDPR Data Sovereignty</div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CASE STUDIES LIST                                           */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 space-y-16">
          {CASE_STUDIES.map((cs, idx) => (
            <article
              key={cs.id}
              className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Glow Accent */}
              <div
                className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[110px] pointer-events-none ${
                  idx === 0
                    ? 'bg-[#FF5A5F]/10'
                    : idx === 1
                    ? 'bg-emerald-500/10'
                    : 'bg-blue-500/10'
                }`}
              />

              <div className="relative z-10 space-y-8">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cs.flag}</span>
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-[#FF5A5F] font-bold">
                        {cs.region}
                      </div>
                      <div className="text-xs text-zinc-400">{cs.industry}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>EU Sovereign Bare-Metal Deployment</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight leading-snug">
                  {cs.title}
                </h2>

                {/* Challenge & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                  <div className="space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>The Challenge</span>
                    </div>
                    <p className="text-zinc-300 font-normal">{cs.challenge}</p>
                  </div>

                  <div className="space-y-3 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                    <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>The Solution</span>
                    </div>
                    <p className="text-zinc-300 font-normal">{cs.solution}</p>
                  </div>
                </div>

                {/* Metrics Highlight Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {cs.metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.label}
                        className="bg-black/40 border border-white/10 p-5 rounded-2xl space-y-2 shadow-inner"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                            {m.label}
                          </span>
                          <Icon className="w-4 h-4 text-[#FF5A5F]" />
                        </div>
                        <div className="text-3xl font-black font-space text-white">
                          {m.value}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-medium leading-tight">
                          {m.note}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Architecture Flow */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    Deployed Production Pipeline Flow:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {cs.architecture.map((step, sIdx) => (
                      <div
                        key={step}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5 text-xs text-zinc-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#FF5A5F]/20 text-[#FF5A5F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Quote */}
                <div className="p-6 rounded-2xl bg-[#FF5A5F]/5 border border-[#FF5A5F]/20 relative">
                  <Quote className="w-8 h-8 text-[#FF5A5F]/30 absolute top-4 right-6" />
                  <p className="text-sm italic text-zinc-200 leading-relaxed mb-4 max-w-3xl">
                    &ldquo;{cs.quote.text}&rdquo;
                  </p>
                  <div className="text-xs">
                    <strong className="text-white font-bold block">{cs.quote.author}</strong>
                    <span className="text-zinc-400">{cs.quote.role}</span>
                  </div>
                </div>

                {/* Bottom Card CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-zinc-400">
                    Want an identical architecture deployed for your company in 7 days?
                  </div>
                  <Link
                    href={`/#contact?tier=${cs.recommendedTier}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-[#FF5A5F]/30 group"
                  >
                    <span>Request Technical Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ============================================================ */}
        {/* BOTTOM GLOBAL CALLOUT                                       */}
        {/* ============================================================ */}
        <section className="max-w-4xl mx-auto px-6 pt-20 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              Ready to Turn Your Repetitive Tasks into Sovereign Code?
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Skip the sales pitch. Fill out our 8-minute written spec form and get a comprehensive technical proposal and fixed quote within 24 hours.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A5F]/20 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Written Project Brief</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
