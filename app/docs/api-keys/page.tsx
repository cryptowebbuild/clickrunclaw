import StaticHeader from '../../components/StaticHeader';
import Footer from '../../components/Footer';
import { Key } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Get API Keys | ClickRunClaw Docs',
  description: 'A quick guide to finding and generating API keys for OpenAI, Anthropic, DeepSeek, and Google Gemini.',
};

export default function ApiKeysDocsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 selection:bg-coral selection:text-white font-sans relative overflow-x-hidden">
      <StaticHeader />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-24 relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-coral/20 bg-coral/5 text-[10px] md:text-xs text-coral font-bold tracking-wider uppercase mb-8">
            <Key className="w-3.5 h-3.5" />
            <span>Setup Guide</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space mb-6 tracking-tight text-zinc-900 dark:text-white">
            Connecting Your Brain.
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-500 font-light leading-relaxed">
            ClickRunClaw is a <strong>BYOK (Bring Your Own Key)</strong> platform. This means you have zero markup on AI processing. Follow the instructions below to generate your keys.
          </p>
        </div>

        <div className="space-y-12">
          {/* OpenAI */}
          <section id="openai" className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <h2 className="text-2xl font-bold font-space dark:text-white mb-4">OpenAI (GPT-4)</h2>
             <ol className="list-decimal pl-5 space-y-3 text-zinc-600 dark:text-zinc-400">
               <li>Navigate to the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">OpenAI Platform Dashboard</a>.</li>
               <li>Log in with your OpenAI account.</li>
               <li>Click on <strong>&quot;Create new secret key&quot;</strong>.</li>
               <li>Provide a name (e.g., &quot;ClickRunClaw Agent&quot;) and save the generated <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded text-sm text-zinc-800 dark:text-zinc-200">sk-...</code> key securely.</li>
             </ol>
          </section>

          {/* Anthropic */}
          <section id="anthropic" className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <h2 className="text-2xl font-bold font-space dark:text-white mb-4">Anthropic (Claude)</h2>
             <ol className="list-decimal pl-5 space-y-3 text-zinc-600 dark:text-zinc-400">
               <li>Open the <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">Anthropic Console</a>.</li>
               <li>Click on <strong>&quot;Create Key&quot;</strong> in the top right.</li>
               <li>Name your key and click <strong>&quot;Create Key&quot;</strong>. Note that Anthropic will only show this key once.</li>
             </ol>
          </section>

          {/* DeepSeek */}
          <section id="deepseek" className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <h2 className="text-2xl font-bold font-space dark:text-white mb-4">DeepSeek (V3)</h2>
             <ol className="list-decimal pl-5 space-y-3 text-zinc-600 dark:text-zinc-400">
               <li>Go to the <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">DeepSeek Platform</a>.</li>
               <li>Navigate to the API Keys section on the left sidebar.</li>
               <li>Click <strong>&quot;Create API Key&quot;</strong> and copy the result. Make sure your DeepSeek account has available credit.</li>
             </ol>
          </section>

          {/* Google Gemini */}
          <section id="gemini" className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
             <h2 className="text-2xl font-bold font-space dark:text-white mb-4">Google Gemini</h2>
             <ol className="list-decimal pl-5 space-y-3 text-zinc-600 dark:text-zinc-400">
               <li>Head over to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-coral hover:underline font-bold">Google AI Studio</a>.</li>
               <li>Click the prominent <strong>&quot;Create API key&quot;</strong> button.</li>
               <li>Select a Google Cloud project or let it create a new one for you.</li>
               <li>Copy the generated key. Google offers a generous free tier for Gemini models!</li>
             </ol>
          </section>
        </div>

        <div className="mt-16 text-center">
          <Link href="/dashboard" className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform inline-flex">
            Return to Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
