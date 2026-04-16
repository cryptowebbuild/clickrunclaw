'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Server, ShieldCheck, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    fetchUser();
  }, [supabase.auth]);

  const handleUpgrade = (plan: string) => {
    setToast(`Stripe Payment Initializing for ${plan} Plan...`);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full shadow-[0_0_40px_rgba(124,58,237,0.3)] flex items-center gap-3"
          >
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span className="font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section: Welcome */}
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold font-space mb-2"
        >
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user?.email?.split('@')[0] || 'Builder'}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg"
        >
          You are currently on the <span className="text-white font-medium">Free Tier</span>. Upgrade to deploy your OpenClaw agents.
        </motion.p>
      </div>

      {/* Middle Section: PLG Paywall (Pricing Pods) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Starter Pod */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-all" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 font-space flex items-center gap-2">
              <Server className="w-6 h-6 text-blue-400" />
              Starter Pod
            </h3>
            <p className="text-zinc-400 mb-6 h-12">Perfect for testing and small personal projects.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold tracking-tighter">$9</span>
              <span className="text-xl text-zinc-500 font-medium">/month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10">
              {[
                '1 Active Agent Container',
                'Standard Deployment Speed',
                'Community Plugins',
                'Basic Analytics'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto relative z-10">
            <button 
              onClick={() => handleUpgrade('Starter')}
              className="flex items-center justify-center w-full min-h-[56px] rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
            >
              Activate Starter
            </button>
          </div>
        </motion.div>

        {/* Pro Pod */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-purple-900/40 to-[#050505] backdrop-blur-xl border border-purple-500/50 rounded-[2rem] p-8 flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.15)] group hover:shadow-[0_0_60px_rgba(124,58,237,0.25)] transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-all" />
          
          <div className="absolute top-0 right-8 -translate-y-1/2 z-20">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              Most Popular
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 font-space text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              Pro Pod
            </h3>
            <p className="text-purple-200/70 mb-6 h-12">For serious builders and production deployments.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold tracking-tighter text-white">$29</span>
              <span className="text-xl text-purple-200/50 font-medium">/month</span>
            </div>
            <ul className="flex flex-col gap-4 mb-10">
              {[
                '5 Active Agent Containers',
                'Instant Warm-Pool Boots (<1s)',
                'All Premium Plugins & Integrations',
                'Advanced Analytics & Logs',
                'Custom Domains',
                'White-label Webhooks'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <span className="text-zinc-100">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto relative z-10">
            <button 
              onClick={() => handleUpgrade('Pro')}
              className="flex items-center justify-center w-full min-h-[56px] rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] active:scale-[0.98]"
            >
              Upgrade to Boot
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Trust Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex items-center justify-center gap-2 text-zinc-500 text-sm"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Secure payments powered by Stripe. Cancel anytime.</span>
      </motion.div>
    </div>
  );
}
