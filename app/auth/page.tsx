'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Mail, Lock, Github, Chrome, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type AuthMode = 'login' | 'signup';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  
  // High-conversion default state
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Intent passthrough for seamless Post-Auth actions
  const intent = searchParams.get('intent');
  const plan = searchParams.get('plan');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (intent === 'checkout' && plan) {
           window.location.href = `https://whop.com/checkout/${plan}?custom_user_id=${session.user.id}&email=${encodeURIComponent(session.user.email || '')}`;
        } else {
           window.location.href = '/dashboard';
        }
      }
    };
    checkUser();
  }, [supabase.auth, intent, plan]);

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      setError(null);
      
      const redirectTo = new URL(`${window.location.origin}/auth/callback`);
      if (intent === 'checkout' && plan) {
         redirectTo.searchParams.set('checkout_plan', plan); 
      } else {
         redirectTo.searchParams.set('next', '/dashboard');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo.toString(),
          queryParams: { prompt: 'select_account' }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `An error occurred with ${provider} login.`);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) throw error;
        
        if (!data.session) {
          setSuccessMsg('Magic! Account provisioning. Check your email to confirm activation.');
          setLoading(false);
          return;
        }
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session && intent === 'checkout' && plan) {
          window.location.href = `https://whop.com/checkout/${plan}?custom_user_id=${session.user.id}&email=${encodeURIComponent(session.user.email || '')}`;
      } else {
          window.location.href = '/dashboard';
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
      setLoading(false);
    } 
  };

  return (
    <div className="max-w-[400px] w-full mx-auto mt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold font-space mb-3 tracking-tight text-zinc-900 dark:text-white">
          {authMode === 'login' ? 'Welcome back' : 'Get Started'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-base">
          {authMode === 'login' 
            ? 'Sign in to manage your AI agents.' 
            : 'Join top developers launching agents instantly.'}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }} 
            animate={{ opacity: 1, height: 'auto', y: 0 }} 
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3 backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="font-semibold">{error}</div>
          </motion.div>
        )}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }} 
            animate={{ opacity: 1, height: 'auto', y: 0 }} 
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mb-8 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-start gap-3 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="font-semibold">{successMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <button 
          onClick={() => handleOAuth('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold text-zinc-900 dark:text-white group hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-50"
        >
          <Chrome className="w-5 h-5 text-zinc-700 dark:text-zinc-300 group-hover:scale-110 transition-transform" />
          Continue with Google
        </button>
        <button 
          onClick={() => handleOAuth('github')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all font-bold group disabled:opacity-50 border border-zinc-900 dark:border-white"
        >
          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Continue with GitHub
        </button>
      </div>

      <div className="relative flex items-center py-6">
        <div className="flex-grow border-t border-zinc-200 dark:border-white/10"></div>
        <span className="flex-shrink-0 mx-4 text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-widest">Or continue with text</span>
        <div className="flex-grow border-t border-zinc-200 dark:border-white/10"></div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Base</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
            </div>
            <input 
              type="email" 
              required
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com" 
              className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Password</label>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
            </div>
            <input 
              type="password" 
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full pl-11 pr-4 py-4 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:bg-white dark:focus:bg-zinc-900 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {authMode === 'login' ? 'Sign In Securely' : 'Create Free Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        {authMode === 'login' ? (
          <p className="text-zinc-500 font-medium text-sm">
            Don&apos;t have an account?{' '}
            <button onClick={() => setAuthMode('signup')} className="font-bold text-coral hover:text-coral-hover transition-colors">Sign up</button>
          </p>
        ) : (
          <p className="text-zinc-500 font-medium text-sm">
            Already registered?{' '}
            <button onClick={() => setAuthMode('login')} className="font-bold text-coral hover:text-coral-hover transition-colors">Sign in</button>
          </p>
        )}
      </div>
      
      <p className="text-center text-xs text-zinc-600 mt-8 font-medium">
        By continuing, you agree to our <Link href="/privacy" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline decoration-transparent hover:decoration-zinc-400 transition-all underline-offset-4">Terms of Service</Link> & <Link href="/privacy" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline decoration-transparent hover:decoration-zinc-400 transition-all underline-offset-4">Privacy</Link>.
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 flex overflow-hidden selection:bg-coral/30 selection:text-white font-sans">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-dots opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      {/* Left Side - Form Area */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 relative z-10 bg-white dark:bg-[#090A0F] border-r border-zinc-200 dark:border-white/5 shadow-xl">
        
        <Link href="/" className="absolute top-10 left-6 sm:left-12 lg:left-16 flex items-center gap-2 font-bold text-xl font-space text-zinc-900 dark:text-white group">
          <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,90,95,0.3)] group-hover:scale-110 transition-transform">
            <TerminalSquare className="w-4 h-4" />
          </div>
          <span className="tracking-tighter">ClickRunClaw</span>
        </Link>

        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-coral" /></div>}>
           <AuthContent />
        </Suspense>
      </div>

      {/* Right Side - Premium Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-zinc-50 dark:bg-[#090A0F] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-[#090A0F]" />
        <div className="relative z-10 max-w-xl p-12 w-full">
          {/* Floating Glassmorphic Pattern */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 relative"
          >
            <div className="absolute -inset-1 bg-zinc-200 dark:bg-zinc-800 rounded-2xl blur-sm opacity-50" />
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="ml-4 font-mono text-[10px] text-zinc-400 dark:text-zinc-600 font-black tracking-[0.2em] flex items-center justify-between w-full uppercase">
                  <span>Connection_Secure</span>
                  <span className="px-4 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 text-coral border border-coral/20 font-black">2FA_READY</span>
                </div>
              </div>
              <div className="font-mono text-xs space-y-6">
                <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
                  <span className="text-coral font-black">❯</span> 
                  <span className="text-zinc-800 dark:text-zinc-400">clickrunclaw --auth login --provider oauth</span>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pl-5 border-l border-zinc-100 dark:border-zinc-900 space-y-4">
                  <p className="text-zinc-400 dark:text-zinc-600 flex items-center gap-3">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Environment validated...
                  </p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-zinc-400 dark:text-zinc-600 flex items-center gap-3">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Keys injected successfully.
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 pl-4 border-l border-white/10"
          >
            <h3 className="text-2xl font-space font-bold leading-tight text-zinc-900 dark:text-white">
              &quot;The deployment speed is unmatched. It feels like we skipped DevOps entirely.&quot;
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center font-bold text-lg text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <svg className="w-6 h-6 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white tracking-wide">Alex Chen</p>
                <p className="text-zinc-500 text-sm font-medium">CTO at Nexus AI</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
