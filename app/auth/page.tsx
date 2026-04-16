'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Mail, Lock, Github, Chrome, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type AuthMode = 'login' | 'signup' | 'magic';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = '/dashboard';
      }
    };
    checkUser();
  }, [supabase.auth]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 7) score += 1;
    if (pass.match(/[A-Z]/)) score += 1;
    if (pass.match(/[0-9]/)) score += 1;
    if (pass.match(/[^A-Za-z0-9]/)) score += 1;
    return score; // 0 to 4
  };
  
  const passwordStrength = getPasswordStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
        window.location.href = '/dashboard';
      } else if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        
        if (data.session) {
          window.location.href = '/dashboard';
        } else {
          setSuccessMsg('Success! Check your email to confirm your account.');
        }
      } else if (authMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSuccessMsg('Magic link sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `An error occurred with ${provider} login.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex overflow-hidden selection:bg-purple-500/30 font-sans">
      
      {/* Background Grid & Glows (Global) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Left Side - Form Area */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 relative z-10 bg-[#000000]/80 backdrop-blur-3xl border-r border-white/[0.05] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        
        <Link href="/" className="absolute top-8 left-6 sm:left-12 lg:left-16 flex items-center gap-2 font-bold text-xl font-space group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <TerminalSquare className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">ClickRun<span className="text-purple-400">Claw</span></span>
        </Link>

        <div className="max-w-[400px] w-full mx-auto mt-16">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold font-space mb-3 tracking-tight text-white">
              {authMode === 'login' && 'Welcome back'}
              {authMode === 'signup' && 'Create account'}
              {authMode === 'magic' && 'Magic Link'}
            </h1>
            <p className="text-zinc-400 mb-8 text-base">
              {authMode === 'login' && 'Enter your credentials to access your workspace.'}
              {authMode === 'signup' && 'Start deploying AI agents in seconds.'}
              {authMode === 'magic' && "We'll email you a secure, passwordless link."}
            </p>
          </motion.div>

          {/* Auth Mode Toggle */}
          {authMode !== 'magic' && (
            <div className="flex gap-1 mb-8 p-1 bg-zinc-900/50 rounded-xl border border-white/[0.05] backdrop-blur-md">
              <button 
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${authMode === 'signup' ? 'bg-white/10 text-white shadow-sm border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3 backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="font-medium">{error}</div>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }} 
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-3 backdrop-blur-md"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="font-medium">{successMsg}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-zinc-600 font-medium"
                />
              </div>
            </div>

            {authMode !== 'magic' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                  {authMode === 'login' && (
                    <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold">Forgot?</Link>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 border border-white/[0.08] rounded-xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-zinc-600 font-medium"
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            passwordStrength >= level 
                              ? passwordStrength < 2 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                              : passwordStrength < 4 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                              : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                              : 'bg-white/5'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 text-right font-semibold">
                      {passwordStrength === 1 && 'Weak'}
                      {passwordStrength === 2 && 'Fair'}
                      {passwordStrength === 3 && 'Good'}
                      {passwordStrength >= 4 && 'Strong'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-black" />
              ) : (
                <>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'signup' && 'Create Account'}
                  {authMode === 'magic' && 'Send Magic Link'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Magic Link Toggle */}
          <div className="mt-4">
            {authMode !== 'magic' ? (
              <button 
                type="button"
                onClick={() => { setAuthMode('magic'); setError(null); setSuccessMsg(null); }}
                className="w-full py-3.5 rounded-xl bg-transparent border border-white/[0.08] text-zinc-300 font-semibold hover:bg-white/[0.02] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Sign in with Magic Link
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className="w-full py-3.5 rounded-xl bg-transparent border border-white/[0.08] text-zinc-300 font-semibold hover:bg-white/[0.02] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-zinc-400" />
                Sign in with Password
              </button>
            )}
          </div>

          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-white/[0.08]"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs font-bold uppercase tracking-widest">Or continue with</span>
            <div className="flex-grow border-t border-white/[0.08]"></div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleOAuth('github')}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all font-semibold text-zinc-300 hover:text-white group"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
              GitHub
            </button>
            <button 
              onClick={() => handleOAuth('google')}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all font-semibold text-zinc-300 hover:text-white group"
            >
              <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Google
            </button>
          </div>
          
          <p className="text-center text-xs text-zinc-600 mt-8 font-medium">
            By continuing, you agree to our <Link href="/terms" className="text-zinc-400 hover:text-white underline decoration-white/20 underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-400 hover:text-white underline decoration-white/20 underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Side - Premium Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-[#000000] relative items-center justify-center overflow-hidden">
        
        {/* Immersive Cosmic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#000000] to-[#000000]" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen" 
        />

        <div className="relative z-10 max-w-xl p-12 w-full">
          
          {/* Floating Glassmorphic Terminal/Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-8 shadow-[0_0_80px_rgba(124,58,237,0.15)] mb-12 relative overflow-hidden transform-gpu"
            style={{ perspective: '1000px' }}
          >
            {/* Glossy Reflection */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
            
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider">
                PRODUCTION
              </div>
            </div>

            <div className="font-mono text-sm space-y-5">
              <div className="flex items-center gap-3 text-zinc-400">
                <span className="text-purple-500 font-bold">❯</span> 
                <span className="text-white">clickrunclaw init --agent openclaw</span>
              </div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pl-5 border-l-2 border-white/10 space-y-3">
                <p className="text-zinc-500 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Provisioning isolated pod...
                </p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-zinc-500 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Injecting encrypted keys...
                </motion.p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 2, type: "spring" }} 
                className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="font-bold">Agent Deployed Successfully</p>
                  <p className="text-xs text-green-500/70 mt-0.5">Latency: 0.8s • Uptime: 100%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Premium Social Proof */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 pl-4 border-l border-white/10"
          >
            <h3 className="text-2xl font-space font-bold leading-tight text-white">
              "The deployment speed is unmatched. It feels like we skipped DevOps entirely."
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center font-bold text-lg text-white border border-white/10">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <p className="font-bold text-white tracking-wide">Alex Chen</p>
                <p className="text-zinc-500 text-sm font-medium">CTO at Nexus AI</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
