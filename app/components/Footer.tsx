import Link from 'next/link';
import Image from 'next/image';
import { Mail, ShieldCheck, Cpu } from 'lucide-react';

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#090A0F] text-zinc-400 py-16 border-t border-white/10 relative z-10 selection:bg-[#FF5A5F]/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Col 1: Brand & Positioning */}
          <div className="col-span-1 md:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-white group">
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
                <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" />
              </div>
              <span>ClickRunClaw</span>
            </Link>
            <p className="text-sm font-normal leading-relaxed text-zinc-400 max-w-xs">
              EU-First AI automation agency building production custom agents, workflow integrations, and sovereign AI pipelines. Dedicated European infrastructure from $799.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EU Infrastructure Online &bull; Germany &amp; Finland</span>
            </div>
          </div>

          {/* Col 2: Services & Proof */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h4 className="text-white font-bold font-space text-sm uppercase tracking-wider">Solutions &amp; Proof</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-[#FF5A5F] transition-colors">Services Hub &amp; Architectures</Link></li>
              <li><Link href="/case-studies" className="hover:text-[#FF5A5F] transition-colors">Client Case Studies &amp; ROI</Link></li>
              <li><Link href="/#demo" className="hover:text-[#FF5A5F] transition-colors">Live Interactive Demo</Link></li>
              <li><Link href="/pricing" className="hover:text-[#FF5A5F] transition-colors">Pricing &amp; ROI Calculator</Link></li>
            </ul>
          </div>

          {/* Col 3: Protocol & Legal */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h4 className="text-white font-bold font-space text-sm uppercase tracking-wider">Protocol &amp; Security</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/how-it-works" className="hover:text-[#FF5A5F] transition-colors">The 100% Async Protocol</Link></li>
              <li><Link href="/security" className="hover:text-[#FF5A5F] transition-colors">EU Security Architecture</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FF5A5F] transition-colors">Privacy Policy &amp; GDPR</Link></li>
              <li>
                <span className="text-xs text-zinc-500 block">Zero AI Model Training Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Inquiry & Social */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h4 className="text-white font-bold font-space uppercase tracking-wider text-sm">Direct Contact</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              100% Async written communication. All scoping, proposals, and live sandboxes delivered directly to your inbox.
            </p>
            <div>
              <a
                href="mailto:support@clickrunclaw.com"
                className="text-sm font-semibold text-white hover:text-[#FF5A5F] transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#FF5A5F]" />
                <span>support@clickrunclaw.com</span>
              </a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com/clickrunclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300 text-zinc-400"
                aria-label="Follow us on X"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/ClickRunClaw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300 text-zinc-400"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/ClickRunClaw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300 text-zinc-400"
                aria-label="Join our Telegram Channel"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="font-medium tracking-wide">
            &copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved. 100% Async Delivery &bull; Dedicated EU Infrastructure.
          </p>
          <div className="flex items-center gap-2">
            <span>An AI Automation Venture by</span>
            <a
              href="https://cryptowebbuild.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-[#FF5A5F] font-semibold underline underline-offset-4 transition-colors"
            >
              CryptoWebBuild
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
