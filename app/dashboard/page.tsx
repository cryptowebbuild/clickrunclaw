'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Server, ShieldCheck, Loader2, XIcon, User, ArrowRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  
  // Paywall & Profile State
  const [profile, setProfile] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [syncingPlan, setSyncingPlan] = useState(false);
  const [showPlanSyncButton, setShowPlanSyncButton] = useState(false);

  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingName, setOnboardingName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Agent Deployment State
  const [agentName, setAgentName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployedAgent, setDeployedAgent] = useState<any>(null);

  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.auth.getUser();
      let currentProfile = { plan_tier: 'free', full_name: '' };
      if (data.user) {
        setUser(data.user);
        const { data: profData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profData && !error) {
           currentProfile = profData;
        }

        setProfile(currentProfile);

        // Trigger Onboarding if no name is set
        if (!currentProfile.full_name) {
          setShowOnboarding(true);
        }
      }
      setLoading(false);

      const checkoutStatus = searchParams.get('checkout_status') || searchParams.get('status');
      const receiptId = searchParams.get('receipt_id') || searchParams.get('payment_id');
      if (checkoutStatus === 'success') {
        setShowPlanSyncButton(true);
        setToast(receiptId ? `Checkout success received (${receiptId}). Syncing your plan...` : 'Checkout success received. Syncing your plan...');
        if (data.user?.id) {
          setTimeout(async () => {
            const { data: refreshedProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (refreshedProfile) {
              setProfile(refreshedProfile);
              if ((refreshedProfile.plan_tier || 'free') !== 'free') {
                setToast('Plan activated successfully. You can deploy now.');
                setShowPlanSyncButton(false);
              } else {
                setToast('Checkout succeeded, but your plan is still syncing. Use Refresh Plan from Whop below.');
              }
            }

            router.replace('/dashboard');
          }, 1500);
        }
      }

      // Check for pending onboarding deployment
      try {
        const pendingDeployStr = localStorage.getItem('CR_PENDING_DEPLOY');
        if (pendingDeployStr && currentProfile.full_name) { // only trigger if onboarding is not blocking
          const pending = JSON.parse(pendingDeployStr);
          setAgentName(pending.name || '');
          setProvider(pending.provider || 'openai');
          setApiKey(pending.apiKey || '');
          localStorage.removeItem('CR_PENDING_DEPLOY');
          
          setTimeout(() => {
            if (currentProfile.plan_tier === 'free') {
              setShowUpgradeModal(true);
              setToast("Setup complete! Activate a node to deploy.");
            }
          }, 500);
        }
      } catch(e) {
        console.warn('Storage access failed:', e);
      }
    };
    fetchUser();
  }, [router, searchParams, supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !onboardingName.trim()) return;
    
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: onboardingName,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      if (error) throw error;

      setProfile({ ...profile, full_name: onboardingName });
      setShowOnboarding(false);
      setToast("Profile configured successfully!");
    } catch (err: any) {
      setToast(err.message || 'Error saving profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpgrade = (plan: string) => {
    const link = plan === 'Pro' 
      ? `https://whop.com/checkout/plan_Bhg70HYNZqmJV?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`
      : `https://whop.com/checkout/plan_T8nSbRxGGTlly?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`;
    window.location.href = link;
  };

  const handleSyncPlan = async () => {
    if (!supabase || !user?.id || !user?.email) return;

    setSyncingPlan(true);
    setToast('Checking Whop membership and syncing your plan...');

    try {
      const res = await fetch('/api/sync-whop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          custom_user_id: user.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.reason || 'Plan sync failed');
      }

      if (data.synced) {
        const { data: refreshedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (refreshedProfile) {
          setProfile(refreshedProfile);
        }

        setToast(`Plan synced successfully: ${data.plan_tier}`);
        setShowPlanSyncButton(false);
      } else {
        setToast(data.hint || data.error || data.reason || 'No active Whop membership found yet.');
      }
    } catch (err: any) {
      setToast(err.message || 'Plan sync failed');
    } finally {
      setSyncingPlan(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // PAYWALL VERIFICATION (Frontend Block)
    if (!profile || profile.plan_tier === 'free') {
      setShowUpgradeModal(true);
      return;
    }

    setDeploying(true);
    setToast('Submitting deployment request...');

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, provider, apiKey, telegramToken })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === 'PAYWALL' || data.error === 'PAYWALL_MAX') {
           if (data.error === 'PAYWALL') setShowUpgradeModal(true);
           throw new Error(data.message);
        }
        throw new Error(data.message || data.error || 'Deployment failed');
      }

      setDeployedAgent(data.agent);
      setToast(data.message || 'Deployment request accepted.');
      setAgentName('');
      setApiKey('');
      setTelegramToken('');
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
          Welcome back, <span className="text-zinc-500 dark:text-zinc-400 capitalize">{profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Builder'}</span>
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
        id="deploy-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="max-w-5xl mx-auto mb-16 bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm"
      >
        {showPlanSyncButton && profile?.plan_tier === 'free' && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-500/20 dark:bg-amber-500/10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">Payment detected, plan not synced yet</p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">If you just completed checkout, press this once to pull your active plan from Whop instantly.</p>
              </div>
              <button
                onClick={handleSyncPlan}
                disabled={syncingPlan}
                className="rounded-full bg-amber-500 px-5 py-3 text-sm font-black text-white transition-all hover:bg-amber-600 disabled:opacity-60"
              >
                {syncingPlan ? 'Syncing plan...' : 'Refresh Plan from Whop'}
              </button>
            </div>
          </div>
        )}
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
                placeholder="e.g. SalesBot-Alpha, Support-Agent, Web3-Analyst" 
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
                <option value="gemini">Google Gemini</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-500 dark:text-zinc-400">API Key</label>
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
                <span className="text-[10px] border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">Manual setup</span>
              </div>
              <input 
                type="password" 
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="1234567890:AAH..." 
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full focus:border-coral transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-500 px-4">Add a BotFather token if you want it stored with this agent for later manual setup. Automatic Telegram pairing is not live yet.</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={deploying}
            className="w-full md:w-auto min-h-[56px] px-10 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {deploying && <Loader2 className="w-5 h-5 animate-spin" />}
            {deploying ? 'Starting deployment...' : 'Deploy Agent'}
          </button>
        </form>

        {deployedAgent && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 p-8 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl"
          >
            <h3 className="text-green-600 dark:text-green-500 font-bold mb-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6" /> Deployment record created
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Your agent was accepted for deployment. If a webhook URL was generated, you can use it below.</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6">Current status: {deployedAgent.status || 'deploying'}</p>
            <div className="bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl font-mono text-sm text-zinc-800 dark:text-zinc-200 break-all border border-zinc-200 dark:border-zinc-800 shadow-inner">
              {deployedAgent.webhookUrl}
            </div>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
               <span className="text-xs font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">Deployment Submitted</span>
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
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-xl text-zinc-400 dark:text-zinc-600 line-through font-medium">$12.49</span>
                <span className="text-[10px] sm:text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">$9.99</span>
                <span className="text-xl text-zinc-500 font-medium">/month</span>
              </div>
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
            <div className="flex flex-col gap-2 mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-8">
              <div className="flex items-center gap-3">
                <span className="text-xl text-zinc-400 dark:text-zinc-600 line-through font-medium">$49.98</span>
                <span className="text-[10px] sm:text-xs font-bold bg-coral text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_2px_10px_rgba(255,90,95,0.4)]">Save 40%</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">$29.99</span>
                <span className="text-base text-zinc-500 font-medium">/month</span>
              </div>
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

      {/* Post-Signup Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
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
              className="relative w-full max-w-md bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mb-6">
                  <User className="w-6 h-6 text-coral" />
                </div>
                <h3 className="text-2xl font-bold font-space text-zinc-900 dark:text-white mb-2">Complete your profile</h3>
                <p className="text-sm text-zinc-500 mb-8">
                  Welcome aboard! Let&apos;s personalize your workspace before deploying your first agent.
                </p>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Full Name</label>
                     <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <User className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
                       </div>
                       <input 
                         type="text" 
                         required
                         value={onboardingName}
                         onChange={(e) => setOnboardingName(e.target.value)}
                         placeholder="John Doe" 
                         className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-500 font-medium"
                       />
                     </div>
                  </div>


                  <button 
                    type="submit" 
                    disabled={savingProfile || !onboardingName.trim()}
                    className="w-full py-4 mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
                    {!savingProfile && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <p className="text-base text-zinc-500 mb-6 max-w-sm mx-auto leading-relaxed">
                  You are currently on the Free Tier. Deploying cloud agents requires a premium container slot.
                </p>

                <button
                  onClick={handleSyncPlan}
                  disabled={syncingPlan}
                  className="w-full mb-4 py-4 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all disabled:opacity-60"
                >
                  {syncingPlan ? 'Syncing plan...' : 'Refresh Plan from Whop'}
                </button>

                <div className="space-y-4">
                  <a 
                    href={`https://whop.com/checkout/plan_T8nSbRxGGTlly?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`}
                    onClick={(e) => e.preventDefault()}
                    onMouseUp={() => window.location.href = `https://whop.com/checkout/plan_T8nSbRxGGTlly?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`}
                    className="block w-full py-5 px-8 bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-full text-zinc-900 dark:text-white font-bold transition-all flex items-center justify-between group shadow-sm cursor-pointer"
                  >
                    <span className="flex items-center gap-3 text-base"><Server className="w-5 h-5 text-coral/60" /> Starter Pod ($9.99/mo)</span>
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-white px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 uppercase tracking-widest font-black group-hover:bg-zinc-900 dark:group-hover:bg-coral transition-all">Select</span>
                  </a>
                  
                  <a 
                    href={`https://whop.com/checkout/plan_Bhg70HYNZqmJV?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`}
                    onClick={(e) => e.preventDefault()}
                    onMouseUp={() => window.location.href = `https://whop.com/checkout/plan_Bhg70HYNZqmJV?custom_user_id=${user?.id}&email=${encodeURIComponent(user?.email || '')}`}
                    className="block w-full py-5 px-8 bg-coral hover:bg-coral-hover rounded-full text-white font-bold transition-all flex items-center justify-between group shadow-[0_4px_25px_rgba(255,90,95,0.4)] cursor-pointer"
                  >
                    <span className="flex items-center gap-3 text-base"><Zap className="w-5 h-5 text-white" /> Pro Pod ($29.99/mo)</span>
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
