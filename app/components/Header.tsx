'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-zinc-900 dark:bg-black text-white text-center py-2 text-xs font-bold tracking-widest uppercase border-b border-zinc-800 z-50 relative">
        <span className="text-[#FF5A5F] mr-2">🚀</span> New: Deploy OpenClaw Agents in 1 Second Flat
      </div>

      {/* Navbar */}
      <header className="sticky top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-zinc-900 dark:text-white group">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
              <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" />
            </div>
            <span>ClickRunClaw</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-[#FF5A5F] transition-colors">Home</Link>
            <Link href="/#features" className="hover:text-[#FF5A5F] transition-colors">Features</Link>
            <Link href="/#pricing" className="hover:text-[#FF5A5F] transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-[#FF5A5F] transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-center h-10 px-6 text-sm font-bold text-white bg-[#FF5A5F] hover:bg-opacity-90 rounded-full transition-all shadow-sm"
                >
                  Dashboard
                </Link>
                <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-300 font-bold border border-zinc-800">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="hidden md:flex items-center justify-center h-10 px-6 text-sm font-bold text-white bg-[#FF5A5F] hover:bg-opacity-90 rounded-full transition-all shadow-sm"
              >
                Launch Agent
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-[#FF5A5F] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#090A0F]/95 backdrop-blur-3xl overflow-hidden"
            >
              <div className="px-4 py-8 flex flex-col gap-6">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-zinc-900 dark:text-white hover:text-[#FF5A5F] transition-colors">Home</Link>
                <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-zinc-900 dark:text-white hover:text-[#FF5A5F] transition-colors">Features</Link>
                <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-zinc-900 dark:text-white hover:text-[#FF5A5F] transition-colors">Pricing</Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-zinc-900 dark:text-white hover:text-[#FF5A5F] transition-colors">Blog</Link>
                <div className="pt-6 border-t border-zinc-200 dark:border-white/10 mt-2">
                  {user ? (
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center h-14 w-full text-lg font-bold text-white bg-[#FF5A5F] hover:bg-opacity-90 rounded-full transition-all"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/auth" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center h-14 w-full text-lg font-bold text-white bg-[#FF5A5F] hover:bg-opacity-90 rounded-full transition-all"
                    >
                      Launch Agent
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
