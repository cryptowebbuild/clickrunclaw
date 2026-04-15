'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Mail, Lock, Github, Chrome, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
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
          // If email confirmation is disabled, they are logged in immediately
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
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-purple-500/30">
      
      {/* Left Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative z-10">
        
        {/* Mobile Ambient Glows */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
        </div>

        <Link href="/" className="flex items-center gap-2 font-bold text-2xl font-space mb-12 w-fit hover:opacity-80 transition-opacity">
          <TerminalSquare className="w-8 h-8 text-purple-500" />
          <span>ClickRunClaw</span>
        </Link>

        <div className="max-w-md w-full">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-bold font-space mb-3 tracking-tight">
              {authMode === 'login' && 'Welcome back'}
              {authMode === 'signup' && 'Create your account'}
              {authMode === 'magic' && 'Magic Link Login'}
            </h1>
            <p className="text-zinc-400 mb-8 text-lg">
              {authMode === 'login' && 'Enter your details to access your dashboard.'}
              {authMode === 'signup' && 'Start deploying OpenClaw agents in seconds.'}
              {authMode === 'magic' && "We'll send a secure magic link to your email."}
            </p>
          </motion.div>

          {/* Auth Mode Toggle */}
          {authMode !== 'magic' && (
            <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
              >
                <div className="mt-0.5 font-bold">!</div>
                <div>{error}</div>
              </motion.div>
            )}
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>{successMsg}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
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
                  className="w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            {authMode !== 'magic' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-zinc-300">Password</label>
                  {authMode === 'login' && (
                    <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium">Forgot password?</Link>
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
                    className="w-full pl-11 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white placeholder:text-zinc-600"
                  />
                </div>
                
                {/* Password Strength Indicator (Only on Signup) */}
                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-colors duration-300 ${
                            passwordStrength >= level 
                              ? passwordStrength < 2 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 text-right font-medium">
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
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'signup' && 'Create Account'}
                  {authMode === 'magic' && 'Send Magic Link'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                Sign in with Magic Link
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-zinc-400" />
                Sign in with Password
              </button>
            )}
          </div>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleOAuth('github')}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
            <button 
              onClick={() => handleOAuth('google')}
              className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Premium Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden border-l border-white/10">
        
        {/* Deep Cosmic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#050505] to-[#050505]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '5s' }} />

        <div className="relative z-10 max-w-lg p-8 w-full">
          
          {/* Floating Terminal Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(124,58,237,0.15)] mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-50" />
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50 border border-green-500/50" />
            </div>
            <div className="font-mono text-sm space-y-4">
              <p className="text-purple-400 flex items-center gap-2">
                <span className="text-zinc-500">➜</span> 
                <span>~ clickrunclaw deploy --agent openclaw-alpha</span>
              </p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-zinc-400">
                [INFO] Provisioning Enterprise Pod...
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-zinc-400">
                [INFO] Securing isolated environment...
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="text-green-400 flex items-center gap-2">
                [SUCCESS] Agent deployed in 0.8s. Ready.
              </motion.p>
            </div>
          </motion.div>

          {/* Testimonial / Social Proof */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-space font-bold leading-tight text-white">
              "The fastest deployment platform I've ever used. It feels like magic."
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-white/10">
                JD
              </div>
              <div>
                <p className="font-bold text-white">John Doe</p>
                <p className="text-zinc-400 text-sm">Lead AI Engineer at TechFlow</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
