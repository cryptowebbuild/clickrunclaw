'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import StaticHeader from '../components/StaticHeader';
import Footer from '../components/Footer';
import type { BlogPost } from '@/lib/blog';

interface BlogIndexClientProps {
  blogPosts: BlogPost[];
}

export default function BlogIndexClient({ blogPosts }: BlogIndexClientProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4]">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <StaticHeader />

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
        <section className="mb-14 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0D1117]/80 backdrop-blur-xl shadow-[0_0_80px_rgba(255,90,95,0.05)] relative">
          <div className="absolute inset-0 bg-coral opacity-5 pointer-events-none blur-[100px] rounded-full" />
          <div className="relative grid gap-8 px-6 py-10 md:grid-cols-[1.3fr_0.7fr] md:px-12 md:py-16">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            </div>
            <div className="relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center w-fit gap-2 rounded-full border border-coral/30 bg-coral/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-coral shadow-[0_0_20px_rgba(255,90,95,0.15)] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Exclusive Insights
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-space tracking-tighter text-white leading-[1.1]">
                Master the Art of <br />
                <span className="text-coral">AI Cloud Deployment.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed font-light">
                High-converting strategies, architectural breakdowns, and unvarnished truths on scaling autonomous agencies in the Web3 space.
              </p>
            </div>
            <div className="relative z-10 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-md p-8 flex flex-col justify-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-coral mb-6 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Priority Reads
              </p>
              <div className="space-y-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-semibold text-zinc-200 hover:border-coral/40 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,90,95,0.1)] transition-all">
                    <span className="line-clamp-2 leading-snug group-hover:text-coral transition-colors">{post.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
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
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-coral/30 transition-all flex flex-col shadow-sm hover:shadow-[0_0_40px_rgba(255,90,95,0.1)] relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,90,95,0.05),transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-60 w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <div className="absolute inset-0 bg-coral opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                <Image 
                  src={post.image}
                  alt={post.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={i < 2}
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="p-10 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-coral bg-coral/10 border border-coral/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,90,95,0.1)]">
                    {post.category}
                  </span>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500">
                    {post.date}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black font-space text-zinc-900 dark:text-white mb-4 leading-tight group-hover:text-coral transition-colors">
                  <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 font-light leading-relaxed mb-8 flex-1 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-200 dark:border-white/10 dark:bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 group-hover:border-coral/20 group-hover:text-zinc-300 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white group-hover:text-coral transition-colors mt-auto w-fit">
                  Read Guide
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
