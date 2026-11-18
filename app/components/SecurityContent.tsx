'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Server, Cpu, ArrowLeft, Mail, FileCheck, Key } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SecurityPage() {
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

      <main id="main" className="max-w-6xl mx-auto px-6 pt-36 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield className="w-3.5 h-3.5" />
            <span>European Defense-in-Depth Architecture</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black font-space mb-6 tracking-tight text-white">
            Enterprise Security &amp; <br className="hidden md:block" />
            <span className="text-[#FF5A5F]">Sovereign Infrastructure</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Every layer of the ClickRunClaw custom agent stack is hardened for European data sovereignty, isolated container execution, and zero AI model training.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 hover:border-[#FF5A5F]/30 transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
              <Server className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-space mb-3 text-white">Dedicated EU Data Centers</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-normal">
              Physical infrastructure deployed in Germany and Finland Tier-3 facilities (Hetzner EU). Certified to ISO/IEC 27001 standards with strict physical biometric access controls and European environmental compliance.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 hover:border-[#FF5A5F]/30 transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 flex items-center justify-center mb-6 text-[#FF5A5F]">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-space mb-3 text-white">Isolated Container Sandboxes</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-normal">
              Each custom agent and live client preview operates inside a dedicated Linux container with strict cgroups and network namespace isolation. Zero shared memory or cross-tenant contamination.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 hover:border-[#FF5A5F]/30 transition-all shadow-sm"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-space mb-3 text-white">Cryptographic Secret Vault</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-normal">
              All client API keys, database URLs, and webhook signing secrets are encrypted at rest using AES-256-GCM. Traffic in transit across all endpoints is secured via modern TLS 1.3 encryption.
            </p>
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Section A */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">Zero Model Training &amp; Ephemeral Processing</h2>
                <p className="text-xs text-purple-400 font-medium">No Customer Prompt Retaining or Parameter Tuning</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                Unlike multi-tenant SaaS providers that log prompt interactions for training feedback loops, ClickRunClaw builds agent pipelines with strict zero-retention policies. Prompts and contextual memory exist only during task execution within your isolated container.
              </p>
              <p>
                We sign non-disclosure and data protection agreements guaranteeing that your proprietary company workflows, trade secrets, and customer communications never leave your agreed deployment parameters.
              </p>
            </div>
          </motion.div>

          {/* Section B */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">Optional Sovereign EU LLM Routing</h2>
                <p className="text-xs text-teal-400 font-medium">Keep Inferences Strictly Inside European Borders</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                For organizations with strict European regulatory mandates, we configure agents to route inference through EU-sovereign models. We support European provider endpoints (such as Mistral AI European nodes) as well as self-hosted open-weight architectures deployed directly on German or Finnish bare metal.
              </p>
              <p>
                This ensures that data processing remains 100% within the European Economic Area (EEA), eliminating international data transfer liability.
              </p>
            </div>
          </motion.div>

          {/* Section C */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111318] border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-space text-white">100% Async Zero-Trust Communication</h2>
                <p className="text-xs text-amber-400 font-medium">Eliminating Social Engineering &amp; Meeting-Link Attack Vectors</p>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed space-y-4 text-sm font-normal">
              <p>
                Video conferences and voice meetings introduce severe security vulnerabilities: calendar invite spoofing, rogue transcription bots, credential exposure during live screen sharing, and audio deepfake impersonation.
              </p>
              <p>
                By delivering 100% asynchronously via authenticated business email (<code className="text-[#FF5A5F] bg-white/5 px-2 py-0.5 rounded">support@clickrunclaw.com</code>) and tokenized sandbox links, every interaction has a verifiable cryptographic audit trail with zero social engineering entry points.
              </p>
            </div>
          </motion.div>

          {/* Security Contact Callout */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-r from-white/5 to-[#FF5A5F]/10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-xl font-bold font-space text-white mb-2">Vulnerability Disclosure &amp; Security Audits</h3>
              <p className="text-sm text-zinc-400">
                If you have identified a potential security vulnerability or require enterprise audit paperwork, contact our engineering team.
              </p>
            </div>
            <a
              href="mailto:support@clickrunclaw.com"
              className="shrink-0 text-sm font-bold text-white bg-[#FF5A5F] hover:bg-[#ff4247] px-6 py-3 rounded-full transition-colors flex items-center gap-2 shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>support@clickrunclaw.com</span>
            </a>
          </motion.div>
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
