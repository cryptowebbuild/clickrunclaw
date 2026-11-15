import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Sparkles,
  Server,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'The 100% Async Protocol & Delivery Process | ClickRunClaw',
  description:
    'No 45-minute discovery Zoom calls. Discover how our asynchronous engineering protocol delivers custom production AI agents in 7 days without calendar friction.',
  openGraph: {
    title: 'The 100% Async Protocol & Delivery Process | ClickRunClaw',
    description:
      'Explore our radical 4-step async delivery framework: 8-min brief, 24h technical blueprint, day 4 sandbox preview, and day 7 turnkey EU deployment.',
    url: 'https://clickrunclaw.com/how-it-works',
  },
};

const PROTOCOL_STEPS = [
  {
    step: '01',
    timeframe: 'Day 0',
    title: 'The 8-Minute Written Intake Brief',
    summary:
      'Zero calendar friction. Instead of a 45-minute sales interrogation, you answer a focused, guided technical spec questionnaire.',
    details: [
      'Define target manual bottleneck (e.g. lead qualification, invoice parsing, support triage)',
      'Specify API endpoints, CRM systems (HubSpot, Salesforce, Shopify), or webhooks',
      'Select EU data center residency preference (Germany / Frankfurt or Finland / Helsinki)',
      'Optionally attach existing SOPs, prompt templates, or sample JSON / PDF payloads',
    ],
    deliverable: 'Client Intake Submission (Timestamped & encrypted)',
  },
  {
    step: '02',
    timeframe: 'Within 24 Hours',
    title: 'Architectural Blueprint & Fixed-Rate Proposal',
    summary:
      'We turn your brief into a comprehensive technical specification with a guaranteed delivery date and flat-rate USD pricing.',
    details: [
      'Data flow sequence diagram mapping trigger -> validation -> reasoning -> dispatch',
      'Security boundary assessment and PII-stripping guardrail architecture',
      'Guaranteed flat-rate quote ($799 Starter / $1,799 Growth / $3,499 Enterprise)',
      'Firm delivery milestones with zero hidden hourly billing or surprise overages',
    ],
    deliverable: 'Interactive Written Spec & Binding Proposal',
  },
  {
    step: '03',
    timeframe: 'Day 4',
    title: 'Private Staging Sandbox Preview',
    summary:
      'Before a single byte touches your production CRM or database, you stress-test the agent in an isolated staging environment.',
    details: [
      'Interactive webview preview loaded with synthetic test records & real edge cases',
      'Test multi-turn prompt behavior, fallback scenarios, and sub-2-second latency',
      'Submit written adjustments and fine-tuning feedback via our async portal',
      'Continuous automated regression tests to verify zero hallucinations',
    ],
    deliverable: 'Private Live Sandbox URL with mock production data',
  },
  {
    step: '04',
    timeframe: 'Day 7',
    title: 'Turnkey EU Cloud Deployment & Handover',
    summary:
      'We cut over to your live production infrastructure, execute live end-to-end verification, and transfer full ownership.',
    details: [
      'Deploy to dedicated ISO 27001-certified German/Finnish bare-metal containers',
      'Configure production API secrets, webhook listeners, and SSL certificates',
      'Set up real-time Slack / Discord error monitoring & uptime health checks',
      '30 days of included maintenance, prompt optimization, and bug fixes',
    ],
    deliverable: 'Live Production Agent, Swagger/API Docs, & 100% IP Ownership',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Discovery & Kickoff',
    asyncWay: '8-minute structured written questionnaire. Start immediately.',
    traditionalWay: '3 to 5 discovery Zoom calls over 2-3 weeks.',
  },
  {
    feature: 'Turnaround Time',
    asyncWay: '7 days to live production.',
    traditionalWay: '8 to 14 weeks of committee meetings.',
  },
  {
    feature: 'Pricing Model',
    asyncWay: 'Guaranteed flat USD rate ($799 / $1,799). Zero hidden fees.',
    traditionalWay: 'Open-ended hourly billing with scope creep.',
  },
  {
    feature: 'Data Sovereignty',
    asyncWay: 'Dedicated EU bare-metal (Frankfurt/Helsinki) with zero LLM training.',
    traditionalWay: 'Shared US multi-tenant clouds with vague data retention.',
  },
  {
    feature: 'Communication Audit Trail',
    asyncWay: '100% documented in writing, Git PRs, and sandbox logs.',
    traditionalWay: 'Decisions lost across unrecorded video calls and Slack DMs.',
  },
  {
    feature: 'Code Ownership',
    asyncWay: 'You own 100% of the deployed code, scripts, and container assets.',
    traditionalWay: 'Proprietary vendor lock-in or recurring platform hostage fees.',
  },
];

const FAQS = [
  {
    q: 'Why do you operate 100% asynchronously without Zoom calls?',
    a: 'Software engineering is a precision craft. 45-minute verbal meetings invite vague promises, calendar delays, and lost requirements. Written specifications force clarity, eliminate timezone friction, and allow us to begin coding your architecture within hours instead of waiting weeks for calendar alignment.',
  },
  {
    q: 'What if our workflow requirements are complex or change during development?',
    a: 'On Day 4, you receive an interactive Staging Sandbox loaded with synthetic data. You test the agent directly and submit specific written refinement requests. Our modular LangGraph / microservice architecture allows rapid iteration without breaking baseline flows.',
  },
  {
    q: 'Can you sign a mutual NDA before we share our API keys or business workflows?',
    a: 'Yes. We provide a standard European GDPR-compliant mutual NDA, or we can countersign your organization’s standard NDA document before you share proprietary schemas.',
  },
  {
    q: 'Where are our agents hosted and who has access to our company data?',
    a: 'Every agent is deployed to dedicated, single-tenant containers in Frankfurt, Germany or Helsinki, Finland (Hetzner Bare-Metal). We do not share containers between clients. We sign strict Data Processing Agreements (DPA) guaranteeing zero model training on client data.',
  },
  {
    q: 'What happens after the 7-day deployment is complete?',
    a: 'All packages include 30 to 60 days of proactive maintenance, uptime monitoring, and prompt optimization. Ongoing hosting and continuous support are provided at transparent monthly rates ($149/mo Starter, $299/mo Growth) with no long-term contracts.',
  },
];

export default function HowItWorksPage() {
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
            <Clock className="w-3.5 h-3.5" />
            <span>The Asynchronous Engineering Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-space text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            No 45-Minute Zoom Calls. <br className="hidden sm:block" />
            <span className="text-[#FF5A5F]">Just Shipped Production Code.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            How our radical 4-step asynchronous delivery protocol takes custom enterprise AI agents from written intake to live EU cloud deployment in 7 days without calendar friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Zero Wasted Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Binding 7-Day Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Flat-Rate USD Pricing</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4-STEP PROTOCOL SECTION                                      */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              The 4-Step Turnkey Deployment Flow
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              From your initial brief to production-hardened EU containers in one week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROTOCOL_STEPS.map((ps) => (
              <div
                key={ps.step}
                className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between"
              >
                {/* Step Watermark */}
                <span className="absolute top-4 right-6 text-7xl font-black font-space text-white/[0.03] select-none pointer-events-none">
                  {ps.step}
                </span>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF5A5F] font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-3 py-1 rounded-full">
                      Step {ps.step} &bull; {ps.timeframe}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black font-space text-white tracking-tight">
                    {ps.title}
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {ps.summary}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {ps.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono relative z-10">
                  <span className="text-zinc-500 uppercase tracking-wider">Output:</span>
                  <span className="text-zinc-200 font-semibold text-right max-w-xs truncate">
                    {ps.deliverable}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* ASYNC VS TRADITIONAL COMPARISON TABLE                       */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 pt-24">
          <div className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                <span>Direct Comparison</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
                Why 100% Async Protocol Beats Traditional Agencies
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Cutting discovery calls isn&rsquo;t a gimmick. It is the single most effective way to eliminate engineering distortion.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 font-semibold">Dimension</th>
                    <th className="py-4 px-4 font-bold text-[#FF5A5F]">ClickRunClaw Async Protocol</th>
                    <th className="py-4 px-4 font-semibold text-zinc-500">Traditional Agency / Dev Shop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-bold font-space text-white whitespace-nowrap">
                        {row.feature}
                      </td>
                      <td className="py-4 px-4 text-zinc-200 font-medium">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{row.asyncWay}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-500">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" />
                          <span>{row.traditionalWay}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FREQUENTLY ASKED QUESTIONS                                  */}
        {/* ============================================================ */}
        <section className="max-w-4xl mx-auto px-6 pt-24 space-y-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>Operational Clarity</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-3"
              >
                <h3 className="text-base font-bold font-space text-white">
                  {faq.q}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* BOTTOM CTA                                                  */}
        {/* ============================================================ */}
        <section className="max-w-4xl mx-auto px-6 pt-20 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              Ready to Ship in 7 Days?
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Fill out our guided intake form in 8 minutes. We will deliver a complete technical blueprint and guaranteed quote to your inbox within 24 hours.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A5F]/20 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit 8-Minute Project Brief</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
