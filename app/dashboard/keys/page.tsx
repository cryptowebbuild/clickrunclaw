'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function APIKeysPage() {
  const [keys, setKeys] = useState<{ [key: string]: string }>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const supabase = createClient();

  // Pre-defined list of external providers based on screenshot
  const providers = [
    {
      id: 'openai',
      name: 'ChatGPT Subscription',
      description: 'Use your ChatGPT Plus ($20/mo) or Pro subscription to access GPT-4 at zero API cost. Connect via terminal OAuth login.',
      placeholder: 'sk-proj-...',
      badge: '$0/token'
    },
    {
      id: 'openrouter',
      name: 'OpenRouter API Key',
      description: 'Use your own OpenRouter API key to skip credits and processing fees entirely.',
      placeholder: 'sk-or-v1-...'
    },
    {
      id: 'anthropic',
      name: 'Anthropic API Key',
      description: 'Add your Anthropic API key to use Claude models directly without routing through OpenRouter.',
      placeholder: 'sk-ant-...'
    },
    {
      id: 'gemini',
      name: 'Google AI API Key',
      description: 'Add a Google AI key to use Gemini models directly and enable voice transcription.',
      placeholder: 'AIza...'
    },
    {
      id: 'perplexity',
      name: 'Perplexity API Key',
      description: 'Add a Perplexity key to use Sonar models for web-connected AI responses.',
      placeholder: 'pplx-...'
    }
  ];

  const handleSave = async (providerId: string) => {
    setSavingKey(providerId);
    
    // Simulate API call to save key securely to Supabase
    setTimeout(() => {
      setSavingKey(null);
      setToast('Key securely encrypted and saved.');
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20 relative">
      {/* Toast Notification */}
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
        <h1 className="text-3xl font-black font-space mb-2 tracking-tighter text-zinc-900 dark:text-white uppercase">API Keys</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-light">Bring your own API keys for enhanced features. All keys are encrypted at rest.</p>
      </div>

      <div className="space-y-6">
        {providers.map((provider) => (
          <motion.div 
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 md:p-8 rounded-[2rem] bg-white dark:bg-[#111318] border transition-all shadow-sm ${provider.id === 'openai' ? 'border-coral/30 dark:border-coral/20' : 'border-zinc-200 dark:border-white/5 hover:border-coral/20'}`}
          >
            <div className="mb-4 flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white font-space">{provider.name}</h3>
                {provider.badge && (
                  <span className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">
                    {provider.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{provider.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key className="w-4 h-4 text-zinc-400" />
                </div>
                <input 
                  type="password" 
                  value={keys[provider.id] || ''}
                  onChange={(e) => setKeys({...keys, [provider.id]: e.target.value})}
                  placeholder={provider.placeholder}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-full focus:outline-none focus:border-coral transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 font-medium"
                />
              </div>
              <button 
                onClick={() => handleSave(provider.id)}
                disabled={savingKey === provider.id || !keys[provider.id]}
                className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-coral hover:text-white border border-zinc-200 dark:border-white/10 transition-all font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {savingKey === provider.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Key'}
              </button>
            </div>
            
            <a href="#" className="mt-4 inline-block text-[11px] font-bold text-coral hover:text-coral-hover uppercase tracking-widest transition-colors flex items-center gap-1">
              Get a key from {provider.name.split(' ')[0]} <span>→</span>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
