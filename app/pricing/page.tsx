import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Server,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';
import RoiCalculator from '@/components/RoiCalculator';

export const metadata: Metadata = {
  alternates: { canonical: '/pricing' },
  title: 'Fixed-price AI agents | ClickRunClaw',
  description:
    'Three fixed-price packages: $799, $1,799 and $3,499+. Dedicated EU infrastructure, a monthly run fee and no hourly billing. Model your return first.',
  openGraph: {
    title: 'Fixed-price AI agents | ClickRunClaw',
    description:
      'Predictable fixed-price AI agents with dedicated EU infrastructure and zero discovery calls. Calculate your hours saved and financial yield.',
    url: 'https://clickrunclaw.com/pricing',
  },
};

const TIERS = [
  {
    id: 'starter',
    name: 'Starter Agent',
    badge: 'Single Workflow',
    setupPrice: '$799',
    monthlyPrice: '$149',
    popular: false,
    description:
      'Perfect for single high-friction bottlenecks: lead qualification, basic customer support triage, or single-trigger webhook automations.',
    features: [
      '1 Custom AI Agent (LangGraph / Node.js 22)',
      'Up to 2 API / Webhook Integrations (e.g. Email + Slack or HubSpot)',
      'Sub-2-Second Response Time with Deterministic Guardrails',
      'Dedicated Frankfurt (DE) Cloud Container',
      'Zero AI Model Training on Client Data',
      '7-Day Turnaround to Production Sandbox',
      '30 Days Included Maintenance & Prompt Tuning',
    ],
    cta: 'Select Starter Agent',
    targetAudience: 'Early-stage founders, boutique agencies, and lean sales teams.',
  },
  {
    id: 'growth',
    name: 'Growth Automation Fleet',
    badge: 'Most Popular',
    setupPrice: '$1,799',
    monthlyPrice: '$299',
    popular: true,
    description:
      'Our flagship multi-agent architecture for end-to-end operational automation across sales, customer support, and CRM enrichment.',
    features: [
      'Up to 3 Interconnected Autonomous Agents (Triage -> Enrichment -> Action)',
      'Up to 6 API, CRM & Database Integrations (HubSpot, Salesforce, Shopify, PostgreSQL)',
      'Multilingual Native Fluency (English, German, French, Swedish, Spanish, Dutch)',
      'Dedicated EU Container (Frankfurt or Helsinki bare-metal)',
      'Automated PII Masking & GDPR Article 28 Compliance',
      'Real-Time Slack / Discord Error Alerting & Audit Logging',
      '7 to 10 Day Turnaround to Production Sandbox',
      '60 Days Priority Maintenance & Continuous Model Tuning',
    ],
    cta: 'Select Growth Fleet',
    targetAudience: 'Scaling B2B companies, e-commerce stores, and high-volume operations.',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Sovereign Pipeline',
    badge: 'Full Sovereignty',
    setupPrice: '$3,499+',
    monthlyPrice: '$599',
    popular: false,
    description:
      'Tailored autonomous fleets with custom isolated bare-metal hardware, local European LLMs, and ERP integration.',
    features: [
      'Custom Multi-Agent Autonomous Fleet (Swarm Architecture)',
      'Unlimited API, Webhook, and ERP Integrations (SAP, NetSuite, Xero)',
      'Custom Isolated Bare-Metal EU Server (100% Single-Tenant)',
      'Optional Self-Hosted Sovereign LLM (Mistral / Llama on European GPU)',
      '99.95% Uptime SLA & Dedicated Priority Engineering Response',
      'Enterprise DPA, ISO 27001 Alignment & Security Architecture Audit',
      'Bi-Weekly Architecture Sync & Unlimited Async PR Revisions',
      '90 Days Dedicated Hands-On Support & Custom Backups',
    ],
    cta: 'Request Enterprise Spec',
    targetAudience: 'FinTech, Healthcare, Logistics, and regulated European institutions.',
  },
];

const COMPARISON_COLUMNS = [
  { feature: 'Autonomous Agents Included', starter: '1 Agent', growth: 'Up to 3 Agents', enterprise: 'Custom Fleet' },
  { feature: 'API / Webhook Connectors', starter: 'Up to 2', growth: 'Up to 6', enterprise: 'Unlimited' },
  { feature: 'EU Data Center Location', starter: 'Germany (Frankfurt)', growth: 'Frankfurt or Helsinki', enterprise: 'Dedicated Bare-Metal' },
  { feature: 'Multilingual Processing', starter: 'English + 1 language', growth: '6 EU Languages', enterprise: 'Unlimited Worldwide' },
  { feature: 'PII Scrubbing & Guardrails', starter: 'Standard', growth: 'Advanced Multi-Layer', enterprise: 'Custom Air-Gapped' },
  { feature: 'Turnaround to Sandbox', starter: '7 Days', growth: '7-10 Days', enterprise: '14-21 Days' },
  { feature: 'Included Maintenance & SLA', starter: '30 Days / 99.5%', growth: '60 Days / 99.9%', enterprise: '90 Days / 99.95%' },
  { feature: 'Code & IP Ownership', starter: '100% Client Owned', growth: '100% Client Owned', enterprise: '100% Client Owned' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
      </div>

      <StaticHeader />

      <main id="main" className="relative z-10 pt-16 pb-24">
        {/* ============================================================ */}
        {/* HERO SECTION                                                */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 text-center pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>Guaranteed Flat-Rate Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-space text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Predictable Fixed Pricing. <br className="hidden sm:block" />
            <span className="text-[#FF5A5F]">Zero Surprise Invoices.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            No ambiguous hourly rates. No scope creep. You pay a single flat setup fee for engineering and delivery in 7 days, plus transparent dedicated EU container hosting.
          </p>
        </section>

        {/* ============================================================ */}
        {/* 3-TIER PRICING GRID                                         */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                  tier.popular
                    ? 'bg-gradient-to-b from-[#141824] to-[#0D1117] border-2 border-[#FF5A5F] shadow-[0_0_40px_rgba(255,90,95,0.15)] -translate-y-2'
                    : 'bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Pill */}
                {tier.popular && (
                  <div className="absolute top-0 right-8 bg-[#FF5A5F] text-white text-[11px] font-bold font-space uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    {!tier.popular && (
                      <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                        {tier.badge}
                      </span>
                    )}
                    <h3 className="text-2xl font-black font-space text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="pt-2 pb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black font-space text-white">
                        {tier.setupPrice}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">one-time setup</span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 font-mono">
                      + <span className="text-zinc-200 font-bold">{tier.monthlyPrice}/mo</span> dedicated EU hosting &amp; maintenance
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                      What&rsquo;s Included:
                    </span>
                    <ul className="space-y-2.5">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-8 mt-8 border-t border-white/10 space-y-3">
                  <div className="text-[11px] text-zinc-500 font-mono text-center">
                    {tier.targetAudience}
                  </div>
                  <Link
                    href={`/#contact?tier=${tier.id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg group ${
                      tier.popular
                        ? 'bg-[#FF5A5F] hover:bg-[#ff4247] text-white shadow-[#FF5A5F]/20 hover:shadow-[#FF5A5F]/40'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTERACTIVE ROI CALCULATOR SECTION                          */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              Model Your Return On Investment
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Calculate the direct monthly hours and operational dollars recovered by replacing repetitive manual tasks with dedicated sovereign agents.
            </p>
          </div>

          <RoiCalculator showCtaLink={true} />
        </section>

        {/* ============================================================ */}
        {/* COMPREHENSIVE COMPARISON MATRIX                             */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden backdrop-blur-xl">
            <h2 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight mb-8 text-center">
              Detailed Architecture Feature Matrix
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 font-semibold">Feature / Capability</th>
                    <th className="py-4 px-4 font-semibold text-zinc-300">Starter ($799)</th>
                    <th className="py-4 px-4 font-bold text-[#FF5A5F]">Growth ($1,799)</th>
                    <th className="py-4 px-4 font-semibold text-zinc-300">Enterprise ($3,499+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPARISON_COLUMNS.map((col) => (
                    <tr key={col.feature} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold font-space text-white whitespace-nowrap">
                        {col.feature}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                        {col.starter}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-100 font-mono font-bold text-xs bg-[#FF5A5F]/5">
                        {col.growth}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 font-mono text-xs">
                        {col.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PAYMENT METHODS & BILLING ASSURANCE                         */}
        {/* ============================================================ */}
        <section className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="text-xl font-bold font-space text-white">
              Accepted Payment Methods &amp; Invoicing
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
              We issue VAT-compliant commercial invoices denominated in USD or EUR. Payments accepted via Credit Card (Stripe), European SEPA / Swift Wire Transfer, and Cryptocurrency (USDT / USDC via CryptoWebBuild).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-mono text-zinc-400">
              <span>✓ 50% Upfront / 50% Upon Sandbox Approval</span>
              <span>✓ 30-Day Money-Back SLA Guarantee</span>
              <span>✓ Cancel Monthly Hosting Anytime (Zero Lock-in)</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
