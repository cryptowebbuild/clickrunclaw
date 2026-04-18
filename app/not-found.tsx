import Link from 'next/link';
import { TerminalSquare, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] flex flex-col items-center justify-center text-zinc-900 dark:text-zinc-100 font-sans p-6 text-center selection:bg-coral/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-sm w-full space-y-8">
        <div className="mx-auto w-24 h-24 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl flex items-center justify-center shadow-inner group">
          <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-700 group-hover:scale-110 group-hover:text-coral transition-all duration-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black font-space text-zinc-900 dark:text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Trace Lost</h2>
          <p className="text-zinc-500 dark:text-zinc-500 font-light leading-relaxed px-4">
            The resource path you navigated to does not exist in our cloud registry. It may have been deprecated or relocated.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 px-10 h-14 bg-coral hover:bg-coral-hover text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Base
          </Link>
        </div>

        <div className="pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 dark:text-zinc-800 flex items-center justify-center gap-4">
          <span className="w-10 h-px bg-zinc-200 dark:bg-zinc-900" />
          ClickRunClaw Cloud
          <span className="w-10 h-px bg-zinc-200 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
