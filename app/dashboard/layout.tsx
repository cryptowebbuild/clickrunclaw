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
    <div className="p-6 flex items-center gap-3 font-bold text-xl font-space">
      <TerminalSquare className="w-7 h-7 text-purple-500" />
      <span className="text-white">ClickRunClaw</span>
    </div>

    <nav className="flex-1 px-4 space-y-2 mt-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
        return (
          <Link 
            key={item.name} 
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]' 
                : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>

    <div className="p-4 mt-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userEmail || 'Loading...'}</p>
            <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/10"
        >
          <LogOut className="w-4 h-4" />
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-[#050505] to-[#050505] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur-2xl z-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        <SidebarContent pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} userEmail={userEmail} handleSignOut={handleSignOut} />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-lg font-space">
          <TerminalSquare className="w-6 h-6 text-purple-500" />
          <span>ClickRunClaw</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              className="w-72 h-full bg-[#050505] border-r border-white/10 relative"
              onClick={e => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} setIsMobileMenuOpen={setIsMobileMenuOpen} userEmail={userEmail} handleSignOut={handleSignOut} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
        
        {/* Top Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">
              {navItems.find(i => i.href === pathname)?.name || 'Overview'}
            </span>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] active:scale-95 border border-white/10">
            <Zap className="w-4 h-4 fill-white" />
            Deploy New Agent
          </button>
        </header>

        {/* Mobile CTA (shown below header on mobile) */}
        <div className="md:hidden p-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
           <button className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 border border-white/10">
            <Zap className="w-4 h-4 fill-white" />
            Deploy New Agent
          </button>
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
