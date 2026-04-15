'use client';

import { motion } from 'motion/react';
import { CreditCard, Zap, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-space mb-2">Billing & Credits</h1>
        <p className="text-zinc-400">Manage your subscription, credits, and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credits Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-zinc-400 font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Available Credits
            </h2>
            <div className="text-4xl font-bold font-space text-white mb-4">$45.50</div>
            <p className="text-sm text-zinc-400 mb-6">Auto-recharge is enabled when balance falls below $10.00.</p>
            <button className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors font-medium text-sm">
              Add Credits
            </button>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-space">Current Plan</h2>
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-bold text-white">Pro Hosting</span>
              <span className="text-zinc-500 mb-1">/ $29 per month</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {['5 Active Agents', 'Priority 24/7 Support', 'Custom Domains', 'White-label Webhooks'].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] text-sm">
              Upgrade Plan
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-medium text-sm text-zinc-300">
              Cancel Subscription
            </button>
          </div>
        </motion.div>
      </div>

      {/* Payment History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold font-space mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 text-sm">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Apr 12, 2026', desc: 'Pro Hosting - Monthly', amount: '$29.00', status: 'Paid' },
                { date: 'Mar 12, 2026', desc: 'Pro Hosting - Monthly', amount: '$29.00', status: 'Paid' },
                { date: 'Feb 12, 2026', desc: 'Credit Recharge', amount: '$50.00', status: 'Paid' },
              ].map((invoice, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-zinc-300">{invoice.date}</td>
                  <td className="py-4 text-white font-medium">{invoice.desc}</td>
                  <td className="py-4 text-zinc-300">{invoice.amount}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium border border-green-500/20">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-zinc-400 hover:text-white inline-flex">
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
