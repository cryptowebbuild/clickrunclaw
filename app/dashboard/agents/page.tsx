'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Play, Square, RotateCw, Server, 
  Search, Plus, X, Activity, Globe, Cpu
} from 'lucide-react';

const mockAgents = [
  { id: 'agt_1a2b3c', name: 'Customer Support Bot', status: 'Pending Activation', ip: 'Pending', uptime: 'Offline', model: 'OpenClaw-7B' },
  { id: 'agt_4m5n6p', name: 'Sales Lead Gen', status: 'Ready to Boot', ip: 'Pending', uptime: 'Offline', model: 'GPT-4o-mini' },
  { id: 'agt_9x8y7z', name: 'Data Scraper Alpha', status: 'Pending Activation', ip: 'Pending', uptime: 'Offline', model: 'DeepSeek-Coder' },
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const filteredAgents = mockAgents.filter(agent => 
    agent?.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '') ||
    agent?.id?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-space mb-2">My Agents</h1>
          <p className="text-zinc-400">Manage, monitor, and configure your deployed AI agents.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Agents Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAgents.map((agent, i) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/10 transition-colors group"
          >
            {/* Info Section */}
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                agent.status === 'Ready to Boot' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.2)]' :
                'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                  {agent.name}
                  <span className="text-xs font-mono text-zinc-500 font-normal px-2 py-0.5 bg-black/50 rounded-md border border-white/5">
                    {agent.id}
                  </span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'Ready to Boot' ? 'bg-purple-500 animate-pulse' :
                      'bg-zinc-500'
                    }`} />
                    {agent.status}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    {agent.ip}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    {agent.model}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
              <button 
                onClick={() => setSelectedTerminal(agent.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/20 transition-all text-sm font-medium"
              >
                <Terminal className="w-4 h-4" />
                Open Terminal
              </button>
              
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/5">
                <button className="p-2 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Restart">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-md hover:bg-green-500/20 text-zinc-400 hover:text-green-400 transition-colors" title="Start">
                  <Play className="w-4 h-4 fill-current" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTerminal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col h-[60vh] max-h-[600px]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <span className="font-mono text-sm font-bold text-zinc-300">
                    root@{selectedTerminal}:~
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTerminal(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar bg-black relative">
                {/* Blurred Terminal Background */}
                <div className="absolute inset-0 p-4 blur-sm opacity-50 pointer-events-none select-none">
                  <div className="text-zinc-500 mb-4">
                    Welcome to ClickRunClaw Terminal<br/>
                    Connected to instance {selectedTerminal} (Pending Allocation)<br/>
                    Type &apos;help&apos; to see available commands.
                  </div>
                  <div className="text-yellow-400">[WAITING] Agent is ready for boot sequence.</div>
                  <div className="text-blue-400">[INFO] Awaiting activation signal...</div>
                  <div className="text-zinc-300 mt-2">
                    <span className="text-purple-500">root@{selectedTerminal}:~#</span>{' '}
                    <span>_</span>
                  </div>
                </div>

                {/* Paywall Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10">
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => {
                      setSelectedTerminal(null);
                      setShowPricingModal(true);
                    }}
                    className="relative group px-8 py-4 rounded-2xl bg-white text-black font-bold text-xl hover:bg-zinc-200 transition-all overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3">
                      🚀 Activate & Boot Agent
                    </span>
                  </motion.button>
                  <p className="mt-4 text-zinc-400 font-sans text-sm">Requires an active Pod subscription.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal Overlay */}
      <AnimatePresence>
        {showPricingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPricingModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" />
              
              <div className="p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold font-space mb-2">Select Your Cloud Pod</h2>
                    <p className="text-zinc-400">Deploy your OpenClaw agent instantly on our enterprise infrastructure.</p>
                  </div>
                  <button 
                    onClick={() => setShowPricingModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Starter Pod */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold font-space mb-2">Starter Pod</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-bold">$9</span>
                        <span className="text-zinc-400">/mo</span>
                      </div>
                      <ul className="space-y-4 mb-8 text-zinc-300">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                          1-Second Boot Time
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                          Bring Your Own Key (BYOK)
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                          Standard Support
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                          1 Active Instance
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          // TODO: Trigger Docker + SQLite orchestration API here upon successful payment
                          // e.g., await fetch('/api/orchestrate/boot', { method: 'POST', body: JSON.stringify({ plan: 'starter', agentId: selectedTerminal }) })
                          alert('Payment integration pending. This will trigger the Docker+SQLite orchestration.');
                        }}
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                      >
                        Upgrade to Boot
                      </button>
                    </div>
                  </div>

                  {/* Pro Pod */}
                  <div className="bg-white/5 border border-blue-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold font-space mb-2">Pro Pod</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-4xl font-bold">$29</span>
                        <span className="text-zinc-400">/mo</span>
                      </div>
                      <ul className="space-y-4 mb-8 text-zinc-300">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                          Instant Boot Time
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                          Multiple Instances (Up to 5)
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                          Dedicated IP Address
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                          Priority Support
                        </li>
                      </ul>
                      <button 
                        onClick={() => {
                          // TODO: Trigger Docker + SQLite orchestration API here upon successful payment
                          // e.g., await fetch('/api/orchestrate/boot', { method: 'POST', body: JSON.stringify({ plan: 'pro', agentId: selectedTerminal }) })
                          alert('Payment integration pending. This will trigger the Docker+SQLite orchestration.');
                        }}
                        className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                      >
                        Upgrade to Boot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
