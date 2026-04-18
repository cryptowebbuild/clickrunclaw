'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TerminalSquare, LayoutDashboard, Blocks, 
  CreditCard, Settings, LogOut, Menu, X, Plus, ChevronRight, Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Agents', href: '/dashboard/agents', icon: Blocks },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const SidebarContent = ({ 
  pathname, 
  setIsMobileMenuOpen, 
  userEmail,
  handleSignOut
}: { 
  pathname: string, 
  setIsMobileMenuOpen: (val: boolean) => void,
  userEmail: string | null,
  handleSignOut: () => void
}) => (
    <div className="flex flex-col h-full relative z-10">
      <div className="p-8 flex items-center gap-3 font-bold text-xl font-space">
        <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white shadow-[0_0_15px_rgba(252,93,93,0.3)]">
          <TerminalSquare className="w-4 h-4" />
        </div>
        <span className="text-white tracking-tighter">ClickRunClaw</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all group ${
                isActive 
                  ? 'bg-zinc-900 dark:bg-zinc-900 text-white dark:text-white border border-zinc-200 dark:border-white/10' 
                  : 'text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-coral' : 'group-hover:text-zinc-900 dark:group-hover:text-zinc-300'}`} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-800">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{userEmail || 'Loading...'}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 truncate uppercase font-black tracking-widest">Premium User</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold border border-zinc-200 dark:border-zinc-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-white flex flex-col md:flex-row font-sans selection:bg-zinc-800 relative overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0D1117] z-20 relative shadow-2xl">
        <SidebarContent pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} userEmail={userEmail} handleSignOut={handleSignOut} />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090A0F] sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-lg font-space text-zinc-900 dark:text-white">
          <TerminalSquare className="w-5 h-5 text-coral" />
          <span>ClickRunClaw</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="w-64 h-full bg-white dark:bg-[#090A0F] border-r border-zinc-200 dark:border-zinc-800 relative"
              onClick={e => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} userEmail={userEmail} handleSignOut={handleSignOut} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10 bg-[#FAFAFA] dark:bg-[#090A0F]">
        
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#090A0F]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-black text-zinc-500 dark:text-zinc-600">
            <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-800" />
            <span className="text-zinc-900 dark:text-zinc-200">
              {navItems.find(i => i.href === pathname)?.name || 'Overview'}
            </span>
          </div>
          
          <Link href="/dashboard" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all shadow-[0_4px_10px_rgba(252,93,93,0.2)] text-sm">
            <Zap className="w-4 h-4 fill-white" />
            Deploy Agent
          </Link>
        </header>

        {/* Mobile CTA (shown below header on mobile) */}
        <div className="md:hidden p-4 border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#090A0F]">
           <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all text-sm shadow-[0_4px_10px_rgba(252,93,93,0.2)]">
            <Zap className="w-4 h-4 fill-white" />
            Deploy Agent
          </Link>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
