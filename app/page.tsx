'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Key, Webhook, ChevronRight, TerminalSquare, Server, ShieldCheck, Zap,
  MessageSquare, Send, Phone, MessageCircle, Globe, Smartphone,
  Mail, Slack, Github, FileText, XCircle, CheckCircle2, Clock, ChevronDown,
  Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

import StaticHeader from './components/StaticHeader';
import Footer from './components/Footer';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  const handleWhopCheckout = (planId: string) => {
    if (!user) {
      // If the user isn't logged in, intercept the checkout and force them to auth first
      // Pass the plan intent so after auth, we can auto-route them or just have them in the dashboard
      router.push(`/auth?intent=checkout&plan=${planId}`);
      return;
    }
    const userId = user?.id || '';
    const userEmail = user?.email || '';
    const checkoutUrl = `https://whop.com/checkout/${planId}?custom_user_id=${userId}&email=${encodeURIComponent(userEmail)}`;
    window.location.href = checkoutUrl;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090A0F] text-zinc-900 dark:text-zinc-100 overflow-x-hidden selection:bg-coral/30 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-dots opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <StaticHeader />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 md:pt-40 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 md:mb-10 relative"
          >
            <div className="absolute inset-0 bg-coral rounded-full blur-[80px] opacity-10" />
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border border-white/10 dark:border-white/5 bg-[#0D1117] shadow-2xl flex items-center justify-center p-0">
              <div className="w-full h-full relative">
                <Image 
                  src="/mascot.webp" 
                  alt="ClickRunClaw Mascot" 
                  fill 
                  className="object-cover scale-110" 
                  priority
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 md:gap-8 mb-8 md:mb-12"
          >
            <h1 className="text-[2.75rem] md:text-8xl font-black tracking-tighter font-space text-zinc-900 dark:text-white leading-[1.1] flex flex-col items-center">
              Deploy Your <span className="text-coral">OpenClaw Agent</span> in 1 Second.
            </h1>
            
            <div className="flex flex-col items-center gap-4 md:gap-5">
              <span className="text-[#FF5A5F] font-mono font-bold tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-xs uppercase bg-[#FF5A5F]/5 px-6 py-2 rounded-full border border-[#FF5A5F]/10">
                SCALABLE CLOUD FOR OPENCLAW
              </span>
              
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full border border-coral/20 bg-coral/5 text-[9px] md:text-xs text-coral font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,90,95,0.1)]">
                <Zap className="w-3.5 h-3.5 fill-coral" />
                <span>Zero Config • 24/7 Uptime • Auto-Webhooks</span>
              </div>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 mb-8 md:mb-12 max-w-2xl font-medium leading-relaxed"
          >
            Stop hosting OpenClaw locally. Run your AI Agents on our premium 24/7 cloud infrastructure. Get instant Telegram & Discord webhooks in 1-click.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0 mb-16 md:mb-24"
          >
            <Link 
              href="/auth"
              className="group relative flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-[#FF5A5F] text-white font-bold text-lg hover:bg-[#fa4a4a] transition-all w-full sm:w-auto shadow-[0_10px_40px_-10px_rgba(255,90,95,0.5)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features"
              className="flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-zinc-600 dark:text-white font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full sm:w-auto shadow-sm"
            >
              See Showcase
            </Link>
          </motion.div>

          {/* Quick Start Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl px-4"
          >
            <div className="flex items-center gap-4 mb-6 text-left">
              <div className="w-10 h-10 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center">
                <TerminalSquare className="w-5 h-5 text-coral" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white font-space tracking-tight">Quick Start</h2>
            </div>
            
            <div className="relative rounded-3xl bg-[#0D1117] border border-white/10 shadow-3xl overflow-hidden terminal-shadow">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.3)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.3)]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.3)]" />
                </div>
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 font-mono">zsh</div>
                </div>
              </div>
              <div className="p-8 md:p-12 font-mono text-sm md:text-base space-y-4 text-left">
                <div className="flex gap-4">
                  <span className="text-[#FF5A5F] shrink-0">$</span>
                  <p className="text-zinc-300">curl -sSL <span className="text-cyan-400">https://get.clickrunclaw.com</span> | bash</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-zinc-500 shrink-0">#</span>
                  <p className="text-zinc-500 italic">Initializing one-click cloud container...</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-400 shrink-0">✓</span>
                  <p className="text-zinc-300">Environment provisioned (Hetzner Cloud)</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-400 shrink-0">✓</span>
                  <p className="text-zinc-300">Connected to <span className="text-[#FF5A5F] font-bold">@OpenClawAgent_Bot</span></p>
                </div>
                <div className="pt-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-green-500 font-bold text-xs uppercase tracking-widest">System Live & Operational</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
 
        {/* Bento Grid Features Section */}
        <section id="features" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space tracking-tight">Enterprise Architecture. <br className="hidden md:block" /><span className="text-zinc-500">Zero Configuration.</span></h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">We handle the complex cloud infrastructure, routing, and security. You just focus on your agent&apos;s logic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[340px]">
              {/* Feature 1: Large Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="md:col-span-2 bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 hover:border-coral/20 rounded-3xl p-10 relative overflow-hidden transition-all group shadow-sm hover:shadow-2xl hover:shadow-coral/5"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,90,95,0.05),transparent_60%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 flex items-center justify-center mb-8 border border-coral/20">
                    <Server className="w-7 h-7 text-[#FF5A5F]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-4 font-space text-zinc-900 dark:text-white tracking-tight">Federated Instance Architecture</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl text-md">
                      Isolation is at our core. Every agent instance runs in a strictly partitioned environment mapping to isolated local SQLite databases. It means 0 latency responses, infinitely scalable infrastructure, and zero hardware overhead for you.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 2: Small Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 hover:border-coral/20 rounded-3xl p-10 relative overflow-hidden transition-all shadow-sm group hover:shadow-2xl hover:shadow-zinc-500/5 text-left"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 flex items-center justify-center mb-6 border border-coral/20">
                    <Webhook className="w-7 h-7 text-[#FF5A5F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 font-space text-zinc-900 dark:text-white tracking-tight">Auto-Pairing</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      Drop in your Telegram or Discord Bot Token and we handle the connectivity, webhooks, and long-polling instantly.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 3: Small Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 hover:border-coral/20 rounded-3xl p-10 relative overflow-hidden transition-all shadow-sm group hover:shadow-2xl hover:shadow-zinc-500/5 text-left"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 flex items-center justify-center mb-6 border border-coral/20">
                    <Key className="w-7 h-7 text-[#FF5A5F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 font-space text-zinc-900 dark:text-white tracking-tight">BYO Keys</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      Bring Your Own Key to use OpenRouter, Gemini, or OpenAI directly with your ClickRunClaw instance. Maintain full control.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 4: Large Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="md:col-span-2 bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 hover:border-coral/20 rounded-3xl p-10 relative overflow-hidden transition-all group shadow-sm hover:shadow-2xl shadow-[#FF5A5F]/5"
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 flex items-center justify-center mb-8 border border-coral/20 text-left">
                    <ShieldCheck className="w-7 h-7 text-[#FF5A5F]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-3xl font-bold mb-4 font-space text-zinc-900 dark:text-white tracking-tight">Bank-Grade Security</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg text-lg">
                      API keys are encrypted at rest using AES-256. Containers are ephemeral and strictly isolated. Your private conversational data never trains our models.
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* Platform Deployment Grid */}
        <section className="py-24 px-4 relative border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090A0F]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight text-zinc-900 dark:text-white">One-click deploy across 6 platforms.</h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light">Your agent, everywhere your users are.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Web Chat', icon: MessageSquare },
                { name: 'Telegram', icon: Send },
                { name: 'WhatsApp', icon: Phone },
                { name: 'Discord', icon: MessageCircle },
                { name: 'Feishu', icon: Globe },
                { name: 'WeChat', icon: Smartphone },
              ].map((platform, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 flex items-center justify-between group hover:border-coral/40 transition-all shadow-sm hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF5A5F]/5 border border-coral/10 flex items-center justify-center group-hover:bg-[#FF5A5F]/10 transition-colors">
                      <platform.icon className="w-6 h-6 text-[#FF5A5F]" />
                    </div>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white font-space tracking-tight">{platform.name}</span>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                    Included
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations & Tools */}
        <section className="py-24 px-4 relative border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#090A0F]">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 font-space tracking-tight text-zinc-900 dark:text-white">Connect Your Favorite Apps.</h2>
            
            <div className="flex flex-wrap justify-center gap-8 mb-20">
              {[
                { name: 'Gmail', icon: Mail },
                { name: 'Slack', icon: Slack },
                { name: 'GitHub', icon: Github },
                { name: 'Notion', icon: FileText },
                { name: 'Discord', icon: MessageCircle },
              ].map((app, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:border-coral/40 transition-all cursor-pointer shadow-md"
                >
                  <app.icon className="w-7 h-7 text-zinc-800 dark:text-zinc-300" />
                </motion.div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto">
              <h3 className="text-xs text-zinc-400 dark:text-zinc-500 mb-8 font-mono uppercase tracking-[0.3em] font-black">Extend with Open-Source Tools</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Firecrawl', 'Playwright', 'yt-dlp', 'Puppeteer', 'FFmpeg', 'LangChain'].map((tool, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="px-6 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:border-coral/40 dark:hover:border-coral/40 transition-all cursor-default shadow-sm"
                  >
                    {tool}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 px-4 relative border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090A0F]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight text-zinc-900 dark:text-white">Skip the VDS Setup. Host in the Cloud.</h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">Why risk exposing your home network or leaving a PC on 24/7?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {/* DIY Card */}
              <div className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-sm">
                <h3 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white font-space flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-zinc-400" />
                  </div>
                  Local AI (DIY)
                </h3>
                <ul className="space-y-6">
                  {[
                    'Requires keeping PC on 24/7',
                    'Manual port-forwarding required',
                    'Exposes your home IP address',
                    'Agent fails if network drops',
                    'High hardware wear and tear',
                    'Zero mobile accessibility'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-zinc-500 dark:text-zinc-400 text-base">
                      <XCircle className="w-5 h-5 text-zinc-200 dark:text-zinc-800 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ClickRunClaw Card */}
              <div className="bg-white dark:bg-[#111318] border border-coral/30 dark:border-coral/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,90,95,0.05),transparent_70%)] pointer-events-none" />
                <h3 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white font-space flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-coral" />
                  </div>
                  ClickRunClaw Cloud
                </h3>
                <ul className="space-y-6 relative z-10">
                  {[
                    '1-Click Agent Deployment',
                    'Instant secure HTTPS webhooks',
                    '100% Mobile-first infrastructure',
                    'Guaranteed 24/7 Uptime',
                    'Isolated Docker security',
                    'Pay-as-you-grow pricing'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-zinc-800 dark:text-zinc-200 text-base font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4 relative border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#090A0F]">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space tracking-tight text-zinc-900 dark:text-white">Simple pricing. <br/>Scale clearly.</h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light">Start small, grow safely. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Starter Tier */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-12 flex flex-col shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-2 font-space text-zinc-900 dark:text-zinc-100">Starter</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">Perfect for testing and small projects.</p>
                <div className="flex flex-col gap-2 mb-8 border-b border-zinc-100 dark:border-zinc-900 pb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-zinc-400 dark:text-zinc-600 line-through font-medium">$12.49</span>
                    <span className="text-[10px] sm:text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-extrabold tracking-tighter text-zinc-900 dark:text-white">$9.99</span>
                    <span className="text-base text-zinc-500 font-medium">/month</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-5 mb-10 flex-grow">
                  {[
                    '1 Active Agent',
                    'Standard Support',
                    'Community Plugins',
                    'Basic Analytics'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-500" />
                      </div>
                      <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleWhopCheckout('plan_T8nSbRxGGTlly')}
                  className="flex items-center justify-center w-full h-14 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-zinc-800 dark:border-zinc-700 text-white font-bold text-base hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all hover:scale-[1.02] shadow-lg"
                >
                  Get Started
                </button>
              </motion.div>

              {/* Pro Tier */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-white dark:bg-[#111318] border border-coral/40 dark:border-coral/20 rounded-[2.5rem] p-12 flex flex-col shadow-[0_15px_60px_rgba(255,90,95,0.15)]"
              >
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-coral text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_4px_10px_rgba(255,90,95,0.4)]">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 font-space text-zinc-900 dark:text-white">Pro</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">For serious builders and agencies who need more room without losing stability.</p>
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
                <ul className="flex flex-col gap-5 mb-10 flex-grow">
                  {[
                    '5 Agents Included',
                    '2 Active Agents at a Time',
                    'Priority 24/7 Support',
                    'All Premium Plugins',
                    'Advanced Analytics',
                    'Custom Domains',
                    'White-label Webhooks'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
                      </div>
                      <span className="text-zinc-800 dark:text-zinc-200 text-sm font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleWhopCheckout('plan_Bhg70HYNZqmJV')}
                  className="flex items-center justify-center w-full h-14 rounded-full bg-coral text-white font-bold text-base hover:bg-coral-hover transition-all shadow-[0_4px_25px_rgba(255,90,95,0.4)] hover:scale-[1.02]"
                >
                  Go Pro
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 relative border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090A0F]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-light">Everything you need to know about ClickRunClaw.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  q: "What exactly is ClickRunClaw?",
                  a: "ClickRunClaw is a 1-Click Cloud Hosting infrastructure explicitly built for OpenClaw AI Agents. Instead of keeping a Windows/Mac PC running 24/7 or renting complicated Linux VPS servers, you just click 'Deploy' and we instantly host your agent in a secure, isolated container."
                },
                {
                  q: "Do I need my own API Key? (BYOK)",
                  a: "Yes. ClickRunClaw is a BYOK (Bring Your Own Key) platform. You bring your own LLM API keys (OpenAI, Anthropic, or DeepSeek). This means you only pay us for the server hosting, and you pay the AI provider exactly for what you use without any hidden markup."
                },
                {
                  q: "How many agents can I deploy?",
                  a: "Our Starter plan ($9.99/mo) allows 1 active agent. The Pro plan ($29.99/mo) includes up to 5 agents total, with 2 active at a time on the current infrastructure."
                },
                {
                  q: "How do Telegram and Discord Webhooks work?",
                  a: "When you deploy an agent, we automatically generate a secure HTTPS webhook endpoint. You just paste this URL into Telegram's @BotFather or Discord's Developer portal, and your agent connects instantly. No local port-forwarding or Ngrok needed."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-zinc-50 dark:bg-[#111318] border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-sm">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-200 mb-4 font-space text-lg">{faq.q}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 rounded-2xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-bold text-lg font-space text-zinc-900 dark:text-zinc-200 group-hover:text-coral transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-800 transition-all ${isOpen ? 'bg-coral border-coral rotate-180 text-white' : 'bg-transparent text-zinc-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-8 pb-6 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

