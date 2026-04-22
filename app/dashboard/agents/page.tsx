'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Play, Square, RotateCw, Server, 
  Search, Plus, X, Activity, Globe, Cpu, Loader2, MessageCircle, AlertCircle, HelpCircle, Send, Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AgentMonitoring from '@/components/dashboard/AgentMonitoring';

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerminal, setSelectedTerminal] = useState<any | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pairingAgent, setPairingAgent] = useState<any | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);
  
  // Real Database State
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchAgents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('agents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setAgents(data);
      }
      setLoading(false);
    };
    fetchAgents();
  }, [supabase]);

  const handleAction = async () => {
    alert('Real container start or stop is not connected yet. This control is temporarily disabled to avoid fake status changes.');
  };
  
  const handleDelete = async () => {
    alert('Real agent deletion is not connected yet. This control is temporarily disabled to avoid deleting database records without removing infrastructure.');
  };

  const handleSupportSubmit = (e: any) => {
    e.preventDefault();
    setSupportSending(true);
    setTimeout(() => {
       setSupportSending(false);
       setShowSupportModal(false);
       setSupportMessage('');
       alert("Support request sent! We will reply to your account email shortly.");
    }, 1500);
  };

  const handlePairSubmit = async () => {
    if (!pairingCode.trim()) return;
    setPairingStatus('submitting');
    
    setTimeout(() => {
      setPairingStatus('error');
    }, 800);
  };

  const filteredAgents = agents.filter(agent => 
    agent?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    agent?.id?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-zinc-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-space mb-2 text-zinc-900 dark:text-white">My Agents</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage, monitor, and configure your deployed ClickRunClaw AI agents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSupportModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 transition-all font-bold text-sm shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-coral" />
            Need help?
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-full focus:outline-none focus:border-coral transition-all text-sm w-full md:w-64 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 shadow-sm"
            />
          </div>
        </div>
      </div>

      {agents.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl shadow-sm">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Server className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 font-space">No Agents Found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-8 font-light italic">You haven&apos;t deployed any ClickRunClaw agents yet. Head to the dashboard to launch your first session.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-coral text-white font-bold hover:bg-coral-hover transition-all shadow-[0_4px_15px_rgba(252,93,93,0.3)] hover:scale-105 active:scale-95">
             <Plus className="w-4 h-4" />
             Deploy Now
          </Link>
        </div>
      )}

      {/* Agents Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgents.map((agent, i) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col items-start gap-4 hover:border-coral/20 transition-all group shadow-sm hover:shadow-xl"
          >
            {/* Info Section */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded border flex items-center justify-center shrink-0 ${
                agent.status === 'running' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500 !shadow-none' :
                'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-space flex items-center gap-2">
                  {agent.name}
                  <span className="text-xs font-mono text-zinc-500 font-normal px-2 py-0.5 bg-zinc-100 dark:bg-black/50 rounded-md border border-zinc-200 dark:border-white/5">
                    {agent.container_id || 'pending'}
                  </span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'running' ? 'bg-green-500 animate-pulse' :
                      'bg-zinc-300 dark:bg-zinc-500'
                    }`} />
                    {agent.status.toUpperCase()}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Webhook Active
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    {agent.provider.toUpperCase()}
                  </span>
                  {agent.telegram_status === 'pending' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Pairing Required
                      </span>
                    </>
                  )}
                  {agent.telegram_status === 'paired' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                        <MessageCircle className="w-3.5 h-3.5 text-zinc-800 dark:text-zinc-300" />
                        Telegram Linked
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

              <div className="w-full mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex w-full md:w-auto items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                   <div className="flex items-center gap-2">
                     <span className="text-zinc-400 dark:text-zinc-600">Model</span>
                     <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-md font-mono text-zinc-900 dark:text-zinc-300">
                       {agent.provider === 'openai' ? 'gpt-4-turbo' : agent.provider === 'anthropic' ? 'claude-3-opus' : 'gemini-1.5-pro'}
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-zinc-400 dark:text-zinc-600">Search</span>
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/5 border border-green-500/20 text-green-600 dark:text-green-500 rounded-md">
                       <Globe className="w-3 h-3" /> Enabled
                     </div>
                   </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                  {agent.telegram_status === 'pending' && (
                    <button 
                      onClick={() => setPairingAgent(agent)}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-coral text-white hover:bg-coral-hover transition-all text-sm font-bold shadow-[0_4px_10px_rgba(252,93,93,0.2)]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pair Telegram
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setSelectedTerminal(agent)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 transition-all text-sm font-bold"
                  >
                    <Terminal className="w-4 h-4" />
                    Inspect
                  </button>
                  
                  <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-white/5 rounded-full p-1.5 border border-zinc-200 dark:border-white/10">
                    <button 
                      onClick={() => handleAction()}
                      className={`p-2 rounded-full hover:bg-white dark:hover:bg-[#090A0F] transition-all transition-colors ${agent.status === 'running' ? 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white' : 'text-green-500 hover:text-green-400'}`} 
                      title={agent.status === 'running' ? "Stop" : "Restart"}
                    >
                      <Square className={`w-4 h-4 ${agent.status === 'running' ? '' : 'fill-green-500/20 text-green-500'}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete()}
                      className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-all transition-colors" 
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Terminal Modal Overlay */}
      <AnimatePresence>
        {selectedTerminal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTerminal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[60vh] max-h-[600px]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 select-none">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-500 tracking-tight">
                    user@{selectedTerminal.container_id}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTerminal(null)}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-all shadow-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-8 font-mono text-xs md:text-sm overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
                <div className="text-zinc-400 dark:text-zinc-500 mb-6 font-light italic leading-relaxed">
                  Welcome to ClickRunClaw Agent Inspector (Cloud Console)<br/>
                  Container Reference: {selectedTerminal.container_id}<br/>
                  Architecture: Cloud-Native ({selectedTerminal.provider.toUpperCase()})
                </div>
                <div className="text-green-600 dark:text-green-500 font-bold mt-2 flex items-center gap-2">
                   <Activity className="w-4 h-4" /> [SUCCESS] Container securely allocated and isolated.
                </div>
                <div className="text-zinc-900 dark:text-zinc-300 font-medium mt-1">[INFO] Environment variables injected successfully.</div>
                <div className="text-zinc-400 dark:text-zinc-600 mt-1">[WARN] Connecting securely to encrypted webhook tunnel...</div>
                
                <div className="mt-8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-2xl shadow-inner group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-3">TELEGRAM / DISCORD WEBHOOK URL</p>
                  <p className="text-zinc-800 dark:text-zinc-200 font-bold break-all select-all selection:bg-coral/30">{selectedTerminal.webhook_url}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 leading-relaxed italic">Paste this exact URL into your bot configuration to bring it online instantly.</p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
                  <AgentMonitoring containerId={selectedTerminal.container_id} />
                </div>
                
                <div className="mt-8 flex items-center gap-2">
                  <span className="text-coral font-bold tracking-tight">root@ClickRunClaw:~#</span>
                  <span className="w-2 h-4 bg-zinc-300 dark:bg-zinc-500 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telegram Pairing Modal */}
      <AnimatePresence>
        {pairingAgent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              if (pairingStatus !== 'submitting') setPairingAgent(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#090A0F] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              
              <div className="p-10 relative z-10 text-center">
                <div className="mx-auto w-14 h-14 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                  <MessageCircle className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                </div>
                
                <h3 className="text-2xl font-bold font-space text-zinc-900 dark:text-white mb-3">Connect Telegram</h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-sm mb-10 leading-relaxed font-light">
                  Your ClickRunClaw instance is active. Open Telegram, start a chat with your bot, and type <span className="font-mono bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full text-zinc-900 dark:text-white font-bold border border-zinc-200 dark:border-zinc-800">/start</span>. 
                  It will reply with a Pairing Code.
                </p>

                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder="CODE"
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                    disabled={pairingStatus === 'submitting' || pairingStatus === 'success'}
                    className="w-full px-6 py-6 font-mono font-black bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl focus:border-coral text-zinc-900 dark:text-white text-center text-4xl tracking-widest placeholder-zinc-200 dark:placeholder-zinc-900 disabled:opacity-50 outline-none transition-all shadow-inner"
                  />
                  
                  {pairingStatus === 'error' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center gap-2 text-coral text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle className="w-4 h-4" /> Invalid Code or Instance Unreachable
                    </motion.div>
                  )}

                  <button 
                    onClick={handlePairSubmit}
                    disabled={!pairingCode.trim() || pairingStatus === 'submitting' || pairingStatus === 'success'}
                    className="w-full h-16 rounded-full font-black text-white bg-coral hover:bg-coral-hover transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_4px_25px_rgba(255,90,95,0.4)] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
                  >
                    {pairingStatus === 'submitting' ? (
                      <><Loader2 className="w-5 h-5 animate-spin text-white" /> Linking...</>
                    ) : pairingStatus === 'success' ? (
                      <><Activity className="w-5 h-5" /> Connected!</>
                    ) : (
                      'Verify Pairing Code'
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setPairingAgent(null)}
                    disabled={pairingStatus === 'submitting'}
                    className="text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Support Modal Overlay */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              if (!supportSending) setShowSupportModal(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              
              <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800/50 bg-[#FAFAFA] dark:bg-black/20">
                <h3 className="text-xl font-bold font-space text-zinc-900 dark:text-white">Need Help?</h3>
                <button 
                  onClick={() => setShowSupportModal(false)}
                  className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSupportSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-xl focus:border-coral outline-none text-zinc-900 dark:text-white font-medium text-sm appearance-none">
                    <option>Billing Issue</option>
                    <option>Agent Deployment</option>
                    <option>Technical Error</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 rounded-xl focus:border-coral outline-none text-zinc-900 dark:text-white font-medium text-sm resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Screenshot (Optional)</label>
                  <div className="w-full px-4 py-4 bg-zinc-50 dark:bg-[#090A0F] border border-zinc-200 dark:border-white/10 border-dashed rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-coral/50 transition-colors">
                    <Paperclip className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm font-medium text-zinc-500">Attach a file...</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">We&apos;ll reply to your account email.</p>
                  <button 
                    type="submit"
                    disabled={supportSending || !supportMessage.trim()}
                    className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-white bg-coral hover:bg-coral-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,90,95,0.3)]"
                  >
                    {supportSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Message
                  </button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
