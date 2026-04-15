'use client';

import { motion } from 'motion/react';
import { Shield, Lock, Server, TerminalSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      {/* Header */}
      <header className="px-6 py-6 border-b border-white/5 relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl font-space hover:opacity-80 transition-opacity">
          <TerminalSquare className="w-6 h-6 text-purple-500" />
          <span>ClickRunClaw</span>
        </Link>
        <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Security First
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-space mb-6 tracking-tight">
            Enterprise-Grade Security <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">for OpenClaw Deployment</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
            Engineered by CryptoWebBuild, our architecture ensures your AI agents and data remain impenetrable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Server className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold font-space mb-4">Docker Container Isolation</h3>
            <p className="text-zinc-400 leading-relaxed">
              Every OpenClaw instance on ClickRunClaw runs in its own strictly isolated jail. We utilize advanced namespace and cgroup configurations to guarantee zero cross-talk between tenant environments.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold font-space mb-4">Military-Grade Encryption</h3>
            <p className="text-zinc-400 leading-relaxed">
              Your API keys are encrypted at rest using AES-256-GCM. All data in transit is secured via TLS 1.2+ protocols, ensuring your sensitive credentials are never exposed.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold font-space mb-4">Hardened Infrastructure</h3>
            <p className="text-zinc-400 leading-relaxed">
              Deployed on high-performance Hetzner Cloud servers. We enforce strict Ed25519 key authentication for all internal node communications, eliminating password-based vulnerabilities.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-zinc-500 text-sm relative z-10 mt-12">
        <p>Engineered with precision by <span className="text-zinc-300 font-medium">CryptoWebBuild</span>.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved.</p>
      </footer>
    </div>
  );
}
