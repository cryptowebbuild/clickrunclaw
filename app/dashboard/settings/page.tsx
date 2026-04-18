'use client';

import { motion } from 'motion/react';
import { User, Mail, Lock, Shield, Bell, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-10 max-w-4xl pb-20">
      <div>
        <h1 className="text-4xl font-black font-space mb-2 tracking-tighter text-zinc-900 dark:text-white uppercase">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-light">Manage your global workspace preferences and agent security parameters.</p>
      </div>

      {/* Profile Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
      >
        <h2 className="text-xl font-bold font-space mb-10 flex items-center gap-4 text-zinc-900 dark:text-white uppercase tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
            <User className="w-5 h-5 text-coral" />
          </div>
          Profile Parameters
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-900 dark:text-white font-black text-3xl shrink-0 shadow-inner">
            JD
          </div>
          
          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-4">Full Identity</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-4">Encrypted Email</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  disabled
                  className="w-full px-6 py-4 bg-zinc-100 dark:bg-black/20 opacity-50 border border-zinc-200 dark:border-white/5 rounded-full text-zinc-500 dark:text-zinc-700 cursor-not-allowed font-medium"
                />
              </div>
            </div>
            <button className="px-10 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg">
              Save Configuration
            </button>
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
      >
        <h2 className="text-xl font-bold font-space mb-10 flex items-center gap-4 text-zinc-900 dark:text-white uppercase tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          Access Protocols
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 group hover:border-coral/20 transition-all shadow-inner">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-400" /> Password Authentication
              </h3>
              <p className="text-sm text-zinc-500 font-light">Last rotation cycle: 90 days ago</p>
            </div>
            <button className="px-6 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-300 hover:text-coral transition-colors text-xs font-black uppercase tracking-widest">
              Rotate Keys
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 group hover:border-coral/20 transition-all shadow-inner">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                <Key className="w-4 h-4 text-zinc-400" /> Two-Factor Hardware Auth
              </h3>
              <p className="text-sm text-zinc-500 font-light">Inject an extra layer of biometric security to your workspace.</p>
            </div>
            <button className="px-6 py-3 rounded-full bg-coral text-white hover:bg-coral-hover transition-all text-xs font-black uppercase tracking-widest shadow-[0_4px_10px_rgba(252,93,93,0.2)]">
              Enable 2FA
            </button>
          </div>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#111318] border border-red-500/20 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
      >
        <h2 className="text-xl font-bold font-space mb-2 text-red-500 uppercase tracking-tight">System Termination</h2>
        <p className="text-zinc-500 text-sm mb-10 font-light italic">Irreversible and destructive actions. Proceed with total caution.</p>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/10 transition-all">
          <div>
            <h3 className="font-bold text-red-600 dark:text-red-500 mb-2">Purge Workspace</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-600 max-w-sm">Permanently delete your account, encrypted keys, and all active agent containers.</p>
          </div>
          <button className="px-8 py-4 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all text-xs font-black uppercase tracking-widest">
            Execute Termination
          </button>
        </div>
      </motion.section>
    </div>
  );
}
