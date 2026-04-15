'use client';

import { motion } from 'motion/react';
import { Activity, Cpu, HardDrive, Terminal, Search, FileText, CheckCircle2, Power, Globe, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock Data
const activeAgents = [
  { id: 'agt_1a2b3c', name: 'Customer Support Bot', status: 'Running', cpu: '12%', ram: '1.2GB/15GB', uptime: '14d 2h' },
  { id: 'agt_9x8y7z', name: 'Data Scraper Alpha', status: 'Stopped', cpu: '0%', ram: '0GB/15GB', uptime: 'Offline' },
];

const mockLogs = [
  "[INFO] Starting Docker container agt_1a2b3c...",
  "[INFO] Pulling image openclaw/agent:latest...",
  "[SUCCESS] Image pulled successfully.",
  "[INFO] Initializing environment variables...",
  "[INFO] Connecting to Supabase database...",
  "[SUCCESS] Database connected.",
  "[INFO] Starting agent server on port 3000...",
  "[SUCCESS] Agent is live and listening for webhooks.",
  "[WARN] High memory usage detected in module: memory_buffer",
  "[INFO] Processing incoming webhook from Telegram...",
  "[SUCCESS] Reply sent in 1.2s."
];

export default function DashboardOverview() {
  const [logs, setLogs] = useState<string[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [fileReaderEnabled, setFileReaderEnabled] = useState(false);

  // Simulate typing logs
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < mockLogs.length) {
        setLogs(prev => [...prev, mockLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-space mb-2">Overview</h1>
        <p className="text-zinc-400">Monitor your active agents and system health.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Instances (Spans 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-space flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              Active Instances
            </h2>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-medium text-purple-400">
              1 / 5 Agents Running
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 text-sm">
                  <th className="pb-3 font-medium">Agent Name</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">CPU</th>
                  <th className="pb-3 font-medium">RAM</th>
                  <th className="pb-3 font-medium">Uptime</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeAgents.map((agent, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-4">
                      <div className="font-medium text-white">{agent.name}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-1">{agent.id}</div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${agent.status === 'Running' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className={agent.status === 'Running' ? 'text-green-400' : 'text-red-400'}>{agent.status}</span>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-300 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-zinc-500" /> {agent.cpu}
                    </td>
                    <td className="py-4 text-zinc-300">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-zinc-500" /> {agent.ram}
                      </div>
                    </td>
                    <td className="py-4 text-zinc-300">{agent.uptime}</td>
                    <td className="py-4 text-right">
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                        <Power className={`w-4 h-4 ${agent.status === 'Running' ? 'text-red-400' : 'text-green-400'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Skills Toggle */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col">
          <h2 className="text-xl font-bold font-space flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-blue-400" />
            Quick Actions
          </h2>
          
          <div className="space-y-4 flex-1">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-white">Web Search</div>
                  <div className="text-xs text-zinc-500">Allow agent to browse</div>
                </div>
              </div>
              <button 
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${webSearchEnabled ? 'bg-blue-500' : 'bg-zinc-700'}`}
              >
                <motion.div 
                  layout
                  className="w-4 h-4 bg-white rounded-full absolute top-1"
                  initial={false}
                  animate={{ left: webSearchEnabled ? 'calc(100% - 1.25rem)' : '0.25rem' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-white">File Reader</div>
                  <div className="text-xs text-zinc-500">Parse PDF/CSV</div>
                </div>
              </div>
              <button 
                onClick={() => setFileReaderEnabled(!fileReaderEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${fileReaderEnabled ? 'bg-purple-500' : 'bg-zinc-700'}`}
              >
                <motion.div 
                  layout
                  className="w-4 h-4 bg-white rounded-full absolute top-1"
                  initial={false}
                  animate={{ left: fileReaderEnabled ? 'calc(100% - 1.25rem)' : '0.25rem' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Terminal Widget (Spans full width) */}
        <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-50" />
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-mono text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              Live Container Logs
            </h2>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
          </div>

          <div className="font-mono text-sm h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {logs.map((log, i) => {
              let colorClass = "text-zinc-300";
              if (log?.includes("[INFO]")) colorClass = "text-blue-400";
              if (log?.includes("[SUCCESS]")) colorClass = "text-green-400";
              if (log?.includes("[WARN]")) colorClass = "text-yellow-400";
              if (log?.includes("[ERROR]")) colorClass = "text-red-400";

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={colorClass}
                >
                  <span className="text-zinc-600 mr-2">{new Date().toISOString().split('T')[1].split('.')[0]}</span>
                  {log}
                </motion.div>
              );
            })}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-purple-500">root@clickrunclaw:~#</span>
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-white"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
