'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function StaticHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-zinc-950 text-white text-center py-2 px-4 text-xs font-semibold tracking-wider uppercase border-b border-white/10 z-50 relative">
        <span className="text-[#FF5A5F] mr-2 font-bold">🇪🇺</span>
        <span>EU-First AI Automation &bull; Dedicated German Bare-Metal &bull; 100% Async Delivery</span>
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#090A0F]/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-zinc-900 dark:text-white group">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
              <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" priority />
            </div>
            <span>ClickRunClaw</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase font-space text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-[#FF5A5F] transition-colors">Home</Link>
            <Link href="/services" className="hover:text-[#FF5A5F] transition-colors">Services</Link>
            <Link href="/case-studies" className="hover:text-[#FF5A5F] transition-colors">Case Studies</Link>
            <Link href="/how-it-works" className="hover:text-[#FF5A5F] transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-[#FF5A5F] transition-colors">Pricing</Link>
            <Link href="/security" className="hover:text-[#FF5A5F] transition-colors">EU Security</Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/#contact"
              className="flex items-center gap-2 justify-center h-10 px-5 text-xs font-bold uppercase tracking-wider text-white bg-[#FF5A5F] hover:bg-[#ff4247] rounded-full transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,90,95,0.3)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deploy Custom Agent</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-zinc-900 dark:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#090A0F] px-4 py-4">
            <div className="flex flex-col gap-2.5 text-xs font-semibold uppercase tracking-wider font-space text-zinc-700 dark:text-zinc-300">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">Home</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">Services</Link>
              <Link href="/case-studies" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">Case Studies</Link>
              <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">How It Works</Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">Pricing</Link>
              <Link href="/security" onClick={() => setMobileOpen(false)} className="py-2 hover:text-[#FF5A5F] transition-colors">EU Security</Link>
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full bg-[#FF5A5F] hover:bg-[#ff4247] text-white font-bold text-xs uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deploy Custom Agent</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
