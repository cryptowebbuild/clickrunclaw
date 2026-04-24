'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Server, RotateCcw,
  Search, Plus, X, Globe, Loader2, MessageCircle, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AgentMonitoring from '@/components/dashboard/AgentMonitoring';

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerminal, setSelectedTerminal] = useState<any | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  // Real Database State
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const fetchAgents = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
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

  useEffect(() => {
    fetchAgents();
  }, [supabase]);

  const handleRetry = async (agent: any) => {
    setRetryingId(agent.id);
    setFeedback(null);

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agent.name,
          provider: agent.provider,
          apiKey: agent.api_key_secure,
          telegramToken: agent.telegram_bot_token,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Retry failed');
      }

      setFeedback('Retry queued on real server. Refreshing status...');
      await fetchAgents();
    } catch (err: any) {
      setFeedback(err.message || 'Retry failed');
    } finally {
      setRetryingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const supportEmail = 'support@clickrunclaw.com';

  const filteredAgents = agents.filter(agent => 
    agent?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    agent?.id?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-zinc-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[120] rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111318] px-5 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-100 shadow-xl"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-space mb-2 text-zinc-900 dark:text-white">My Agents</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage, monitor, and configure your deployed ClickRunClaw AI agents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${supportEmail}?subject=${encodeURIComponent('ClickRunClaw support request')}`}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111318] border border-zinc-200 dark:border-white/10 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 transition-all font-bold text-sm shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-coral" />
            Need help?
          </a>
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
                    {agent.container_id || 'not mapped'}
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
                    {agent.webhook_url ? 'Webhook Ready' : 'Webhook Pending'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <span className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    {agent.provider.toUpperCase()}
                  </span>
                  {agent.telegram_status && agent.telegram_status !== 'none' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Telegram setup coming soon
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

              <div className="w-full mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex w-full md:w-auto items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 flex-wrap">
                   <div className="flex items-center gap-2">
                     <span className="text-zinc-400 dark:text-zinc-600">Provider</span>
                     <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-md font-mono text-zinc-900 dark:text-zinc-300 uppercase">
                       {agent.provider}
                     </div>
                   </div>
                   {agent.created_at && (
                     <div className="flex items-center gap-2">
                       <span className="text-zinc-400 dark:text-zinc-600">Created</span>
                       <div className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-md text-zinc-900 dark:text-zinc-300">
                         {new Date(agent.created_at).toLocaleDateString()}
                       </div>
                     </div>
                   )}
                </div>

                <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                  {agent.status === 'failed' && (
                    <button
                      onClick={() => handleRetry(agent)}
                      disabled={retryingId === agent.id}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-coral text-white hover:bg-coral-hover border border-coral/80 transition-all text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {retryingId === agent.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Retry Deploy
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedTerminal(agent)}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 transition-all text-sm font-bold"
                  >
                    <Terminal className="w-4 h-4" />
                    Details
                  </button>
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
                    user@{selectedTerminal.container_id || 'pending'}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTerminal(null)}
                  className="p-2 rounded-full hover:bg-white dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-all shadow-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-3">Agent details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
                      <div className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest mb-2">Status</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase">{selectedTerminal.status || 'unknown'}</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
                      <div className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest mb-2">Provider</div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase">{selectedTerminal.provider || 'unknown'}</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 md:col-span-2">
                      <div className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest mb-2">Container reference</div>
                      <div className="font-mono text-zinc-900 dark:text-zinc-100 break-all">{selectedTerminal.container_id || 'Not assigned yet'}</div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 md:col-span-2">
                      <div className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-widest mb-2">Webhook URL</div>
                      <div className="font-mono text-zinc-900 dark:text-zinc-100 break-all">{selectedTerminal.webhook_url || 'Not generated yet'}</div>
                    </div>
                  </div>
                </div>

                {selectedTerminal.container_id ? (
                  <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-5 text-sm text-blue-800 dark:text-blue-200">
                      Infrastructure mapping is currently linked to Coolify service <span className="font-mono break-all">{selectedTerminal.container_id}</span>. This confirms the deployment request was attached to a real Coolify resource.
                    </div>
                    <AgentMonitoring containerId={selectedTerminal.container_id} />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 p-5 text-sm text-amber-800 dark:text-amber-200">
                    Real infrastructure mapping is still missing for this agent, so live monitoring is not available yet.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}
