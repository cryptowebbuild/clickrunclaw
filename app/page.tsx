'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, Key, Webhook, ChevronRight, TerminalSquare, Server, ShieldCheck, Zap,
  MessageSquare, Send, Phone, MessageCircle, Globe, Smartphone,
  Mail, Slack, Github, FileText, XCircle, CheckCircle2, Clock, ChevronDown,
  Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-20" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight font-space group">
            <TerminalSquare className="w-6 h-6 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <span>ClickRun<span className="text-purple-500">Claw</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-center min-h-[44px] px-5 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Go to Dashboard
                </Link>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-white/10">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="hidden md:flex items-center justify-center min-h-[44px] px-5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all backdrop-blur-md"
              >
                Sign In
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <Link href="/security" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-zinc-300 hover:text-white transition-colors">Security</Link>
                <Link href="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-zinc-300 hover:text-white transition-colors">Privacy</Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-zinc-300 hover:text-white transition-colors">Blog</Link>
                <div className="pt-4 border-t border-white/10 mt-2">
                  {user ? (
                    <Link 
                      href="/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center min-h-[48px] w-full text-base font-bold text-black bg-white hover:bg-zinc-200 rounded-xl transition-all"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link 
                      href="/auth" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center min-h-[48px] w-full text-base font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer">
              <span className="text-orange-500 font-bold">H</span>
              <span>Featured on IndieHunt</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 max-w-5xl font-space leading-[1.1]"
          >
            1-Click Cloud Deployment <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x">
              for OpenClaw AI Agents
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-zinc-400 mb-10 max-w-3xl font-light leading-relaxed"
          >
            Skip the Mac Mini. Deploy your custom OpenClaw AI agents to Telegram, Discord, and Web instantly—in under 1 second.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link 
              href="/auth"
              className="group relative flex items-center justify-center gap-2 min-h-[60px] px-10 rounded-full bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all w-full sm:w-auto overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Deploy in 1 Second (Free Setup) <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              href="#features"
              className="flex items-center justify-center gap-2 min-h-[60px] px-10 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all w-full sm:w-auto backdrop-blur-md"
            >
              View Architecture
            </Link>
          </motion.div>

          {/* Mock Terminal UI */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full max-w-4xl mt-24 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20" />
            <div className="relative rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="mx-auto text-xs text-zinc-500 font-mono">agent-deploy.sh</div>
              </div>
              <div className="p-6 text-left font-mono text-sm md:text-base text-zinc-300 space-y-2 overflow-x-auto">
                <p><span className="text-purple-400">~</span> $ clickrunclaw deploy --agent openclaw</p>
                <p className="text-zinc-500">Initializing enterprise cloud instance...</p>
                <p className="text-green-400">✓ Dedicated AI Pod allocated</p>
                <p className="text-zinc-500">Injecting encrypted API keys...</p>
                <p className="text-green-400">✓ Keys secured in isolated vault</p>
                <p className="text-zinc-500">Starting OpenClaw runtime...</p>
                <p className="text-blue-400">→ Agent is live at: https://agent-xyz.clickrunclaw.com</p>
                <p className="text-purple-400 animate-pulse">_</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
              {/* Feature 1: Large Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-6">
                    <Server className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-space">Zero-Ops Serverless Architecture</h3>
                    <p className="text-zinc-400 leading-relaxed max-w-md">
                      Every OpenClaw agent runs in its own dedicated, military-grade sandboxed environment. Enjoy lightning-fast 1-second boot times with our premium Enterprise-Grade Cloud Instances.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 2: Small Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 mb-6">
                    <Webhook className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-space">Instant Skill Integration</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Connect your OpenClaw agents to the Web, Telegram, and Discord seamlessly. Extend their capabilities instantly without writing a single line of integration code.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 3: Small Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/30 transition-colors"
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full group-hover:bg-green-500/20 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 mb-6">
                    <Key className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-space">Unrestricted API Access (BYOK)</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Bring Your Own Key to use OpenRouter or Gemini APIs directly with your OpenClaw instance. Maintain full control over your billing and models with zero platform markup.
                    </p>
                  </div>
                </div>
              </motion.article>

              {/* Feature 4: Large Bento Box */}
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
              >
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700 mb-6">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-space">Bank-Grade Security</h3>
                    <p className="text-zinc-400 leading-relaxed max-w-md">
                      API keys are encrypted at rest using AES-256. Containers are ephemeral and destroyed upon termination. Your data never trains our models.
                    </p>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* Platform Deployment Grid */}
        <section className="py-24 px-4 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight">One-click deploy across 6 platforms.</h2>
              <p className="text-xl text-zinc-400 font-light">Your agent, everywhere your users are.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Web Chat', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { name: 'Telegram', icon: Send, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
                { name: 'WhatsApp', icon: Phone, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                { name: 'Discord', icon: MessageCircle, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                { name: 'Feishu', icon: Globe, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
                { name: 'WeChat', icon: Smartphone, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              ].map((platform, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${platform.bg} ${platform.border} border flex items-center justify-center`}>
                      <platform.icon className={`w-6 h-6 ${platform.color}`} />
                    </div>
                    <span className="text-lg font-medium text-white font-space">{platform.name}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                    Included
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations & Tools */}
        <section className="py-24 px-4 relative border-t border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 font-space tracking-tight">Connect Your Favorite Apps.</h2>
            
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
                  className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <app.icon className="w-8 h-8 text-zinc-300" />
                </motion.div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto">
              <h3 className="text-xl text-zinc-400 mb-8 font-space">Extend with Open-Source Tools</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {['Firecrawl', 'Playwright', 'yt-dlp', 'Puppeteer', 'FFmpeg', 'LangChain'].map((tool, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium hover:border-purple-500/50 hover:text-white hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-default"
                  >
                    {tool}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 px-4 relative border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight">Skip the DevOps. Ship your AI Agent.</h2>
              <p className="text-xl text-zinc-400 font-light">Why spend weeks building infrastructure when you can deploy in seconds?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* DIY Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden opacity-80">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full" />
                <h3 className="text-2xl font-bold mb-6 text-zinc-300 font-space flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  DIY Hosting
                </h3>
                <ul className="space-y-4">
                  {[
                    'Provision VPS & configure Linux',
                    'Setup Docker & networking',
                    'Manage SSL certificates',
                    'Build CI/CD pipelines',
                    'Monitor uptime & logs',
                    'Handle security patches'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400">
                      <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ClickRunClaw Card */}
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.1)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
                <h3 className="text-2xl font-bold mb-6 text-white font-space flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ClickRunClaw
                </h3>
                <ul className="space-y-4 relative z-10">
                  {[
                    '1-Click deployment',
                    'Instant secure webhook URL',
                    'Pre-configured Docker environment',
                    'Automatic SSL & routing',
                    'Built-in monitoring',
                    'Zero maintenance required'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-200">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-4 relative border-t border-white/5 bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space tracking-tight">Simple pricing. <br/>Scale infinitely.</h2>
              <p className="text-xl text-zinc-400 font-light">Start small, grow massive. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Starter Tier */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-2 font-space">Starter</h3>
                <p className="text-zinc-400 mb-6">Perfect for testing and small projects.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold tracking-tighter">$9</span>
                  <span className="text-xl text-zinc-400 font-medium">/month</span>
                </div>
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  {[
                    '1 Active Agent',
                    'Standard Support',
                    'Community Plugins',
                    'Basic Analytics'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/auth"
                  className="flex items-center justify-center w-full min-h-[56px] rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>

              {/* Pro Tier */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-b from-purple-900/40 to-black backdrop-blur-xl border border-purple-500/50 rounded-[2rem] p-8 flex flex-col shadow-[0_0_40px_rgba(124,58,237,0.15)]"
              >
                <div className="absolute top-0 right-8 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 font-space text-white">Pro</h3>
                <p className="text-purple-200/70 mb-6">For serious builders and agencies.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold tracking-tighter text-white">$29</span>
                  <span className="text-xl text-purple-200/50 font-medium">/month</span>
                </div>
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  {[
                    '5 Active Agents',
                    'Priority 24/7 Support',
                    'All Premium Plugins',
                    'Advanced Analytics',
                    'Custom Domains',
                    'White-label Webhooks'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                      <span className="text-zinc-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/auth"
                  className="flex items-center justify-center w-full min-h-[56px] rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Go Pro
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 relative border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-space tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need to know how to use Docker?",
                  a: "Not at all. We handle all the containerization, networking, and deployment behind the scenes. You just click deploy."
                },
                {
                  q: "Can I use my own API keys?",
                  a: "Yes! You bring your own API keys for LLMs (OpenAI, Anthropic, DeepSeek, etc.). We don&apos;t mark up your AI usage."
                },
                {
                  q: "How fast is the deployment?",
                  a: "Thanks to our warm-pooling technology, your agent is typically live and ready to receive webhooks in under 30 seconds."
                },
                {
                  q: "Is my data secure?",
                  a: "Absolutely. Each agent runs in an isolated container. API keys are encrypted at rest, and we never use your data for training."
                }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg font-space">
            <TerminalSquare className="w-5 h-5 text-purple-500" />
            <span>ClickRunClaw</span>
          </div>
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} ClickRunClaw. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-white/5 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-medium text-lg font-space">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-5 text-zinc-400 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

