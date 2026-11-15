import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Bot,
  Database,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
  Workflow,
  Code2,
  Lock,
  Globe,
  Radio,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'AI Automation Services & Sovereign Agent Architectures | ClickRunClaw',
  description:
    'Custom production-grade AI agents, B2B webhook automations, and multi-agent fleets deployed on dedicated European bare-metal cloud. 100% async delivery.',
  openGraph: {
    title: 'AI Automation Services & Sovereign Agent Architectures | ClickRunClaw',
    description:
      'Explore our core AI agent architectures: 24/7 Sales & Support, B2B Webhook Pipelines, and Multi-Agent Orchestrations with zero model training.',
    url: 'https://clickrunclaw.com/services',
  },
};

const SERVICES = [
  {
    id: 'conversational-agents',
    badge: 'Core Pillar 01',
    title: '24/7 Autonomous Sales & Customer Triage Agents',
    summary:
      'Human-level customer and sales qualification agents that resolve inbound inquiries, schedule callbacks, and update CRM records within 1.5 seconds in 6 languages.',
    capabilities: [
      'Bidirectional CRM Synchronization (HubSpot, Salesforce, Pipedrive, Close)',
      'Sub-2-Second Intent Classification & Sentiment Analysis',
      'Multilingual Native Fluency (English, German, French, Swedish, Dutch, Spanish)',
      'Zero-Hallucination Guardrails with Strict Knowledge Base Boundaries',
      'Automated Ticket Escalation & Slack/Discord Human-in-the-Loop Handover',
    ],
    techStack: ['LangGraph', 'TypeScript / Node 22', 'FastText NLU', 'Redis Cache', 'V8 Edge Runtime'],
    sla: '<1.5s Response Time &bull; 99.9% Uptime &bull; GDPR Article 28 Compliant',
    idealFor: 'E-commerce brands, high-velocity SaaS companies, and B2B services losing leads to slow response times.',
    priceAnchor: 'From $799 Starter / $1,799 Growth',
  },
  {
    id: 'enrichment-pipelines',
    badge: 'Core Pillar 02',
    title: 'B2B Data Enrichment & Webhook Event Pipelines',
    summary:
      'Eliminate manual data entry. High-throughput event processors that ingest webhooks, enrich company and contact firmographics, and synchronize multi-platform databases.',
    capabilities: [
      'Automated Lead Domain Firmographics (Apollo, Clearbit, LinkedIn, Company House)',
      'HMAC SHA-256 Webhook Verification & Real-Time Payload Sanitization',
      'PostgreSQL & BigQuery Sync with Row-Level Security (RLS)',
      'Intelligent Scoring & Routing to Target Sales Rep Inboxes or Slack Channels',
      'Automated Deduplication & Historical Data Cleaning',
    ],
    techStack: ['Cloudflare Workers', 'Python / Fastify', 'PostgreSQL RLS', 'n8n Enterprise', 'Docker EU'],
    sla: '<400ms Pipeline Execution &bull; Zero Data Retention on Third-Party Servers',
    idealFor: 'B2B sales teams, venture funds, agencies, and marketplaces requiring clean, enriched CRM pipelines.',
    priceAnchor: 'From $1,799 Growth Fleet',
  },
  {
    id: 'multi-agent-fleets',
    badge: 'Core Pillar 03',
    title: 'Autonomous Multi-Agent Fleets & Document Extraction',
    summary:
      'Coordinated agent swarms that divide and conquer complex back-office workflows: PDF invoice parsing, 2-way ERP matching, compliance validation, and executive digest generation.',
    capabilities: [
      'High-Precision PDF & Receipt Table Extraction (Invoices, Bill of Ladings, Contracts)',
      'Cross-Verification Swarm (Ingest Agent -> Validator Agent -> Ledger Agent)',
      'Configurable Human Approval Gates via One-Click Slack / Email Buttons',
      'Automated NetSuite, SAP, Xero, or QuickBooks Reconciliation',
      'Encrypted Storage in Isolated European S3-Compatible Buckets',
    ],
    techStack: ['Python 3.12 Document Engines', 'LangGraph Multi-Agent', 'Hetzner Frankfurt Bare-Metal', 'Encrypted MinIO'],
    sla: '99.4% Extraction Accuracy &bull; 100% Isolated Dedicated German Hardware',
    idealFor: 'Finance operations, logistics providers, procurement teams, and cross-border European enterprises.',
    priceAnchor: 'Custom Scope / $3,499+ Enterprise',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Grid Dots */}
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
            <Cpu className="w-3.5 h-3.5" />
            <span>Sovereign AI Automation Architectures</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-space text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Engineered AI Agents <br className="hidden sm:block" />
            <span className="text-[#FF5A5F]">That Never Sleep or Hallucinate</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            We architect and deploy production-grade custom AI agents and high-throughput automation pipelines on dedicated EU bare-metal infrastructure. 100% async delivery in 7 days.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dedicated EU Bare-Metal (Frankfurt / Helsinki)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Model Training on Client Data</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Wasted Meetings (100% Async)</span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* DETAILED SERVICES BREAKDOWN                                 */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 space-y-16">
          {SERVICES.map((srv, idx) => (
            <article
              key={srv.id}
              id={srv.id}
              className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Radial Accent Glow */}
              <div
                className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
                  idx === 0
                    ? 'bg-[#FF5A5F]/10'
                    : idx === 1
                    ? 'bg-blue-500/10'
                    : 'bg-emerald-500/10'
                }`}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    <span>{srv.badge}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black font-space text-white tracking-tight">
                    {srv.title}
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                    {srv.summary}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Key Engineering Capabilities:
                    </h3>
                    <ul className="space-y-2.5">
                      {srv.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-[#FF5A5F] shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400">
                    <strong className="text-zinc-200 block mb-1">Ideal For:</strong>
                    {srv.idealFor}
                  </div>
                </div>

                {/* Right Specifications Card (5 Cols) */}
                <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6 shadow-inner">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Target Investment
                    </span>
                    <div className="text-xl font-black font-space text-white">
                      {srv.priceAnchor}
                    </div>
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Production Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {srv.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SLA */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      SLA &amp; Compliance Guarantee
                    </span>
                    <p
                      className="text-xs text-emerald-400 font-mono font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: srv.sla }}
                    />
                  </div>

                  {/* Deployment Timeline */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Production Ready:</span>
                    <span className="font-bold font-space text-white bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      7 Days Turnaround
                    </span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/#contact?service=${srv.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#FF5A5F]/20 group"
                  >
                    <span>Request Technical Spec</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ============================================================ */}
        {/* WHY DEDICATED SOVEREIGN STACK                               */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 pt-20">
          <div className="border border-white/10 rounded-3xl p-8 sm:p-12 bg-white/[0.01] relative overflow-hidden">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight mb-4">
                Why Enterprise Teams Choose Sovereign European Agents
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Generic no-code chatbots rely on shared multi-tenant US servers and leak proprietary company prompts into training datasets. ClickRunClaw builds isolated, dedicated software assets that you own completely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F]">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-space">
                  Frankfurt &amp; Helsinki Bare-Metal
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your containers execute inside ISO 27001-certified German &amp; Finnish facilities with GDPR-compliant data isolation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-space">
                  Zero Model Training Retention
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Zero customer prompts or attachments are ever fed back into public LLM training sets. Guaranteed by binding DPA agreements.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-space">
                  100% Asynchronous Protocol
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No 45-minute discovery zoom calls. We communicate in crisp written specifications, live sandboxes, and tracked PRs.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-base font-bold text-white font-space">
                  Ready to automate your manual bottlenecks?
                </h4>
                <p className="text-xs text-zinc-400">
                  Submit your brief in 8 minutes. Receive an architectural proposal within 24 hours.
                </p>
              </div>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A5F]/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Your Workflow Brief</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
