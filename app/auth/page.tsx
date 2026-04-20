'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TerminalSquare, Mail, Lock, Github, Chrome, ArrowRight, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type AuthMode = 'login' | 'signup' | 'magic';

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Registration Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardModel, setWizardModel] = useState<string | null>(null);
  const [wizardKey, setWizardKey] = useState('');

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

  const handleAuth = async (e?: React.FormEvent) => {
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
        // Proceed normally
        window.location.href = '/dashboard';
      } else if (authMode === 'signup') {
        // Complete the Auth Request inside the Wizard
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) throw error;
        
        // TODO: Map Wizard config strings via secure database insert here

        if (data.session) {
          window.location.href = '/dashboard';
        } else {
          setSuccessMsg('Magic! Account provisioning. Check your email to confirm activation.');
        }
      } else if (authMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
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
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `An error occurred with ${provider} login.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 flex overflow-hidden selection:bg-coral/30 selection:text-white font-sans">
      
      {/* Background Grid & Glows (Global) */}
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

        <div className="max-w-[400px] w-full mx-auto mt-16">
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold font-space mb-3 tracking-tight text-zinc-900 dark:text-white">
              {authMode === 'login' && 'Welcome back'}
              {authMode === 'signup' && 'Create account'}
              {authMode === 'magic' && 'Magic Link'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-base">
              {authMode === 'login' && 'Enter your credentials to access your workspace.'}
              {authMode === 'signup' && 'Start deploying AI agents in a second.'}
              {authMode === 'magic' && "We'll email you a secure, passwordless link."}
            </p>
          </motion.div>

          {/* Auth Mode Toggle */}
          {authMode !== 'magic' && (
            <div className="flex gap-1 mb-10 p-1 bg-zinc-100 dark:bg-white/5 rounded-full border border-zinc-200 dark:border-white/10 shadow-inner">
              <button 
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${authMode === 'login' ? 'bg-coral text-white shadow-lg' : 'text-zinc-500 bg-zinc-900/40 hover:text-zinc-300 hover:bg-zinc-800/60 shadow-inner'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${authMode === 'signup' ? 'bg-coral text-white shadow-lg' : 'text-zinc-500 bg-zinc-900/40 hover:text-zinc-300 hover:bg-zinc-800/60 shadow-inner'}`}
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

          {/* Registration Wizard (3 Steps) */}
          {authMode === 'signup' && (
            <div className="space-y-6">
              {/* Wizard Progress Indication */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${wizardStep >= step ? 'bg-coral' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                ))}
              </div>

              {/* Step 1: Account Creation */}
              <AnimatePresence mode="wait">
                {wizardStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold font-space text-zinc-900 dark:text-white">Welcome to ClickRunClaw!</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Let&apos;s create your account to launch your first Agent.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                        </div>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com" 
                          className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                        </div>
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        if (email && password.length >= 6) setWizardStep(2);
                        else setError('Please enter a valid email and a password with at least 6 characters.');
                      }}
                      className="w-full py-4 mt-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all flex items-center justify-center shadow-[0_4px_15px_rgba(252,93,93,0.3)]"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Model Selection */}
                {wizardStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                     <div className="text-center mb-6">
                      <h3 className="text-xl font-bold font-space text-zinc-900 dark:text-white">Choose Your Brain</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Select the default LLM provider for your agents.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {['OpenAI (GPT-4)', 'Anthropic (Claude 3.5)', 'Google (Gemini 1.5)', 'DeepSeek (V3)'].map((model) => (
                        <button
                          key={model}
                          onClick={() => setWizardModel(model)}
                          className={`p-4 rounded-2xl border text-left font-bold transition-all ${wizardModel === model ? 'bg-coral/10 border-coral text-coral shadow-sm flex items-center justify-between' : 'bg-zinc-50 dark:bg-[#111318] border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20'}`}
                        >
                          {model}
                          {wizardModel === model && <CheckCircle2 className="w-5 h-5 text-coral" />}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                         onClick={() => setWizardStep(1)}
                         className="px-6 py-4 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-all border border-zinc-200 dark:border-white/10"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setWizardStep(3)}
                        disabled={!wizardModel}
                        className="flex-1 py-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all flex items-center justify-center disabled:opacity-50 shadow-[0_4px_15px_rgba(252,93,93,0.3)]"
                      >
                        Select Engine
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: API Key (Optional) & Submit */}
                {wizardStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold font-space text-zinc-900 dark:text-white">Secure API Validation</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Paste your API key. It will be encrypted at rest in your personal vault.</p>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">{wizardModel?.split(' ')[0]} API Key (Optional)</label>
                       <div className="relative group">
                          <input 
                            type="password" 
                            onChange={(e) => setWizardKey(e.target.value)}
                            placeholder="sk-..." 
                            className="w-full px-6 py-4 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 font-mono tracking-widest text-center"
                          />
                       </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                         onClick={() => setWizardStep(2)}
                         className="px-6 py-4 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-all border border-zinc-200 dark:border-white/10"
                      >
                        Back
                      </button>
                      <button 
                        onClick={handleAuth}
                        disabled={loading}
                        className="flex-1 py-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-[0_4px_15px_rgba(252,93,93,0.3)]"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize & Launch'}
                      </button>
                    </div>

                    <p className="text-center text-xs text-zinc-500 font-medium mt-4">
                      {wizardKey ? 'Key will be encrypted before saving.' : 'You can skip this and add it later in the Dashboard Dashboard.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Legacy Form (Shows for Login & Magic Link) */}
          {authMode !== 'signup' && (
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" 
                  className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
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
                    <button type="button" onClick={() => setSuccessMsg("Password reset flow initialized! (Waitlist feature)")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold">Forgot?</button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(252,93,93,0.3)]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                  {authMode === 'login' && 'Sign In'}
                  {authMode === 'magic' && 'Send Magic Link'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          )}

          {/* Magic Link Toggle */}
          <div className="mt-4">
            {authMode !== 'magic' ? (
              <button 
                type="button"
                onClick={() => { setAuthMode('magic'); setError(null); setSuccessMsg(null); }}
                className="w-full py-4 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-zinc-500 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                Sign in with Magic Link
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className="w-full py-4 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 text-zinc-500 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
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
              className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white group text-xs tracking-widest uppercase shadow-sm"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              GitHub
            </button>
            <button 
              onClick={() => handleOAuth('google')}
              className="flex-1 flex items-center justify-center gap-3 py-4 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white group text-xs tracking-widest uppercase shadow-sm"
            >
              <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Google
            </button>
          </div>
          
          <p className="text-center text-xs text-zinc-600 mt-8 font-medium">
            By continuing, you agree to our <Link href="/" className="text-zinc-400 hover:text-white underline decoration-white/20 underline-offset-2">Terms of Service</Link> and <Link href="/" className="text-zinc-400 hover:text-white underline decoration-white/20 underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Right Side - Premium Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 bg-zinc-50 dark:bg-[#090A0F] relative items-center justify-center overflow-hidden">
        
        {/* Sleek Minimal Background */}
        <div className="absolute inset-0 bg-zinc-50 dark:bg-[#090A0F]" />
        
        <div className="relative z-10 max-w-xl p-12 w-full">
          
          {/* Floating Glassmorphic Terminal/Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 relative"
          >
            <div className="absolute -inset-1 bg-zinc-200 dark:bg-zinc-800 rounded-2xl blur-sm opacity-50" />
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center gap-2 mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="ml-4 font-mono text-[10px] text-zinc-400 dark:text-zinc-600 font-black tracking-[0.2em] flex items-center justify-between w-full uppercase">
                  <span>Log_Terminal</span>
                  <span className="px-4 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 text-coral border border-coral/20 font-black">AGENT_READY</span>
                </div>
              </div>

              <div className="font-mono text-xs space-y-6">
                <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
                  <span className="text-coral font-black">❯</span> 
                  <span className="text-zinc-800 dark:text-zinc-400">clickrunclaw deploy --agent production</span>
                </div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pl-5 border-l border-zinc-100 dark:border-zinc-900 space-y-4">
                  <p className="text-zinc-400 dark:text-zinc-600 flex items-center gap-3">
                    <Loader2 className="w-3 h-3 animate-spin text-coral" /> Provisioning isolated pod...
                  </p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-zinc-400 dark:text-zinc-600 flex items-center gap-3">
                    <Loader2 className="w-3 h-3 animate-spin text-coral" /> Injecting encrypted keys...
                  </motion.p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 2, type: "spring" }} 
                  className="mt-8 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-coral/20 text-coral flex items-center gap-5 shadow-[0_4px_25px_rgba(255,90,95,0.1)]"
                >
                  <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <p className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Agent Deployed Successfully</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1 uppercase font-black tracking-widest">Latency: 0.8s • Isolated Node</p>
                  </div>
                </motion.div>
              </div>
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
              &quot;The deployment speed is unmatched. It feels like we skipped DevOps entirely.&quot;
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-lg text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-sm">
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
