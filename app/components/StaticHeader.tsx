import Link from 'next/link';
import Image from 'next/image';

export default function StaticHeader() {
  return (
    <>
      <div className="bg-zinc-900 dark:bg-black text-white text-center py-2 text-xs font-bold tracking-widest uppercase border-b border-zinc-800 z-50 relative">
        <span className="text-[#FF5A5F] mr-2">🚀</span> New: Deploy OpenClaw Agents in 1 Second Flat
      </div>

      <header className="sticky top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter font-space text-zinc-900 dark:text-white group">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform bg-[#090A0F]">
              <Image src="/mascot.webp" alt="ClickRunClaw Mascot" width={32} height={32} className="object-contain" />
            </div>
            <span>ClickRunClaw</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-[#FF5A5F] transition-colors">Home</Link>
            <Link href="/#pricing" className="hover:text-[#FF5A5F] transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-[#FF5A5F] transition-colors">Blog</Link>
          </div>

          <Link
            href="/auth"
            className="hidden md:flex items-center justify-center h-10 px-6 text-sm font-bold text-white bg-[#FF5A5F] hover:bg-opacity-90 rounded-full transition-all shadow-sm"
          >
            Launch Agent
          </Link>
        </nav>
      </header>
    </>
  );
}
