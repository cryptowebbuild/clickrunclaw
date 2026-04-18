'use client';

import { motion } from 'motion/react';
import { CreditCard, Zap, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function BillingPage() {
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
            <div className="text-5xl font-black font-space text-zinc-900 dark:text-white mb-6 tracking-tighter">$45.50</div>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-10 leading-relaxed italic">Auto-recharge is active when balance drops below $10.00.</p>
            <button className="w-full py-4 rounded-full bg-zinc-900 dark:bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-bold text-sm shadow-lg mt-auto">
              Add Credits
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
              <span className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">$29</span>
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
            <button className="px-8 py-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all text-sm shadow-[0_4px_15px_rgba(252,93,93,0.3)]">
              Manage Subscription
            </button>
            <button className="px-8 py-4 rounded-full bg-transparent border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all font-bold text-sm">
              View Billing Portal
            </button>
          </div>
        </motion.div>
      </div>

      {/* Payment History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-10 shadow-sm"
      >
        <h2 className="text-2xl font-black font-space mb-10 text-zinc-900 dark:text-white uppercase tracking-tight">Invoice History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-white/5 text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                <th className="pb-6 font-black">Date</th>
                <th className="pb-6 font-black">Description</th>
                <th className="pb-6 font-black">Amount</th>
                <th className="pb-6 font-black">Status</th>
                <th className="pb-6 font-black text-right">PDF</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Apr 12, 2026', desc: 'Secure Pro Hosting - Monthly', amount: '$29.00', status: 'Paid' },
                { date: 'Mar 12, 2026', desc: 'Secure Pro Hosting - Monthly', amount: '$29.00', status: 'Paid' },
                { date: 'Feb 12, 2026', desc: 'Advanced Credit Recharge', amount: '$50.00', status: 'Paid' },
              ].map((invoice, i) => (
                <tr key={i} className="border-b border-zinc-50 dark:border-white/5 last:border-0 text-sm group">
                  <td className="py-6 text-zinc-500 dark:text-zinc-500 font-medium">{invoice.date}</td>
                  <td className="py-6 text-zinc-900 dark:text-zinc-200 font-bold tracking-tight">{invoice.desc}</td>
                  <td className="py-6 text-zinc-900 dark:text-zinc-200 font-black tracking-tighter">{invoice.amount}</td>
                  <td className="py-6">
                    <span className="px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    <button className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 hover:bg-coral hover:text-white transition-all border border-zinc-200 dark:border-white/10 text-zinc-400 inline-flex items-center justify-center shadow-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
