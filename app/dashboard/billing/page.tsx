'use client';

import { motion } from 'framer-motion';
import { CreditCard, Zap, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function BillingPage() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, [supabase]);

  const handleWhopCheckout = (planId: string) => {
    if (!user?.id) {
      window.location.href = `/auth?intent=checkout&plan=${encodeURIComponent(planId)}`;
      return;
    }

    const whopCheckoutUrl = `https://whop.com/checkout/${planId}?custom_user_id=${user.id}&email=${encodeURIComponent(user.email || '')}`;
    window.location.href = whopCheckoutUrl;
  };

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black font-space mb-2 tracking-tighter text-zinc-900 dark:text-white">Billing & Credits</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-light">Manage your subscription, secure credits, and high-performance hosting plans.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credits Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-10 relative overflow-hidden shadow-sm"
        >
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-3 text-[10px]">
              <Zap className="w-4 h-4 text-coral" />
              Available Balance
            </h2>
            <div className="text-5xl font-black font-space text-zinc-900 dark:text-white mb-6 tracking-tighter">Starter</div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-10 leading-relaxed italic">Upgrade to the Starter Plan to test capabilities before pushing large scale traffic models.</p>
            <button 
              onClick={() => handleWhopCheckout('plan_T8nSbRxGGTlly')}
              className="w-full py-4 rounded-full bg-zinc-900 dark:bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-bold text-sm shadow-lg mt-auto"
            >
              $9.99 Starter Plan
            </button>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-[#111318] border border-coral/20 rounded-[2rem] p-10 flex flex-col justify-between shadow-2xl shadow-coral/5"
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black font-space tracking-tight text-zinc-900 dark:text-white uppercase">Pro Infrastructure</h2>
              <span className="px-5 py-1.5 bg-coral/10 border border-coral/20 text-coral rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                Active Subscription
              </span>
            </div>
            <div className="flex items-end gap-2 mb-10">
              <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">$29.99</span>
              <span className="text-zinc-500 dark:text-zinc-500 mb-2 font-bold text-lg">/ per month</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {['5 Active High-Performance Agents', 'Priority 24/7 Tech Support', 'Custom Verified Domains', 'White-label Secure Webhooks'].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-sm text-zinc-900 dark:text-zinc-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleWhopCheckout('plan_Bhg70HYNZqmJV')}
              className="px-8 py-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all text-sm shadow-[0_4px_15px_rgba(252,93,93,0.3)]"
            >
              Upgrade Subscription
            </button>
            <a href="mailto:support@clickrunclaw.com?subject=Billing%20portal%20access" className="px-8 py-4 rounded-full bg-transparent border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all font-bold text-sm text-center">
              Contact Billing Support
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-10 shadow-sm relative overflow-hidden"
      >
        <h2 className="text-2xl font-black font-space mb-4 text-zinc-900 dark:text-white uppercase tracking-tight">Invoices and receipts</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Live invoice history is not wired into the dashboard yet. For billing receipts, renewals, or portal access, use Whop billing management or contact support.
        </p>
      </motion.div>
    </div>
  );
}
