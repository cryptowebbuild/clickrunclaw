'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Server, TerminalSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
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

      <main className="max-w-6xl mx-auto px-6 pt-40 pb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-coral/10 border border-coral/20 text-coral text-xs font-black uppercase tracking-widest mb-8">
            <Shield className="w-4 h-4" /> Secure Protocol
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space mb-8 tracking-tighter text-zinc-900 dark:text-white">
            Fortress <br className="hidden md:block" />
            <span className="text-coral">Architecture</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
            Every layer of the ClickRunClaw stack is hardened to ensure your AI agents and data remain impenetrable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 hover:border-coral/30 transition-all shadow-sm group hover:shadow-2xl hover:shadow-coral/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
              <Server className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black font-space mb-4 dark:text-white uppercase tracking-tight">Cloud Isolation</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Every instance on ClickRunClaw runs in its own strictly isolated jail. We utilize hardware-level virtualization to guarantee zero cross-talk between tenant nodes.
            </p>
          </motion.section>

          {/* Feature 2 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 hover:border-coral/30 transition-all shadow-sm group hover:shadow-2xl hover:shadow-coral/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
              <Lock className="w-8 h-8 text-coral" />
            </div>
            <h3 className="text-2xl font-black font-space mb-4 dark:text-white uppercase tracking-tight">GCM Encryption</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Your API keys are encrypted at rest using AES-256-GCM. All data in transit is secured via TLS 1.3, ensuring your sensitive credentials are never exposed.
            </p>
          </motion.section>

          {/* Feature 3 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 hover:border-coral/30 transition-all shadow-sm group hover:shadow-2xl hover:shadow-coral/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-black font-space mb-4 dark:text-white uppercase tracking-tight">Tier-3 Hosting</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Deployed on global high-performance cloud clusters. We enforce Ed25519 key authentication for all nodes, eliminating password-based entry risks.
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
