'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'EU Security', href: '/security' },
];

export default function StaticHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="relative z-50 border-b border-white/10 bg-zinc-950 px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]">
        <span className="mr-1.5 font-bold text-[#FF5A5F]">EU</span>
        <span className="hidden sm:inline">Germany &amp; Finland infrastructure</span>
        <span className="sm:hidden">Dedicated EU infrastructure</span>
        <span className="mx-2 text-zinc-600" aria-hidden="true">/</span>
        <span>Zero meetings</span>
        <span className="mx-2 hidden text-zinc-600 sm:inline" aria-hidden="true">/</span>
        <span className="hidden sm:inline">100% async delivery</span>
      </div>

      <header className="sticky left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#090A0F]/85 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 py-2 text-xl font-bold tracking-tighter text-white font-space"
            aria-label="ClickRunClaw home"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#090A0F] transition-transform group-hover:scale-105">
              <Image
                src="/mascot-288.webp"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
                priority
              />
            </span>
            <span>ClickRunClaw</span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-2 text-[11px] font-semibold uppercase tracking-[0.14em] font-space transition-colors ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-[#FF5A5F]'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px transition-colors ${
                      active ? 'bg-[#FF5A5F]' : 'bg-transparent'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/#contact"
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#FF5A5F] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ff4247]"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Deploy Custom Agent</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </nav>

        {mobileOpen && (
          <div
            id="mobile-nav"
            className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-white/10 bg-[#090A0F] px-5 py-5 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col text-sm font-semibold uppercase tracking-wider font-space text-zinc-300">
              <Link
                href="/"
                className="rounded-lg px-2 py-3 transition-colors hover:bg-white/5 hover:text-[#FF5A5F]"
              >
                Home
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`rounded-lg px-2 py-3 transition-colors hover:bg-white/5 hover:text-[#FF5A5F] ${
                    pathname === link.href ? 'text-white' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FF5A5F] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF5A5F]/20 transition-colors hover:bg-[#ff4247]"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Deploy Custom Agent</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
