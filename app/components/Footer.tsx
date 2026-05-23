import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Send, TerminalSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090A0F] text-zinc-400 py-20 border-t border-white/10 relative z-10 selection:bg-[#FF5A5F]/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Col 1 */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-white group">
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
                <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" />
              </div>
              <span>ClickRunClaw</span>
            </Link>
            <p className="text-sm font-light leading-relaxed text-zinc-500 max-w-xs">
              The premier cloud engine for OpenClaw agents. Deploy natively without complex configuration.
            </p>
          </div>

          {/* Col 2 */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h4 className="text-white font-bold font-space">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/#features" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Features</Link></li>
              <li><Link href="/blog" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Status</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h4 className="text-white font-bold font-space">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Privacy</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Security</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <h4 className="text-white font-bold font-space uppercase tracking-widest text-xs">Identity</h4>
            <ul className="space-y-4">
              <li>
                <Link href="mailto:support@clickrunclaw.com" className="text-sm font-medium hover:text-[#FF5A5F] transition-colors flex items-center gap-2">
                  <span className="text-zinc-600">Email:</span> support@clickrunclaw.com
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://x.com/clickrunclaw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300" title="Follow us on X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/ClickRunClaw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300" title="Join us on Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://t.me/ClickRunClaw" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF5A5F] hover:text-white transition-colors duration-300" title="Join our Telegram Channel">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} ClickRunClaw. Built for the future of AI Agents.
          </p>
          <div className="flex gap-4 text-xs font-medium text-zinc-600">
            <span>Powered by <a href="https://cryptowebbuild.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A5F] transition-colors">CryptoWebBuild</a></span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline">
               Developed by <a href="https://cryptowebbuild.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF5A5F] transition-colors">CryptoWebBuild Technology</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
