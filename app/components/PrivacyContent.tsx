'use client';

import { motion } from 'framer-motion';
import { EyeOff, Server, ShieldCheck, Mail, Lock, Database, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F] selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#090A0F]/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-white group">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
              <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" priority />
            </div>
            <span>ClickRunClaw</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#FF5A5F] transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </nav>
      </header>

      <main id="main" className="max-w-4xl mx-auto px-6 pt-36 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR-Compliant &bull; European Data Sovereignty</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space mb-6 tracking-tight text-white">
            Privacy Policy &amp; <br />
            <span className="text-[#FF5A5F]">Data Sovereignty</span>
          </h1>
          <p className="text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl">
            ClickRunClaw operates as a specialized EU-first AI automation agency. We build and deploy custom autonomous agents with dedicated European infrastructure, zero model training, and 100% async communication.
          </p>
          <p className="text-xs text-zinc-500 mt-4">
            Last Updated: November 2026 &bull; Effective for all European and International client engagements
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Section 1 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">1. EU-Hosted Infrastructure &amp; Data Centers</h2>
                <p className="text-xs text-emerald-400 font-medium">Physical Data Sovereignty in Germany &amp; Finland</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                All ClickRunClaw custom agent runtimes, interactive sandbox environments, and persistent data stores are hosted within ISO 27001-certified European data centers in Germany and Finland (Hetzner Online GmbH infrastructure).
              </p>
              <p>
                Each client deployment runs inside an isolated Linux container with strictly bounded resources, preventing any cross-tenant data leakage. We enforce TLS 1.3 encryption in transit and AES-256-GCM encryption at rest for all operational secrets and environment credentials.
              </p>
            </div>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F]">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">2. Zero AI Model Training Guarantee</h2>
                <p className="text-xs text-[#FF5A5F] font-medium">Your Business Logic &amp; Data Remain Exclusively Yours</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                We maintain an absolute, contractual guarantee: <strong className="text-white font-semibold">we do not train, retrain, or fine-tune public AI models on your business data, prompts, webhook payloads, or customer conversations.</strong>
              </p>
              <p>
                Prompts and inputs processed by your custom agents are evaluated ephemerally. When third-party LLM APIs are selected by client agreement, we configure strict enterprise zero-data-retention headers where supported by the respective provider.
              </p>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">3. Inquiry Data &amp; Agency Operations</h2>
                <p className="text-xs text-blue-400 font-medium">Honest Agency Scoping &bull; No Self-Serve Accounts or Public Portals</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                ClickRunClaw operates strictly as a custom development agency. We do not provide self-serve consumer logins, public user dashboards, or stored account profiles on this website.
              </p>
              <p>
                When you submit a project brief or email us at <code className="text-[#FF5A5F] bg-white/5 px-2 py-0.5 rounded">support@clickrunclaw.com</code>, we collect only the information necessary to evaluate technical feasibility and produce a written scope proposal: your name, business email, company name, target package tier, and workflow specifications.
              </p>
              <p>
                We never sell, rent, license, or monetize your inquiry information. We do not share your project details with ad brokers or marketing syndicates.
              </p>
            </div>
          </motion.section>

          {/* Section 4 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">4. Optional EU-Sovereign LLM Routing</h2>
                <p className="text-xs text-purple-400 font-medium">Compliance-First Inference Architecture</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                For European clients subject to strict sector-specific regulations (e.g. healthcare, legal, financial services), ClickRunClaw offers architectures with 100% EU-sovereign LLM routing.
              </p>
              <p>
                This includes routing inference through European AI providers (such as Mistral AI European endpoints) or hosting dedicated open-weight models on dedicated European bare metal servers located exclusively in Germany and Finland.
              </p>
            </div>
          </motion.section>

          {/* Section 5 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">5. 100% Async Delivery &amp; Zero Voice/Video Recordings</h2>
                <p className="text-xs text-amber-400 font-medium">Privacy by Process: Written Auditable Communication Only</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                ClickRunClaw operates on a strict 100% async communication model. We do not conduct voice calls, video meetings, or virtual screen-shares.
              </p>
              <p>
                Because we do not use meeting software, we never capture, record, transcribe, or store audio/video biometric data, conversational transcripts, or third-party meeting recordings. All interactions take place via secure written email (<code className="text-[#FF5A5F] bg-white/5 px-2 py-0.5 rounded">support@clickrunclaw.com</code>), providing an auditable paper trail that you control.
              </p>
            </div>
          </motion.section>

          {/* Section 6 */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">6. GDPR Client Rights &amp; Permanent Erasure</h2>
                <p className="text-xs text-teal-400 font-medium">Full Compliance with Articles 15 through 22 of the GDPR</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                As a data subject under the General Data Protection Regulation (GDPR), you possess comprehensive rights over your personal and commercial data:
              </p>
              <ul className="space-y-2 list-none pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Right of Access &amp; Portability:</strong> You may request an export of any proposal records and configuration specs associated with your inquiry.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Right to Rectification:</strong> You may update or correct any scoping details submitted to our agency.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Upon email request, we will permanently purge all inquiry logs, sandbox instances, and associated metadata from our systems.</span>
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-4">
                <span className="text-xs text-zinc-400">Submit GDPR access or erasure requests:</span>
                <a
                  href="mailto:support@clickrunclaw.com"
                  className="text-xs font-bold text-white bg-[#FF5A5F] hover:bg-[#ff4247] px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@clickrunclaw.com</span>
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="py-12 border-t border-white/10 text-center relative z-10 text-xs text-zinc-500">
        <p className="font-medium tracking-wide">
          &copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved. &bull; An AI Automation Venture by{' '}
          <a
            href="https://cryptowebbuild.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 hover:text-[#FF5A5F] underline underline-offset-4 transition-colors"
          >
            CryptoWebBuild
          </a>
        </p>
      </footer>
    </div>
  );
}
