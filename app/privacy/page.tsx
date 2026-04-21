'use client';

import { motion } from 'framer-motion';
import { EyeOff, Database, UserCheck, TerminalSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/5 bg-[#FAFAFA]/80 dark:bg-[#090A0F]/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-zinc-900 dark:text-white group">
            <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,90,95,0.3)] group-hover:scale-110 transition-transform">
              <TerminalSquare className="w-4 h-4" />
            </div>
            <span>ClickRunClaw</span>
          </Link>
          <Link href="/" className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-coral transition-colors flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black font-space mb-8 tracking-tighter text-zinc-900 dark:text-white">
            Data Integrity <br/>
            <span className="text-coral">Refined.</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-500 font-light leading-relaxed max-w-2xl">
            Privacy isn&apos;t a feature—it&apos;s our core architecture. Discover how we protect your information at ClickRunClaw.
          </p>
        </motion.div>

        <div className="space-y-12">
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center shadow-inner">
                <EyeOff className="w-7 h-7 text-coral" />
              </div>
              <h2 className="text-3xl font-black font-space dark:text-white uppercase tracking-tight">Zero Training</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg font-light">
              We strictly <strong className="text-zinc-900 dark:text-zinc-200 font-bold">DO NOT</strong> train any AI models on your conversations, prompts, or deployed agent data. Your interactions remain completely private and are processed ephemerally within your isolated cloud container.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                <Database className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black font-space dark:text-white uppercase tracking-tight">Secure Vault</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg font-light">
              Authentication is handled via industry-standard OAuth 2.0. We never store your passwords. All billing is processed through our secure, PCI-compliant payment gateways. We only retain the absolute minimum metadata required to keep your pods active.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-inner">
                <UserCheck className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="text-3xl font-black font-space dark:text-white uppercase tracking-tight">Total Ownership</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg font-light">
              You maintain absolute control. Every user has unrestricted power to pause, terminate, or permanently purge their ClickRunClaw instances and associated data at any time. When you select delete, it is wiped from our registry forever.
            </p>
          </motion.section>
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 text-center relative z-10 mt-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-800">
          Engineered with precision &copy; {new Date().getFullYear()} ClickRunClaw
        </p>
      </footer>
    </div>
  );
}
