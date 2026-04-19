'use client';

import { motion } from 'motion/react';
import { TerminalSquare, ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import Header from '../components/Header';
import Footer from '../components/Footer';

const blogPosts = [
  {
    id: 1,
    title: "How to Deploy AI Agents in A Second",
    excerpt: "Skip the complex hardware setups. Learn how our one-click cloud architecture lets you spin up OpenClaw agents instantly.",
    date: "April 18, 2026",
    category: "Tutorial",
    image: "https://picsum.photos/seed/cloud/800/600"
  },
  {
    id: 2,
    title: "Securing Your Keys: AES-256-GCM Deep Dive",
    excerpt: "Discover how namespace jails and high-grade encryption keep your sensitive API credentials safe from prying eyes.",
    date: "April 15, 2026",
    category: "Security",
    image: "https://picsum.photos/seed/security/800/600"
  },
  {
    id: 3,
    title: "The Roadmap: Telegram & Discord Hub",
    excerpt: "Explore the upcoming integrations that will allow your ClickRunClaw agents to dominate major messaging platforms.",
    date: "April 10, 2026",
    category: "Product",
    image: "https://picsum.photos/seed/ai/800/600"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-coral/20 bg-coral/5 text-[10px] md:text-xs text-coral font-bold tracking-wider uppercase mb-8">
            <Calendar className="w-3.5 h-3.5" />
            <span>Latest Updates</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space mb-8 tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
            The Engineering <br className="hidden md:block" />
            <span className="text-coral">Journal.</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
            Insights, technical deep dives, and platform news from the ClickRunClaw team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-coral/20 transition-all flex flex-col shadow-sm hover:shadow-2xl hover:shadow-coral/5"
            >
              {/* Image Area */}
              <div className="h-60 w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div className="absolute inset-0 bg-coral opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={i < 2}
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A5F] bg-[#FF5A5F]/5 border border-[#FF5A5F]/10 px-4 py-1.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
                    {post.date}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold font-space mb-4 text-zinc-900 dark:text-white group-hover:text-coral transition-colors tracking-tight">
                  {post.title}
                </h2>
                
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 flex-1 font-light text-base">
                  {post.excerpt}
                </p>
                
                <Link href="#" className="inline-flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-white group/btn">
                  <span>Read Article</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover/btn:bg-coral group-hover/btn:text-white transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
