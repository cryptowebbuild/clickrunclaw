'use client';

import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Key, Loader2, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profData);
        setFullName(profData?.full_name || user.email?.split('@')[0] || '');
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  const handleSave = async () => {
    if (!user?.id || !fullName.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() })
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) setProfile(data);
      setToast('Profile saved successfully.');
    } catch (err: any) {
      setToast(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-coral animate-spin" /></div>;
  }

  return (
    <div className="space-y-10 max-w-4xl pb-20 relative">
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-50 bg-black text-white px-6 py-4 rounded-full text-sm font-bold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-zinc-800"
        >
          <Sparkles className="w-4 h-4 text-coral" />
          {toast}
        </motion.div>
      )}

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
          <div className="w-24 h-24 rounded-3xl bg-zinc-100 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 flex items-center justify-center text-zinc-900 dark:text-white font-black text-3xl shrink-0 shadow-inner uppercase overflow-hidden">
            {profile?.full_name ? profile.full_name.charAt(0) : user?.email?.charAt(0) ? user.email.charAt(0) : <User className="w-10 h-10 text-zinc-700" />}
          </div>
          
          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-4">Full Identity</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/5 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 ml-4">Encrypted Email</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''}
                  disabled
                  className="w-full px-6 py-4 bg-zinc-100 dark:bg-black/20 opacity-50 border border-zinc-200 dark:border-white/5 rounded-full text-zinc-500 dark:text-zinc-700 cursor-not-allowed font-medium"
                />
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-4 w-full md:w-auto rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100 min-w-[220px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Save Configuration'}
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
              <p className="text-sm text-zinc-500 font-light">Last rotation cycle: Managed via provider</p>
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
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 transition-all text-xs font-black uppercase tracking-widest shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
              Enable 2FA
            </button>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
