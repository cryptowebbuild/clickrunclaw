'use client';

import { motion } from 'motion/react';
import { TerminalSquare, ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "How to Deploy OpenClaw in 10 Seconds without a Mac Mini",
    excerpt: "Skip the expensive hardware. Learn how our warm-pooling Docker architecture lets you spin up OpenClaw instantly from your smartphone.",
    date: "April 14, 2026",
    category: "Tutorial",
    gradient: "from-purple-600/40 to-blue-600/40"
  },
  {
    id: 2,
    title: "Securing your AI Agents: Why Docker Isolation Matters",
    excerpt: "Dive deep into the security architecture of ClickRunClaw. Discover how namespace jails and AES-256-GCM encryption keep your API keys safe.",
    date: "April 10, 2026",
    category: "Security",
    gradient: "from-blue-600/40 to-emerald-600/40"
  },
  {
    id: 3,
    title: "The Future of OpenClaw: Integrating Telegram and Discord Bots",
    excerpt: "Explore the upcoming webhook integrations that will allow your OpenClaw agents to communicate seamlessly across major messaging platforms.",
    date: "April 5, 2026",
    category: "Product Updates",
    gradient: "from-orange-600/40 to-purple-600/40"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none -z-10" />
      
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

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-space mb-6 tracking-tight">
            The ClickRunClaw <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Journal</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
            Insights, tutorials, and updates from the engineering team at CryptoWebBuild.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group hover:border-purple-500/30 transition-colors flex flex-col"
            >
              {/* Mock Image Area */}
              <div className={`h-48 w-full bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-4 text-xs font-medium">
                  <span className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                    {post.category}
                  </span>
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold font-space mb-4 group-hover:text-purple-300 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-zinc-400 leading-relaxed mb-8 flex-1">
                  {post.excerpt}
                </p>
                
                <Link href="#" className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-purple-400 transition-colors mt-auto">
                  Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <footer className="py-8 border-t border-white/5 text-center text-zinc-500 text-sm relative z-10 mt-12">
        <p>Engineered with precision by <span className="text-zinc-300 font-medium">CryptoWebBuild</span>.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved.</p>
      </footer>
    </div>
  );
}
