'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalSquare, ChevronRight, Zap, Bot, BrainCircuit, Key, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI (GPT-4)', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { id: 'anthropic', name: 'Anthropic (Claude)', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg' },
  { id: 'deepseek', name: 'DeepSeek (V3)', icon: '/mascot.webp' }, // Placeholder for deepseek icon, using mascot
  { id: 'gemini', name: 'Google Gemini', icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg' }
];

export default function OnboardingWizard() {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);
  
  const [step, setStep] = useState(1);
  const [agentName, setAgentName] = useState('');
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');

  // Validate user session, if no session, back to auth
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      }
    });
  }, [supabase, router]);

  const handleNext = () => setStep(prev => prev + 1);

  const handleComplete = (skipped = false) => {
    // Save pending deployment to localStorage
    const pendingAgent = {
      name: agentName || 'My Awesome Agent',
      provider: provider,
      apiKey: skipped ? '' : apiKey,
    };
    localStorage.setItem('CR_PENDING_DEPLOY', JSON.stringify(pendingAgent));
    
    // Flag onboarding as completed
    localStorage.setItem('CR_ONBOARDED', 'true');
    
    // Redirect to dashboard where paywall will trigger
    router.push('/dashboard?deploy=true');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans flex flex-col justify-center relative overflow-hidden">
      {/* Background Dots */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.3]">
        <div className="absolute inset-0 bg-grid-dots [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 relative z-10">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-coral text-white shadow-[0_0_15px_rgba(255,90,95,0.4)]' : 'bg-zinc-200 dark:bg-white/5 text-zinc-400'}`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 md:w-32 h-1 mx-2 rounded-full transition-all ${step > s ? 'bg-coral/50' : 'bg-zinc-200 dark:bg-white/5'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Steps Container */}
        <div className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center mb-6">
                  <Bot className="w-6 h-6 text-coral" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black font-space text-zinc-900 dark:text-white mb-3">
                  Welcome to ClickRunClaw!
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                  Let&apos;s get your first autonomous agent ready. What should we call it?
                </p>
                
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. SalesBot-Alpha" 
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && agentName && handleNext()}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-2xl focus:border-coral transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 outline-none font-medium mb-auto"
                />

                <button 
                  onClick={handleNext}
                  disabled={!agentName.trim()}
                  className="w-full mt-8 min-h-[56px] bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6 text-blue-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black font-space text-zinc-900 dark:text-white mb-3 tracking-tight">
                  Choose the Brain
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                  Select the underlying LLM provider for <strong className="text-zinc-900 dark:text-zinc-200">{agentName}</strong>. You can change this later.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-auto">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${provider === p.id ? 'bg-coral/5 border-coral shadow-[0_0_15px_rgba(255,90,95,0.2)]' : 'bg-zinc-50 dark:bg-[#090A0F] border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${provider === p.id ? 'border-coral' : 'border-zinc-300 dark:border-zinc-700'}`}>
                        {provider === p.id && <div className="w-2 h-2 rounded-full bg-coral animate-fade-in" />}
                      </div>
                      <span className="font-bold text-zinc-900 dark:text-white">{p.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 min-h-[56px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 min-h-[56px] bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(37,99,235,0.4)] flex items-center justify-center uppercase tracking-widest text-sm"
                  >
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Key className="w-6 h-6 text-green-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black font-space text-zinc-900 dark:text-white mb-3 tracking-tight">
                  Connect Provider
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                  Provide your {PROVIDERS.find(p=>p.id === provider)?.name} API Key. <br/>
                  <span className="text-sm border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded text-zinc-400 mt-2 inline-block">If you don&apos;t have it, skip for now.</span>
                </p>
                
                <input 
                  type="password" 
                  autoFocus
                  placeholder="sk-..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComplete(false)}
                  className="w-full px-6 py-4 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-2xl focus:border-green-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 outline-none font-mono mb-4"
                />
                
                <Link href="/docs/api-keys" target="_blank" className="text-xs font-bold text-coral hover:underline inline-flex items-center mb-auto">
                  How do I get my {PROVIDERS.find(p=>p.id === provider)?.name} API Key?
                </Link>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button 
                    onClick={() => handleComplete(true)}
                    className="flex-1 py-4 border border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 font-bold rounded-full transition-all text-xs uppercase tracking-widest text-center"
                  >
                    Skip & Set Up Later
                  </button>
                  <button 
                    onClick={() => handleComplete(false)}
                    className="flex-[2] py-4 bg-coral hover:bg-coral-hover text-white font-black rounded-full transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] flex items-center justify-center uppercase tracking-widest text-sm"
                  >
                    Finalize Deployment
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
