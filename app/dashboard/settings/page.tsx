'use client';

import { motion } from 'motion/react';
import { User, Mail, Lock, Shield, Bell, Key } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-space mb-2">Settings</h1>
        <p className="text-zinc-400">Manage your account preferences and security.</p>
      </div>

      {/* Profile Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold font-space mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-400" />
          Profile Information
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-3xl shadow-[0_0_20px_rgba(124,58,237,0.4)] shrink-0">
            JD
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  disabled
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors font-medium text-sm text-white">
              Save Changes
            </button>
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold font-space mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Security
        </h2>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
            <div>
              <h3 className="font-medium text-white mb-1">Password</h3>
              <p className="text-sm text-zinc-400">Last changed 3 months ago</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
              Change Password
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
            <div>
              <h3 className="font-medium text-white mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-zinc-400">Add an extra layer of security to your account.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition-colors text-sm font-medium">
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
        className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 md:p-8 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold font-space mb-2 text-red-400">Danger Zone</h2>
        <p className="text-zinc-400 text-sm mb-6">Irreversible and destructive actions.</p>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-white mb-1">Delete Account</h3>
            <p className="text-sm text-zinc-500">Permanently delete your account and all agents.</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors text-sm font-medium">
            Delete Account
          </button>
        </div>
      </motion.section>
    </div>
  );
}
