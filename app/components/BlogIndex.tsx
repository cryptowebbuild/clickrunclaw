'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  TrendingUp,
  Server,
  Layers,
  ChevronRight,
} from 'lucide-react';

import StaticHeader from '@/app/components/StaticHeader';
import Footer from '@/app/components/Footer';
import { BLOG_POSTS, BlogPost } from '@/lib/blog';

const CATEGORIES = [
  'All',
  'EU Sovereignty',
  'Workflow Automation',
  'Case Study',
  'ROI & Finance',
] as const;

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-[#090A0F] text-zinc-100 selection:bg-[#FF5A5F]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
      </div>

      <StaticHeader />

      <main id="main" className="relative z-10 pt-16 pb-24">
        {/* ============================================================ */}
        {/* HERO SECTION                                                */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-6 text-center pt-8 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sovereign AI Research &amp; Engineering Intel</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-space text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
            Deep Technical Intel on <br className="hidden sm:block" />
            <span className="text-[#FF5A5F]">Sovereign AI &amp; Enterprise Automation</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Rigorous benchmarks, compliance blueprints, and empirical case studies on deploying single-tenant AI agents on European bare-metal infrastructure.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technical blueprints, GDPR compliance, ROI math, or case studies..."
                className="w-full bg-[#111318] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF5A5F] text-white shadow-md shadow-[#FF5A5F]/20'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FEATURED POST HERO CARD (WHEN NO SEARCH FILTER)             */}
        {/* ============================================================ */}
        {searchQuery === '' && selectedCategory === 'All' && (
          <section className="max-w-6xl mx-auto px-6 mb-16">
            <div className="bg-gradient-to-b from-[#141824] to-[#0D1117] border-2 border-[#FF5A5F]/60 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              <div className="absolute -top-3 left-8 bg-[#FF5A5F] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Featured Flagship Research
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="text-[#FF5A5F] font-bold">{featuredPost.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight leading-snug">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="hover:text-[#FF5A5F] transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {featuredPost.keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 bg-black/40 p-6 rounded-2xl border border-white/10">
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                      Author &bull; Peer Reviewed
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-[#090A0F] flex items-center justify-center shrink-0">
                        <Image
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-space text-white">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {featuredPost.author.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#FF5A5F]/20 group"
                  >
                    <span>Read Full Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* ARTICLES GRID                                               */}
        {/* ============================================================ */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-xl sm:text-2xl font-black font-space text-white">
              {selectedCategory === 'All' ? 'All Engineering Articles' : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-[#111318] rounded-3xl border border-white/10 p-8">
              <p className="text-zinc-400 text-sm">
                No articles found matching &ldquo;{searchQuery}&rdquo;. Try another search keyword or select &ldquo;All&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-gradient-to-b from-[#0D1117] to-[#090A0F] border border-white/10 rounded-3xl p-7 sm:p-8 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#FF5A5F] font-bold bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-space text-white group-hover:text-[#FF5A5F] transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] font-mono text-zinc-500">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A5F] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Article</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* BOTTOM HIGH-CONVERTING CTA BANNER                           */}
        {/* ============================================================ */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-b from-[#141824] to-[#0D1117] border border-white/10 space-y-6 shadow-2xl">
            <h3 className="text-2xl sm:text-4xl font-black font-space text-white tracking-tight">
              Turn Knowledge Into Deployed Code
            </h3>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Every workflow documented in our research hub can be engineered and deployed to dedicated German bare-metal for your company in 7 days.
            </p>
            <div className="pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#FF5A5F]/20 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit 8-Minute Project Brief</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
