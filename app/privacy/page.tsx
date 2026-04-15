'use client';

import { motion } from 'motion/react';
import { EyeOff, Database, UserCheck, TerminalSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
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

      <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-space mb-6 tracking-tight">
            Your Data, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Your Control</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            At ClickRunClaw, privacy isn&apos;t an afterthought. It&apos;s the foundation of our architecture.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold font-space">Zero AI Training</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed text-lg">
              We strictly <strong>DO NOT</strong> train any AI models on your conversations, prompts, or deployed agent data. Your interactions remain completely private and are processed ephemerally within your isolated container.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold font-space">Secure Data Handling</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed text-lg">
              Authentication is seamlessly handled via Google and GitHub OAuth, ensuring we never store your passwords. All billing and Stripe payments are processed through <strong>CryptoWebBuild&apos;s</strong> secure, PCI-compliant gateway. We only store the minimum data required to keep your agents running.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold font-space">Total Transparency</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed text-lg">
              You are in the driver&apos;s seat. Every user has full, unrestricted control to pause, terminate, or permanently delete their OpenClaw instances and associated data at any time. When you click delete, it&apos;s gone forever.
            </p>
          </motion.section>
        </div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-zinc-500 text-sm relative z-10 mt-12">
        <p>Engineered with precision by <span className="text-zinc-300 font-medium">CryptoWebBuild</span>.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved.</p>
      </footer>
    </div>
  );
}
