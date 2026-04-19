'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Server, ShieldCheck, Loader2, XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  
  // Paywall & Profile State
  const [profile, setProfile] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Agent Deployment State
  const [agentName, setAgentName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployedAgent, setDeployedAgent] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        const { data: profData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        // If table doesn't exist yet, fallback to 'free'
        setProfile(profData && !error ? profData : { plan_tier: 'free' });
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  const handleUpgrade = (plan: string) => {
    const link = plan === 'Pro' 
      ? 'https://whop.com/clickrunclaws/clickrun-procore/'
      : 'https://whop.com/clickrunclaws/clickrunclaw-starter-node/';
    window.open(link, '_blank');
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // PAYWALL VERIFICATION (Frontend Block)
    if (!profile || profile.plan_tier === 'free') {
      setShowUpgradeModal(true);
      return;
    }

    setDeploying(true);
    setToast("Initializing secure container deployment...");

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, provider, apiKey, telegramToken })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === 'PAYWALL') {
           setShowUpgradeModal(true);
           throw new Error(data.message);
        }
        throw new Error(data.error || 'Deployment failed');
      }

      setDeployedAgent(data.agent);
      setToast("✨ Agent Deployed Successfully!");
      setAgentName('');
      setApiKey('');
    } catch (err: any) {
      setToast(err.message || 'Deployment error');
    } finally {
      setDeploying(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-coral animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative text-zinc-900 dark:text-zinc-100">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-[#0D1117] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
            <span className="font-medium text-sm">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Section: Welcome */}
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold font-space mb-2 text-zinc-900 dark:text-white"
        >
          Welcome back, <span className="text-zinc-500 dark:text-zinc-400">{user?.email?.split('@')[0] || 'Builder'}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg flex items-center gap-2"
        >
          Current Plan: 
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            profile?.plan_tier !== 'free' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
          }`}>
            {profile?.plan_tier || 'Free'} Tier
          </span>
        </motion.p>
      </div>

      {/* Deployment Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-5xl mx-auto mb-16 bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm"
      >
        <h2 className="text-xl font-bold font-space mb-6 flex items-center gap-2 text-zinc-900 dark:text-white">
          <Zap className="w-5 h-5 text-coral" /> Let&apos;s Deploy a ClickRunClaw Agent
        </h2>
        
        <form onSubmit={handleDeploy} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Agent Name</label>
              <input 
                type="text" 
                required
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. SalesBot-Alpha" 
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-full focus:border-coral transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400">LLM Provider</label>
              <select 
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-full focus:border-coral transition-all text-zinc-900 dark:text-white outline-none"
              >
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="deepseek">DeepSeek (V3)</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400">API Key (Encrypted securely)</label>
              <input 
                type="password" 
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..." 
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full focus:border-coral transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Telegram Bot Token (Optional)</label>
                <span className="text-[10px] border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">Auto-Pairing</span>
              </div>
              <input 
                type="password" 
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="1234567890:AAH..." 
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full focus:border-coral transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-500 px-4">Provide this to enable 1-click Telegram pairing. Get from @BotFather.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={deploying}
            className="w-full md:w-auto min-h-[56px] px-10 bg-coral hover:bg-coral-hover text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {deploying && <Loader2 className="w-5 h-5 animate-spin" />}
            {deploying ? 'Allocating Container...' : 'Deploy Agent Instantly'}
          </button>
        </form>

        {deployedAgent && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 p-8 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl"
          >
            <h3 className="text-green-600 dark:text-green-500 font-bold mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" /> Active Webhook Established
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Paste this URL into Telegram or Discord to link your agent.</p>
            <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl font-mono text-sm text-zinc-800 dark:text-zinc-200 break-all border border-zinc-200 dark:border-zinc-800 shadow-inner">
              {deployedAgent.webhookUrl}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
               <span className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">Container Ready</span>
               <div className="h-1 flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-full" />
               </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Middle Section: PLG Paywall (Pricing Pods) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Starter Pod */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-3xl p-8 flex flex-col relative transition-all shadow-sm group hover:shadow-xl"
        >
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2 font-space text-zinc-900 dark:text-white">
              Starter Pod
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 h-12">Perfect for testing and small personal projects.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">$9</span>
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
              className="flex items-center justify-center w-full h-12 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg"
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
          className="bg-white dark:bg-[#111318] border border-coral/30 dark:border-coral/20 rounded-[2.5rem] p-10 flex flex-col relative transition-all shadow-xl"
        >
          <div className="absolute top-0 right-8 -translate-y-1/2 z-20">
            <span className="bg-coral text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_4px_10px_rgba(255,90,95,0.3)]">
              Most Popular
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 font-space text-zinc-900 dark:text-white">
              Pro Pod
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 h-12 text-sm leading-relaxed">For serious builders and production deployments.</p>
            <div className="flex items-baseline gap-1 mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-8">
              <span className="text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">$29</span>
              <span className="text-base text-zinc-500 font-medium">/month</span>
            </div>
            <ul className="flex flex-col gap-5 mb-10">
              {[
                '5 Active Agent Containers',
                'Instant Warm-Pool Boots (<1s)',
                'All Premium Plugins & Integrations',
                'Advanced Analytics & Logs',
                'Custom Domains',
                'White-label Webhooks'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
                  </div>
                  <span className="text-zinc-200 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto relative z-10">
            <button 
              onClick={() => handleUpgrade('Pro')}
              className="flex items-center justify-center w-full h-14 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all text-base shadow-[0_4px_15px_rgba(252,93,93,0.25)] hover:scale-[1.02]"
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
        <span>Secure payments powered by Whop. Cancel anytime.</span>
      </motion.div>

      {/* Cosmic Dark Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors z-20"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="relative z-10 text-center">
                <div className="mx-auto w-16 h-16 bg-coral/10 border border-coral/20 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                  <Zap className="w-8 h-8 text-coral animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold font-space text-zinc-900 dark:text-white mb-2 tracking-tighter">Active Plan Required</h3>
                <p className="text-base text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
                  You are currently on the Free Tier. Deploying cloud agents requires a premium container slot.
                </p>

                <div className="space-y-4">
                  <a 
                    href="https://whop.com/clickrunclaws/clickrunclaw-starter-node/" 
                    target="_blank" rel="noreferrer"
                    className="block w-full py-5 px-8 bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-full text-zinc-900 dark:text-white font-bold transition-all flex items-center justify-between group shadow-sm"
                  >
                    <span className="flex items-center gap-3 text-base"><Server className="w-5 h-5 text-coral/60" /> Starter Pod ($9/mo)</span>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-white px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 uppercase tracking-widest font-black group-hover:bg-zinc-900 dark:group-hover:bg-coral transition-all">Select</span>
                  </a>
                  
                  <a 
                    href="https://whop.com/clickrunclaws/clickrun-procore/" 
                    target="_blank" rel="noreferrer"
                    className="block w-full py-5 px-8 bg-coral hover:bg-coral-hover rounded-full text-white font-bold transition-all flex items-center justify-between group shadow-[0_4px_25px_rgba(255,90,95,0.4)]"
                  >
                    <span className="flex items-center gap-3 text-base"><Zap className="w-5 h-5 text-white" /> Pro Pod ($29/mo)</span>
                    <span className="text-[10px] bg-white text-coral px-4 py-1.5 rounded-full uppercase tracking-widest font-black shadow-lg">Best Value</span>
                  </a>
                </div>
                
                <p className="text-xs text-zinc-500 flex items-center justify-center gap-1 mt-6">
                  <ShieldCheck className="w-3 h-3" /> Secure checkout by Whop.com
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
